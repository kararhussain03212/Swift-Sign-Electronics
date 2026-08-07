<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\BlogCategory;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/BlogCategory.php';

final class BlogCategoryController extends BaseCrudController
{
    protected string $modelClass = BlogCategory::class;
    protected string $resourceName = 'blog-categories';
    protected array $requiredCreateFields = ['name'];

    public function store(array $params = []): void
    {
        $this->requirePermission('create_content');
        $model = new BlogCategory();
        $payload = Validator::sanitizeInput($this->body());

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $requestedSlug = isset($payload['slug']) ? trim((string) $payload['slug']) : '';
        $payload['slug'] = $this->uniqueSlug($model, $requestedSlug !== '' ? $requestedSlug : (string) $payload['name']);

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

        $model = new BlogCategory();
        $existing = $model->find($id);
        if (!$existing) {
            Response::error('Resource not found', 404);
        }

        $payload = Validator::sanitizeInput($this->body());
        $name = (string) ($payload['name'] ?? $existing['name']);
        $requestedSlug = isset($payload['slug']) ? trim((string) $payload['slug']) : (string) ($existing['slug'] ?? '');
        $payload['slug'] = $this->uniqueSlug($model, $requestedSlug !== '' ? $requestedSlug : $name, $id);

        $ok = $model->update($id, $payload);
        if (!$ok) {
            Response::error('No changes were applied', 422);
        }

        if ($name !== $existing['name']) {
            $model->renameInPosts($existing['name'], $name);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Updated successfully');
    }

    /**
     * Slugify the requested value, then disambiguate against existing rows
     * so `slug` stays unique (mirrors CategoryController::uniqueSlug()).
     */
    private function uniqueSlug(BlogCategory $model, string $requested, ?int $excludeId = null): string
    {
        $base = $this->slugify($requested);
        if ($base === '') {
            $base = 'category';
        }

        $slug = $base;
        $suffix = 2;
        while ($model->slugExists($slug, $excludeId)) {
            $slug = $base . '-' . $suffix;
            $suffix++;
        }

        return $slug;
    }
}
