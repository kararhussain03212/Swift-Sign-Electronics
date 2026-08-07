<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class BlogPost extends BaseModel
{
    protected string $table = 'blog_posts';
    protected array $fillable = [
        'title', 'slug', 'excerpt', 'body', 'cover',
        'category', 'category_color',
        'author_name', 'author_avatar', 'author_role',
        'read_time', 'tags', 'featured',
        'is_published', 'published_at', 'sort_order',
    ];

    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $sql = 'SELECT id FROM ' . $this->table . ' WHERE slug = :slug';
        $params = [':slug' => $slug];

        if ($excludeId !== null) {
            $sql .= ' AND id != :exclude_id';
            $params[':exclude_id'] = $excludeId;
        }

        $stmt = $this->pdo->prepare($sql . ' LIMIT 1');
        $stmt->execute($params);

        return $stmt->fetch() !== false;
    }

    public function search(string $query): array
    {
        $like = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $query) . '%';
        $sql = 'SELECT * FROM blog_posts WHERE is_published = 1
            AND (published_at IS NULL OR published_at <= NOW())
            AND (
                title LIKE :q1 OR excerpt LIKE :q2 OR category LIKE :q3 OR
                author_name LIKE :q4 OR tags LIKE :q5
            ) ORDER BY sort_order ASC, published_at DESC LIMIT 30';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':q1' => $like, ':q2' => $like, ':q3' => $like, ':q4' => $like, ':q5' => $like]);
        $rows = $stmt->fetchAll() ?: [];

        return array_map(fn (array $row): array => $this->normalizeUploadColumns($row), $rows);
    }

    private const VISIBILITY_WHERE = 'is_published = 1 AND (published_at IS NULL OR published_at <= NOW())';

    /**
     * All publicly-visible (published, non-future-dated) posts, unpaginated.
     */
    public function allPublished(): array
    {
        $stmt = $this->pdo->query(
            'SELECT * FROM blog_posts WHERE ' . self::VISIBILITY_WHERE . ' ORDER BY sort_order ASC, published_at DESC'
        );
        $rows = $stmt->fetchAll() ?: [];

        return array_map(fn (array $row): array => $this->normalizeUploadColumns($row), $rows);
    }

    /**
     * Publicly-visible posts, paginated and optionally filtered by category
     * (exact match) and/or search (LIKE across title/excerpt/category/author/tags).
     */
    public function paginatePublished(int $page, int $perPage, string $search, string $category): array
    {
        $where = [self::VISIBILITY_WHERE];
        $bind  = [];

        if ($category !== '' && strcasecmp($category, 'All') !== 0) {
            $where[] = 'category = :category';
            $bind[':category'] = $category;
        }

        if ($search !== '') {
            $where[] = '(title LIKE :s1 OR excerpt LIKE :s2 OR category LIKE :s3 OR author_name LIKE :s4 OR tags LIKE :s5)';
            $like = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $search) . '%';
            $bind[':s1'] = $like;
            $bind[':s2'] = $like;
            $bind[':s3'] = $like;
            $bind[':s4'] = $like;
            $bind[':s5'] = $like;
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        $countStmt = $this->pdo->prepare("SELECT COUNT(*) AS aggregate FROM blog_posts {$whereSql}");
        $countStmt->execute($bind);
        $total = (int) (($countStmt->fetch())['aggregate'] ?? 0);

        $offset = ($page - 1) * $perPage;
        $dataStmt = $this->pdo->prepare(
            "SELECT * FROM blog_posts {$whereSql} ORDER BY sort_order ASC, published_at DESC LIMIT :limit OFFSET :offset"
        );
        foreach ($bind as $key => $value) {
            $dataStmt->bindValue($key, $value);
        }
        $dataStmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $dataStmt->execute();
        $rows = $dataStmt->fetchAll() ?: [];
        $data = array_map(fn (array $row): array => $this->normalizeUploadColumns($row), $rows);

        return [
            'data' => $data,
            'meta' => [
                'page'        => $page,
                'per_page'    => $perPage,
                'total'       => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ];
    }
}
