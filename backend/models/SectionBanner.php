<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class SectionBanner extends BaseModel
{
    protected string $table = 'section_banners';
    protected array $fillable = [
        'section_key', 'category', 'section_title', 'kicker', 'title', 'subtitle', 'description',
        'bg_image', 'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }

    public function findBySectionKey(string $key): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM ' . $this->table . ' WHERE section_key = :k AND is_active = 1 LIMIT 1'
        );
        $stmt->execute([':k' => $key]);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }
}
