<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Config\Database;
use Backend\Models\ProductComment;
use Backend\Utils\RateLimiter;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/ProductComment.php';
require_once __DIR__ . '/../utils/RateLimiter.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class ProductCommentController extends BaseController
{
    /* ── Public: list visible comments for a product ────────── */
    public function publicIndex(array $params): void
    {
        $productId = (int) ($params['productId'] ?? 0);
        if ($productId <= 0) {
            Response::error('Invalid product ID', 422);
        }

        $model = new ProductComment();
        Response::success($model->findVisibleByProduct($productId), 'Fetched successfully');
    }

    /* ── Public: post a new comment ──────────────────────────── */
    public function store(array $params = []): void
    {
        RateLimiter::enforce('product_comment', 5, 300);

        $productId = (int) ($params['productId'] ?? 0);
        if ($productId <= 0) {
            Response::error('Invalid product ID', 422);
        }

        $payload = Validator::sanitizeInput($this->body());

        $errors = [];
        $name = trim((string) ($payload['name'] ?? ''));
        if ($name === '') {
            $errors['name'] = 'Name is required.';
        }
        $email = trim((string) ($payload['email'] ?? ''));
        if ($email === '') {
            $errors['email'] = 'Email is required.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email address is required.';
        }
        $comment = trim((string) ($payload['comment'] ?? ''));
        if ($comment === '') {
            $errors['comment'] = 'Comment is required.';
        } elseif (mb_strlen($comment) < 3) {
            $errors['comment'] = 'Comment must be at least 3 characters.';
        }

        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $pdo = Database::connection();
        $exists = $pdo->prepare('SELECT id FROM products WHERE id = :id LIMIT 1');
        $exists->execute([':id' => $productId]);
        if (!$exists->fetch()) {
            Response::error('Product not found', 404);
        }

        $editToken = bin2hex(random_bytes(32));

        $model = new ProductComment();
        $id = $model->create([
            'product_id' => $productId,
            'name'       => $name,
            'email'      => $email,
            'comment'    => $comment,
            'edit_token' => $editToken,
            'status'     => 'visible',
        ]);

        $row = $model->find($id);

        Response::success([
            'id'         => (int) $row['id'],
            'product_id' => (int) $row['product_id'],
            'name'       => $row['name'],
            'comment'    => $row['comment'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
            'edit_token' => $editToken,
        ], 'Comment posted successfully', 201);
    }

    /* ── Public: edit own comment (requires matching edit_token) ─ */
    public function update(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid comment ID', 422);
        }

        $payload = Validator::sanitizeInput($this->body());
        $editToken = trim((string) ($payload['edit_token'] ?? ''));
        if ($editToken === '') {
            Response::error('Missing edit token', 403);
        }

        $model = new ProductComment();
        $existing = $model->findByEditToken($id, $editToken);
        if (!$existing) {
            Response::error('You are not allowed to edit this comment', 403);
        }

        $comment = trim((string) ($payload['comment'] ?? ''));
        if ($comment === '') {
            Response::error('Comment is required.', 422, ['fields' => ['comment' => 'Comment is required.']]);
        }
        if (mb_strlen($comment) < 3) {
            Response::error('Comment must be at least 3 characters.', 422, ['fields' => ['comment' => 'Comment must be at least 3 characters.']]);
        }

        $model->update($id, ['comment' => $comment]);
        $row = $model->find($id);

        Response::success([
            'id'         => (int) $row['id'],
            'product_id' => (int) $row['product_id'],
            'name'       => $row['name'],
            'comment'    => $row['comment'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
        ], 'Comment updated successfully');
    }

    /* ── Public: delete own comment (requires matching edit_token) ─ */
    public function destroy(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid comment ID', 422);
        }

        $payload = Validator::sanitizeInput($this->body());
        $editToken = trim((string) ($payload['edit_token'] ?? ''));
        if ($editToken === '') {
            Response::error('Missing edit token', 403);
        }

        $model = new ProductComment();
        $existing = $model->findByEditToken($id, $editToken);
        if (!$existing) {
            Response::error('You are not allowed to delete this comment', 403);
        }

        $model->delete($id);

        Response::success(null, 'Comment deleted successfully');
    }

    /* ── Admin: list all comments (with product name) ───────── */
    public function index(array $params = []): void
    {
        $query = $this->query();
        $page    = max(1, (int) ($query['page'] ?? 1));
        $perPage = max(1, min(100, (int) ($query['per_page'] ?? 20)));
        $productId = (int) ($query['product_id'] ?? 0);
        $search = trim((string) ($query['search'] ?? ''));

        $where = [];
        $bind  = [];

        if ($productId > 0) {
            $where[] = 'pc.product_id = :product_id';
            $bind[':product_id'] = $productId;
        }
        if ($search !== '') {
            $where[] = '(pc.name LIKE :search OR pc.email LIKE :search OR pc.comment LIKE :search OR p.name LIKE :search)';
            $bind[':search'] = '%' . $search . '%';
        }

        $pdo = Database::connection();
        $whereSql = $where !== [] ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $pdo->prepare(
            "SELECT COUNT(*) AS aggregate FROM product_comments pc JOIN products p ON p.id = pc.product_id {$whereSql}"
        );
        $countStmt->execute($bind);
        $total = (int) (($countStmt->fetch())['aggregate'] ?? 0);

        $offset = ($page - 1) * $perPage;
        $dataStmt = $pdo->prepare(
            "SELECT pc.*, p.name AS product_name, p.slug AS product_slug
             FROM product_comments pc
             JOIN products p ON p.id = pc.product_id
             {$whereSql}
             ORDER BY pc.created_at DESC
             LIMIT :limit OFFSET :offset"
        );
        foreach ($bind as $key => $value) {
            $dataStmt->bindValue($key, $value);
        }
        $dataStmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $dataStmt->execute();
        $data = $dataStmt->fetchAll() ?: [];

        Response::success([
            'data' => $data,
            'meta' => [
                'page'        => $page,
                'per_page'    => $perPage,
                'total'       => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ], 'Fetched successfully');
    }

    /* ── Admin: delete any comment (moderation) ──────────────── */
    public function adminDestroy(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid comment ID', 422);
        }

        $model = new ProductComment();
        if (!$model->find($id)) {
            Response::error('Comment not found', 404);
        }

        $model->delete($id);

        Response::success(null, 'Comment deleted successfully');
    }
}
