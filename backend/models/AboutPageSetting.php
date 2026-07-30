<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class AboutPageSetting extends BaseModel
{
    protected string $table = 'about_page_settings';
    protected array $fillable = [
        'hero_badge', 'hero_heading', 'hero_heading_highlight', 'hero_description', 'hero_image',
        'anatomy_heading', 'anatomy_subheading',
        'ceo_eyebrow', 'ceo_quote', 'ceo_name', 'ceo_title', 'ceo_photo',
        'team_heading', 'team_subheading',
        'accolades_eyebrow', 'accolades_heading', 'accolades_heading_highlight', 'accolades_description',
        'testimonials_heading', 'testimonials_subheading',
    ];
}
