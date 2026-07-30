<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\AboutValueCard;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/AboutValueCard.php';

final class AboutValueCardController extends BaseCrudController
{
    protected string $modelClass = AboutValueCard::class;
    protected string $resourceName = 'about_value_cards';
    protected array $requiredCreateFields = ['style_variant'];
}
