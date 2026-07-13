<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class NavLink extends BaseModel
{
    protected string $table = 'nav_links';
    protected array $fillable = [
        'link_key', 'label', 'url', 'sort_order', 'is_active', 'open_in_new_tab',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }

    public function reorder(array $items): bool
    {
        $this->pdo->beginTransaction();

        try {
            $stmt = $this->pdo->prepare('UPDATE ' . $this->table . ' SET sort_order = :sort_order, updated_at = NOW() WHERE id = :id');
            foreach ($items as $index => $item) {
                $id = (int) ($item['id'] ?? 0);
                $position = (int) ($item['sort_order'] ?? $item['order_position'] ?? $index + 1);
                if ($id <= 0) {
                    continue;
                }
                $stmt->execute([
                    ':id' => $id,
                    ':sort_order' => $position,
                ]);
            }
            $this->pdo->commit();
            return true;
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            return false;
        }
    }
}
