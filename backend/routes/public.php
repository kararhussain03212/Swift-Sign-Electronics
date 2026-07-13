<?php

declare(strict_types=1);

use Backend\Controllers\AddressController;
use Backend\Controllers\BlogController;
use Backend\Controllers\CategoryController;
use Backend\Controllers\ContactController;
use Backend\Controllers\FooterLinkGroupController;
use Backend\Controllers\HeroController;
use Backend\Controllers\NavLinkController;
use Backend\Controllers\OrderController;
use Backend\Controllers\ProductController;
use Backend\Controllers\SectionBannerController;
use Backend\Controllers\SettingController;
use Backend\Controllers\SocialLinkController;
use Backend\Middleware\AuthMiddleware;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/HeroController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../controllers/OrderController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/SectionBannerController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/SettingController.php';
require_once __DIR__ . '/../controllers/ContactController.php';
require_once __DIR__ . '/../controllers/AddressController.php';
require_once __DIR__ . '/../controllers/NavLinkController.php';
require_once __DIR__ . '/../controllers/FooterLinkGroupController.php';
require_once __DIR__ . '/../controllers/SocialLinkController.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/Router.php';

function registerPublicRoutes(Router $router): void
{
    $router->get('/api/public/hero', [HeroController::class, 'publicIndex']);
    $router->get('/api/public/categories', [CategoryController::class, 'publicIndex']);
    $router->get('/api/public/sections/{key}', [SectionBannerController::class, 'publicShowByKey']);
    $router->post('/api/public/orders', [OrderController::class, 'publicStore']);
    $router->get('/api/public/products', [ProductController::class, 'publicIndex']);
    $router->get('/api/public/products/{slug}', [ProductController::class, 'publicShowBySlug']);
    $router->get('/api/public/blog', [BlogController::class, 'publicIndex']);
    $router->get('/api/public/blog/search', [BlogController::class, 'publicSearch']);
    $router->get('/api/public/blog/settings', [BlogController::class, 'publicBlogSettings']);
    $router->get('/api/public/blog/{slug}', [BlogController::class, 'publicShowBySlug']);
    $router->get('/api/public/settings', [SettingController::class, 'publicIndex']);
    $router->get('/api/public/contact-page',  [ContactController::class, 'publicContactPage']);
    $router->post('/api/public/contact', [ContactController::class, 'store']);
    $router->get('/api/public/nav-links', [NavLinkController::class, 'publicIndex']);
    $router->get('/api/public/footer-link-groups', [FooterLinkGroupController::class, 'publicIndex']);
    $router->get('/api/public/social-links', [SocialLinkController::class, 'publicIndex']);

    // User Addresses (authenticated)
    $router->get('/api/addresses', [AddressController::class, 'index'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->post('/api/addresses', [AddressController::class, 'store'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->get('/api/addresses/{id}', [AddressController::class, 'show'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->put('/api/addresses/{id}', [AddressController::class, 'update'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->delete('/api/addresses/{id}', [AddressController::class, 'destroy'], [[AuthMiddleware::class, 'requireAuth']]);
}
