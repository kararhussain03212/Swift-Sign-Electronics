<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\AboutTeamMember;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/AboutTeamMember.php';

final class AboutTeamMemberController extends BaseCrudController
{
    protected string $modelClass = AboutTeamMember::class;
    protected string $resourceName = 'about_team_members';
    protected array $requiredCreateFields = ['name'];
}
