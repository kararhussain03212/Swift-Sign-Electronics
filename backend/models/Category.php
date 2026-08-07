<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Category extends BaseModel
{
    protected string $table = 'categories';
    protected array $fillable = [
        'cat_key', 'name', 'icon', 'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }

    public function catKeyExists(string $catKey, ?int $excludeId = null): bool
    {
        $sql = 'SELECT id FROM ' . $this->table . ' WHERE cat_key = :cat_key';
        $params = [':cat_key' => $catKey];

        if ($excludeId !== null) {
            $sql .= ' AND id != :exclude_id';
            $params[':exclude_id'] = $excludeId;
        }

        $stmt = $this->pdo->prepare($sql . ' LIMIT 1');
        $stmt->execute($params);

        return $stmt->fetch() !== false;
    }

    public function getProductCount(string $categoryName): int
    {
        if (trim($categoryName) === '') {
            return 0;
        }
        $stmt = $this->pdo->prepare('SELECT COUNT(*) as total FROM products WHERE category = :category AND is_active = 1');
        $stmt->execute([':category' => $categoryName]);
        $result = $stmt->fetch();
        return (int) ($result['total'] ?? 0);
    }

    /**
     * Products store a denormalized copy of the category name rather than a
     * live foreign key, so a rename has to be cascaded here to keep already
     * saved products in sync.
     */
    public function renameInProducts(string $oldName, string $newName): void
    {
        if ($oldName === '' || $oldName === $newName) {
            return;
        }

        $stmt = $this->pdo->prepare('UPDATE products SET category = :new WHERE category = :old');
        $stmt->execute([':new' => $newName, ':old' => $oldName]);
    }
}
