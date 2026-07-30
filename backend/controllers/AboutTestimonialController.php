<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\AboutTestimonial;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/AboutTestimonial.php';

final class AboutTestimonialController extends BaseCrudController
{
    protected string $modelClass = AboutTestimonial::class;
    protected string $resourceName = 'about_testimonials';
    protected array $requiredCreateFields = ['quote', 'name'];
}
