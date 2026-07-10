<?php

declare(strict_types=1);

use Backend\Controllers\AddressController;
use Backend\Controllers\BlogController;
use Backend\Controllers\ContactController;
use Backend\Controllers\HeroController;
use Backend\Controllers\ProductController;
use Backend\Controllers\ProductPageController;
use Backend\Controllers\SettingController;
use Backend\Middleware\AuthMiddleware;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/HeroController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/ProductPageController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/SettingController.php';
require_once __DIR__ . '/../controllers/ContactController.php';
require_once __DIR__ . '/../controllers/AddressController.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/Router.php';

function registerPublicRoutes(Router $router): void
{
    $router->get('/api/public/hero', [HeroController::class, 'publicIndex']);
    $router->get('/api/public/products', [ProductController::class, 'publicIndex']);
    $router->get('/api/public/products/{slug}', [ProductController::class, 'publicShowBySlug']);
    $router->get('/api/public/blog', [BlogController::class, 'publicIndex']);
    $router->get('/api/public/blog/search', [BlogController::class, 'publicSearch']);
    $router->get('/api/public/blog/settings', [BlogController::class, 'publicBlogSettings']);
    $router->get('/api/public/blog/{slug}', [BlogController::class, 'publicShowBySlug']);
    $router->get('/api/public/settings', [SettingController::class, 'publicIndex']);
    $router->get('/api/public/contact-page',  [ContactController::class, 'publicContactPage']);
    $router->post('/api/public/contact', [ContactController::class, 'store']);
    $router->get('/api/public/product-page', [ProductPageController::class, 'publicPage']);

    // User Addresses (authenticated)
    $router->get('/api/addresses', [AddressController::class, 'index'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->post('/api/addresses', [AddressController::class, 'store'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->get('/api/addresses/{id}', [AddressController::class, 'show'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->put('/api/addresses/{id}', [AddressController::class, 'update'], [[AuthMiddleware::class, 'requireAuth']]);
    $router->delete('/api/addresses/{id}', [AddressController::class, 'destroy'], [[AuthMiddleware::class, 'requireAuth']]);
}
