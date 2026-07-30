<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\NavLinkItem;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/NavLinkItem.php';

final class NavLinkItemController extends BaseCrudController
{
    protected string $modelClass = NavLinkItem::class;
    protected string $resourceName = 'nav-link-items';
    protected array $requiredCreateFields = ['nav_link_id', 'label', 'url'];
}
