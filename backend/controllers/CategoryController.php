<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Category;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Category.php';

final class CategoryController extends BaseCrudController
{
    protected string $modelClass = Category::class;
    protected string $resourceName = 'categories';
    protected array $requiredCreateFields = ['name'];

    public function index(array $params = []): void
    {
        $model = new Category();
        $query = $this->query();

        if (($query['paginate'] ?? '1') === '1') {
            $result = $model->paginate($query);
            foreach ($result['data'] as &$item) {
                $item['products_count'] = $model->getProductCount($item['name']);
            }
            Response::success($result, 'Fetched successfully');
        }

        $items = $model->all($query);
        foreach ($items as &$item) {
            $item['products_count'] = $model->getProductCount($item['name']);
        }
        Response::success($items, 'Fetched successfully');
    }

    public function store(array $params = []): void
    {
        $this->requirePermission('create_content');
        $model = new Category();
        $payload = Validator::sanitizeInput($this->body());

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $payload['cat_key'] = $this->uniqueSlug($model, (string) ($payload['cat_key'] ?? ''), (string) $payload['name']);

        $id = $model->create($payload);
        ActivityLogger::log($this->currentAdminId(), 'create', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Created successfully', 201);
    }

    public function update(array $params): void
    {
        $this->requirePermission('edit_content');
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid resource ID', 422);
        }

        $model = new Category();
        $existing = $model->find($id);
        if (!$existing) {
            Response::error('Resource not found', 404);
        }

        $payload = Validator::sanitizeInput($this->body());
        $name = (string) ($payload['name'] ?? $existing['name']);
        $requestedKey = (string) ($payload['cat_key'] ?? $existing['cat_key'] ?? '');
        $payload['cat_key'] = $this->uniqueSlug($model, $requestedKey, $name, $id);

        $ok = $model->update($id, $payload);
        if (!$ok) {
            Response::error('No changes were applied', 422);
        }

        if ($name !== $existing['name']) {
            $model->renameInProducts($existing['name'], $name);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Updated successfully');
    }

    /**
     * Slugify the requested key (or fall back to the name), then disambiguate
     * against existing rows so `cat_key` stays unique.
     */
    private function uniqueSlug(Category $model, string $requestedKey, string $name, ?int $excludeId = null): string
    {
        $base = $this->slugify($requestedKey !== '' ? $requestedKey : $name);
        if ($base === '') {
            $base = 'category';
        }

        $slug = $base;
        $suffix = 2;
        while ($model->catKeyExists($slug, $excludeId)) {
            $slug = $base . '-' . $suffix;
            $suffix++;
        }

        return $slug;
    }
}
