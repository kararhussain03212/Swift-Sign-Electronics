<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\SectionBanner;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/SectionBanner.php';
require_once __DIR__ . '/../utils/Response.php';

final class SectionBannerController extends BaseCrudController
{
    protected string $modelClass = SectionBanner::class;
    protected string $resourceName = 'section_banners';
    protected array $requiredCreateFields = ['section_key', 'title'];

    public function publicShowByKey(array $params): void
    {
        $key = trim((string) ($params['key'] ?? ''));
        if ($key === '') {
            Response::error('Section key is required', 422);
        }

        $row = (new SectionBanner())->findBySectionKey($key);
        if ($row === null) {
            Response::error('Section banner not found', 404);
        }

        Response::success($row, 'Fetched successfully');
    }
}
