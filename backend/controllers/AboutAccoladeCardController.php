<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\AboutAccoladeCard;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/AboutAccoladeCard.php';

final class AboutAccoladeCardController extends BaseCrudController
{
    protected string $modelClass = AboutAccoladeCard::class;
    protected string $resourceName = 'about_accolade_cards';
    protected array $requiredCreateFields = ['title'];
}
