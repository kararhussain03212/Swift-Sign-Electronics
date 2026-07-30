<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\AboutPageSetting;
use Backend\Utils\Cache;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/AboutPageSetting.php';
require_once __DIR__ . '/../utils/Cache.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class AboutPageController extends BaseController
{
    public function publicShow(array $params = []): void
    {
        $data = Cache::remember('public:about:page', function () {
            $model = new AboutPageSetting();
            return $model->find(1) ?? [];
        }, 600);

        Response::success($data);
    }

    public function adminShow(array $params = []): void
    {
        $model = new AboutPageSetting();
        Response::success($model->find(1) ?? []);
    }

    public function adminUpdate(array $params = []): void
    {
        $this->requirePermission('edit_content');
        $payload = Validator::sanitizeInput($this->body());
        $model = new AboutPageSetting();
        $saved = $model->saveSingle($payload);

        Cache::clearAll();
        Response::success($saved, 'About page settings updated');
    }
}
