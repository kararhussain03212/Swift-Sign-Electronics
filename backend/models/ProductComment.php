<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class ProductComment extends BaseModel
{
    protected string $table = 'product_comments';
    protected array $fillable = [
        'product_id', 'name', 'email', 'comment', 'edit_token', 'status',
    ];

    protected function defaultOrderBy(): string
    {
        return 'created_at DESC, id DESC';
    }

    public function findVisibleByProduct(int $productId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, product_id, name, comment, created_at, updated_at FROM ' . $this->table
            . ' WHERE product_id = :product_id AND status = "visible" ORDER BY created_at DESC'
        );
        $stmt->execute([':product_id' => $productId]);

        return $stmt->fetchAll() ?: [];
    }

    public function findByEditToken(int $id, string $editToken): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM ' . $this->table . ' WHERE id = :id AND edit_token = :edit_token LIMIT 1'
        );
        $stmt->execute([':id' => $id, ':edit_token' => $editToken]);
        $row = $stmt->fetch();

        return $row !== false ? $row : null;
    }
}
