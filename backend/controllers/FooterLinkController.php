<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\FooterLink;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/FooterLink.php';

final class FooterLinkController extends BaseCrudController
{
    protected string $modelClass = FooterLink::class;
    protected string $resourceName = 'footer-links';
    protected array $requiredCreateFields = ['group_id', 'label', 'url'];
}
