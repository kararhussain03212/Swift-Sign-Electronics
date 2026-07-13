<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/FooterLink.php';

final class FooterLinkGroup extends BaseModel
{
    protected string $table = 'footer_link_groups';
    protected array $fillable = [
        'title', 'sort_order', 'is_active',
    ];

    protected function defaultOrderBy(): string
    {
        return 'sort_order ASC, id ASC';
    }

    public function allWithLinks(bool $onlyActive = false): array
    {
        $groups = $this->all([], $onlyActive);
        $linkModel = new FooterLink();
        $links = $linkModel->all([], $onlyActive);

        foreach ($groups as &$group) {
            $group['links'] = array_values(array_filter(
                $links,
                static fn (array $link): bool => (int) $link['group_id'] === (int) $group['id']
            ));
        }

        return $groups;
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
