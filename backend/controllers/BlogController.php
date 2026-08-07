<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\BlogPost;
use Backend\Models\Setting;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/BlogPost.php';
require_once __DIR__ . '/../models/Setting.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class BlogController extends BaseCrudController
{
    protected string $modelClass = BlogPost::class;
    protected string $resourceName = 'blog';
    protected array $requiredCreateFields = ['title'];

    /**
     * Public listing. Only ever returns published posts whose published_at
     * has already passed (or is unset, meaning "publish immediately").
     *
     * With no page/limit/search/category params, returns the full published
     * list as a flat array (used by the frontend's bulk context load, same
     * shape as before). With any of those params present, returns a
     * paginated {data, meta} shape supporting composable search + category
     * filtering, for the Blog listing page's grid + "Load More".
     */
    public function publicIndex(array $params = []): void
    {
        $query = $this->query();
        $hasListParams = isset($query['page']) || isset($query['limit'])
            || isset($query['per_page']) || trim((string) ($query['search'] ?? '')) !== ''
            || trim((string) ($query['category'] ?? '')) !== '';

        $cacheKey = 'public:blog:list:' . http_build_query($query);
        $result = Cache::remember($cacheKey, function () use ($query, $hasListParams) {
            $model = new BlogPost();

            if ($hasListParams) {
                $page     = max(1, (int) ($query['page'] ?? 1));
                $perPage  = max(1, min(50, (int) ($query['limit'] ?? $query['per_page'] ?? 9)));
                $search   = trim((string) ($query['search'] ?? ''));
                $category = trim((string) ($query['category'] ?? ''));

                return $model->paginatePublished($page, $perPage, $search, $category);
            }

            return $model->allPublished();
        });

        Response::success($result, 'Fetched successfully');
    }

    public function store(array $params = []): void
    {
        $this->requirePermission('create_content');
        $model = new BlogPost();
        $raw = $this->body();
        $payload = Validator::sanitizeInput($raw);
        // Preserve raw HTML body without sanitization
        if (isset($raw['body'])) {
            $payload['body'] = trim((string) $raw['body']);
        }

        $errors = Validator::required($payload, $this->requiredCreateFields);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $requestedSlug = isset($payload['slug']) ? trim((string) $payload['slug']) : '';
        $payload['slug'] = $this->uniqueSlug($model, $requestedSlug !== '' ? $requestedSlug : (string) $payload['title']);

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

        $model = new BlogPost();
        $existing = $model->find($id);
        if (!$existing) {
            Response::error('Resource not found', 404);
        }

        $raw = $this->body();
        $payload = Validator::sanitizeInput($raw);
        // Preserve raw HTML body without sanitization
        if (array_key_exists('body', $raw)) {
            $payload['body'] = trim((string) $raw['body']);
        }

        if (isset($payload['slug']) || isset($payload['title'])) {
            $requestedSlug = isset($payload['slug']) ? trim((string) $payload['slug']) : '';
            $fallback = $requestedSlug !== '' ? $requestedSlug : (string) ($payload['title'] ?? $existing['title']);
            $payload['slug'] = $this->uniqueSlug($model, $fallback, $id);
        }

        $ok = $model->update($id, $payload);
        if (!$ok) {
            Response::error('No changes were applied', 422);
        }

        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);
        Cache::clearAll();

        Response::success($model->find($id), 'Updated successfully');
    }

    /**
     * Slugify the requested value, then disambiguate against existing rows
     * so `slug` stays unique (mirrors CategoryController::uniqueSlug()).
     */
    private function uniqueSlug(BlogPost $model, string $requested, ?int $excludeId = null): string
    {
        $base = $this->slugify($requested);
        if ($base === '') {
            $base = 'post';
        }

        $slug = $base;
        $suffix = 2;
        while ($model->slugExists($slug, $excludeId)) {
            $slug = $base . '-' . $suffix;
            $suffix++;
        }

        return $slug;
    }

    public function publicShowBySlug(array $params): void
    {
        $slug = (string) ($params['slug'] ?? '');
        if ($slug === '') {
            Response::error('Invalid slug', 422);
        }

        $post = Cache::remember('public:blog:slug:' . $slug, static function () use ($slug) {
            $model = new BlogPost();
            return $model->findBySlug($slug);
        });

        $publishedAt = $post['published_at'] ?? null;
        $isFuturePublish = $publishedAt !== null && strtotime((string) $publishedAt) > time();

        if (!$post || !($post['is_published'] ?? 0) || $isFuturePublish) {
            Response::error('Blog post not found', 404);
        }

        Response::success($post, 'Fetched successfully');
    }

    public function publicSearch(array $params = []): void
    {
        $q = trim((string) ($this->query()['q'] ?? ''));
        if ($q === '') {
            Response::success([], 'No query provided');
            return;
        }

        $results = Cache::remember('public:blog:search:' . md5($q), static function () use ($q) {
            $model = new BlogPost();
            return $model->search($q);
        });

        Response::success($results, 'Search results');
    }

    public function publicBlogSettings(array $params = []): void
    {
        try {
            $data = Cache::remember('public:blog-settings', static function () {
                try {
                    $model = new Setting();
                    $all = $model->asMap(false);
                    $blog = [];
                    foreach ($all as $key => $value) {
                        if (str_starts_with((string) $key, 'blog_')) {
                            $blog[$key] = $value;
                        }
                    }
                    return $blog;
                } catch (\Throwable $e) {
                    error_log('Blog settings fetch error: ' . $e->getMessage());
                    return [];
                }
            });
            Response::success($data, 'Blog settings fetched');
        } catch (\Throwable $e) {
            error_log('Cache error in blog settings: ' . $e->getMessage());
            Response::success([], 'Blog settings fetched');
        }
    }

    public function adminUpdateBlogSettings(array $params = []): void
    {
        $payload = $this->body();
        if (!is_array($payload) || $payload === []) {
            Response::error('Payload required', 422);
        }

        $model = new Setting();
        $model->upsertMany($payload);

        ActivityLogger::log($this->currentAdminId(), 'update', 'blog-settings', null);
        Cache::clearAll();

        Response::success(null, 'Blog settings updated');
    }
}
