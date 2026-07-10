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
}
