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
}
