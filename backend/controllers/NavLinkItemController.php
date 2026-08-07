<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\NavLink;
use Backend\Models\NavLinkItem;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/NavLink.php';
require_once __DIR__ . '/../models/NavLinkItem.php';
require_once __DIR__ . '/../utils/Response.php';

final class NavLinkItemController extends BaseCrudController
{
    protected string $modelClass = NavLinkItem::class;
    protected string $resourceName = 'nav-link-items';
    protected array $requiredCreateFields = ['nav_link_id', 'label', 'url'];

    public function store(array $params = []): void
    {
        $this->assertParentExists($this->body());
        parent::store($params);
    }

    public function update(array $params): void
    {
        $payload = $this->body();
        if (array_key_exists('nav_link_id', $payload)) {
            $this->assertParentExists($payload);
        }
        parent::update($params);
    }

    private function assertParentExists(array $payload): void
    {
        $navLinkId = (int) ($payload['nav_link_id'] ?? 0);
        $navLinkModel = new NavLink();
        if ($navLinkId <= 0 || !$navLinkModel->find($navLinkId)) {
            Response::error('Validation failed', 422, ['fields' => ['nav_link_id' => 'The selected parent nav link does not exist.']]);
        }
    }
}
