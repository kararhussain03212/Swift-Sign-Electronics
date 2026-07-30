<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\NavLink;
use Backend\Utils\Cache;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/NavLink.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';

final class NavLinkController extends BaseCrudController
{
    protected string $modelClass = NavLink::class;
    protected string $resourceName = 'nav-links';
    protected array $requiredCreateFields = ['label', 'url'];

    public function index(array $params = []): void
    {
        $model = new NavLink();
        Response::success($model->allWithItems(false), 'Fetched successfully');
    }

    public function publicIndex(array $params = []): void
    {
        $model = new NavLink();
        $data = Cache::remember('public:nav-links', static fn () => $model->allWithItems(true));
        Response::success($data, 'Fetched successfully');
    }
}
