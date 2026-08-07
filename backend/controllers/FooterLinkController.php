<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\FooterLink;
use Backend\Models\FooterLinkGroup;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/FooterLink.php';
require_once __DIR__ . '/../models/FooterLinkGroup.php';
require_once __DIR__ . '/../utils/Response.php';

final class FooterLinkController extends BaseCrudController
{
    protected string $modelClass = FooterLink::class;
    protected string $resourceName = 'footer-links';
    protected array $requiredCreateFields = ['group_id', 'label', 'url'];

    public function store(array $params = []): void
    {
        $this->assertParentExists($this->body());
        parent::store($params);
    }

    public function update(array $params): void
    {
        $payload = $this->body();
        if (array_key_exists('group_id', $payload)) {
            $this->assertParentExists($payload);
        }
        parent::update($params);
    }

    private function assertParentExists(array $payload): void
    {
        $groupId = (int) ($payload['group_id'] ?? 0);
        $groupModel = new FooterLinkGroup();
        if ($groupId <= 0 || !$groupModel->find($groupId)) {
            Response::error('Validation failed', 422, ['fields' => ['group_id' => 'The selected footer link group does not exist.']]);
        }
    }
}
