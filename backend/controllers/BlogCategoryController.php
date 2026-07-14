<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\BlogCategory;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/BlogCategory.php';

final class BlogCategoryController extends BaseCrudController
{
    protected string $modelClass = BlogCategory::class;
    protected string $resourceName = 'blog-categories';
    protected array $requiredCreateFields = ['name'];
}
