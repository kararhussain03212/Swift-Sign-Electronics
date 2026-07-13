<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\SocialLink;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/SocialLink.php';

final class SocialLinkController extends BaseCrudController
{
    protected string $modelClass = SocialLink::class;
    protected string $resourceName = 'social-links';
    protected array $requiredCreateFields = ['platform', 'url'];
}
