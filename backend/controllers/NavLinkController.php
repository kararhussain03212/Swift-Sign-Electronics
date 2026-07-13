<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\NavLink;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/NavLink.php';

final class NavLinkController extends BaseCrudController
{
    protected string $modelClass = NavLink::class;
    protected string $resourceName = 'nav-links';
    protected array $requiredCreateFields = ['label', 'url'];
}
