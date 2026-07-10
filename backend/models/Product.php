<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Product extends BaseModel
{
    protected string $table = 'products';
    protected array $fillable = [
        'name', 'slug', 'category', 'brand', 'model',
        'price', 'discount', 'rating', 'reviews', 'stock',
        'thumbnail', 'images', 'description',
        'introduction', 'specifications', 'shipping_list',
        'featured', 'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id DESC';
    }

    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM ' . $this->table . ' WHERE slug = :slug AND is_active = 1 LIMIT 1'
        );
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row !== false ? $this->normalizeRow($row) : null;
    }

    private function normalizeRow(array $row): array
    {
        $jsonCols = ['images', 'introduction', 'specifications', 'shipping_list'];
        foreach ($jsonCols as $col) {
            if (isset($row[$col]) && is_string($row[$col])) {
                $decoded = json_decode($row[$col], true);
                $row[$col] = is_array($decoded) ? $decoded : [];
            }
        }
        return $row;
    }
}
