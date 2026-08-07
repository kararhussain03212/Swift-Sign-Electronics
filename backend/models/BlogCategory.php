<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class BlogCategory extends BaseModel
{
    protected string $table = 'blog_categories';
    protected array $fillable = [
        'name', 'slug', 'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }

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

    /**
     * Blog posts store a denormalized copy of the category name rather than a
     * live foreign key, so a rename has to be cascaded here to keep already
     * saved posts in sync (mirrors Category::renameInProducts()).
     */
    public function renameInPosts(string $oldName, string $newName): void
    {
        if ($oldName === '' || $oldName === $newName) {
            return;
        }

        $stmt = $this->pdo->prepare('UPDATE blog_posts SET category = :new WHERE category = :old');
        $stmt->execute([':new' => $newName, ':old' => $oldName]);
    }
}
