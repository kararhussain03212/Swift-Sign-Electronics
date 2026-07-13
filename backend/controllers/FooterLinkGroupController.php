<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\FooterLinkGroup;
use Backend\Utils\Cache;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/FooterLinkGroup.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';

final class FooterLinkGroupController extends BaseCrudController
{
    protected string $modelClass = FooterLinkGroup::class;
    protected string $resourceName = 'footer-link-groups';
    protected array $requiredCreateFields = ['title'];

    public function index(array $params = []): void
    {
        $model = new FooterLinkGroup();
        Response::success($model->allWithLinks(false), 'Fetched successfully');
    }

    public function publicIndex(array $params = []): void
    {
        $model = new FooterLinkGroup();
        $data = Cache::remember('public:footer-link-groups', static fn () => $model->allWithLinks(true));
        Response::success($data, 'Fetched successfully');
    }
}
