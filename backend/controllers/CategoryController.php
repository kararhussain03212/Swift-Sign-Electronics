<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Category;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Category.php';

final class CategoryController extends BaseCrudController
{
    protected string $modelClass = Category::class;
    protected string $resourceName = 'categories';
    protected array $requiredCreateFields = ['name'];
}
