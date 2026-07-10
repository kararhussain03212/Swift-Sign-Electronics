<?php

declare(strict_types=1);

use Backend\Controllers\BlogController;
use Backend\Controllers\CategoryController;
use Backend\Controllers\ContactController;
use Backend\Controllers\OrderController;
use Backend\Controllers\SectionBannerController;
use Backend\Controllers\CustomerAddressController;
use Backend\Controllers\DashboardController;
use Backend\Controllers\HeroController;
use Backend\Controllers\ProductController;
use Backend\Controllers\SettingController;
use Backend\Controllers\UploadController;
use Backend\Controllers\UserController;
use Backend\Middleware\AuthMiddleware;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/HeroController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../controllers/OrderController.php';
require_once __DIR__ . '/../controllers/SectionBannerController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/SettingController.php';
require_once __DIR__ . '/../controllers/UploadController.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/DashboardController.php';
require_once __DIR__ . '/../controllers/ContactController.php';
require_once __DIR__ . '/../controllers/CustomerAddressController.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/Router.php';

function registerAdminRoutes(Router $router): void
{
    $mw = [[AuthMiddleware::class, 'requireAuth']];

    $router->get('/api/admin/dashboard', [DashboardController::class, 'stats'], $mw);

    // Hero Slides
    $router->get('/api/admin/hero', [HeroController::class, 'index'], $mw);
    $router->get('/api/admin/hero/{id}', [HeroController::class, 'show'], $mw);
    $router->post('/api/admin/hero', [HeroController::class, 'store'], $mw);
    $router->put('/api/admin/hero/{id}', [HeroController::class, 'update'], $mw);
    $router->delete('/api/admin/hero/{id}', [HeroController::class, 'destroy'], $mw);
    $router->patch('/api/admin/hero/reorder', [HeroController::class, 'reorder'], $mw);

    // Categories
    $router->get('/api/admin/categories', [CategoryController::class, 'index'], $mw);
    $router->get('/api/admin/categories/{id}', [CategoryController::class, 'show'], $mw);
    $router->post('/api/admin/categories', [CategoryController::class, 'store'], $mw);
    $router->put('/api/admin/categories/{id}', [CategoryController::class, 'update'], $mw);
    $router->delete('/api/admin/categories/{id}', [CategoryController::class, 'destroy'], $mw);

    // Section Banners
    $router->get('/api/admin/section-banners', [SectionBannerController::class, 'index'], $mw);
    $router->get('/api/admin/section-banners/{id}', [SectionBannerController::class, 'show'], $mw);
    $router->post('/api/admin/section-banners', [SectionBannerController::class, 'store'], $mw);
    $router->put('/api/admin/section-banners/{id}', [SectionBannerController::class, 'update'], $mw);
    $router->delete('/api/admin/section-banners/{id}', [SectionBannerController::class, 'destroy'], $mw);

    // Orders
    $router->get('/api/admin/orders', [OrderController::class, 'index'], $mw);
    $router->get('/api/admin/orders/{id}', [OrderController::class, 'show'], $mw);
    $router->patch('/api/admin/orders/{id}/status', [OrderController::class, 'updateStatus'], $mw);
    $router->delete('/api/admin/orders/{id}', [OrderController::class, 'destroy'], $mw);

    // Products
    $router->get('/api/admin/products', [ProductController::class, 'index'], $mw);
    $router->get('/api/admin/products/{id}', [ProductController::class, 'show'], $mw);
    $router->post('/api/admin/products', [ProductController::class, 'store'], $mw);
    $router->put('/api/admin/products/{id}', [ProductController::class, 'update'], $mw);
    $router->delete('/api/admin/products/{id}', [ProductController::class, 'destroy'], $mw);
    $router->patch('/api/admin/products/reorder', [ProductController::class, 'reorder'], $mw);


    // Blog
    $router->get('/api/admin/blog', [BlogController::class, 'index'], $mw);
    $router->put('/api/admin/blog/settings', [BlogController::class, 'adminUpdateBlogSettings'], $mw);
    $router->get('/api/admin/blog/{id}', [BlogController::class, 'show'], $mw);
    $router->post('/api/admin/blog', [BlogController::class, 'store'], $mw);
    $router->put('/api/admin/blog/{id}', [BlogController::class, 'update'], $mw);
    $router->delete('/api/admin/blog/{id}', [BlogController::class, 'destroy'], $mw);
    $router->patch('/api/admin/blog/reorder', [BlogController::class, 'reorder'], $mw);

    // Settings
    $router->get('/api/admin/settings', [SettingController::class, 'index'], $mw);
    $router->put('/api/admin/settings', [SettingController::class, 'update'], $mw);

    // Upload
    $router->post('/api/admin/upload', [UploadController::class, 'upload'], $mw);

    // Users
    $router->get('/api/admin/users', [UserController::class, 'index'], $mw);
    $router->get('/api/admin/users/{id}', [UserController::class, 'show'], $mw);
    $router->post('/api/admin/users', [UserController::class, 'store'], $mw);
    $router->put('/api/admin/users/{id}', [UserController::class, 'update'], $mw);
    $router->delete('/api/admin/users/{id}', [UserController::class, 'destroy'], $mw);

    // Contact Page Settings (admin)
    $router->get('/api/admin/contact-page', [ContactController::class, 'adminGetContactPage'], $mw);
    $router->put('/api/admin/contact-page', [ContactController::class, 'adminUpdateContactPage'], $mw);

    // Contact Messages (admin)
    $router->get('/api/admin/contact', [ContactController::class, 'index'], $mw);
    $router->patch('/api/admin/contact/{id}/read', [ContactController::class, 'markRead'], $mw);
    $router->delete('/api/admin/contact/{id}', [ContactController::class, 'destroy'], $mw);

    // Customer Addresses (admin)
    $router->get('/api/admin/customers', [CustomerAddressController::class, 'index'], $mw);
    $router->get('/api/admin/customers/{id}', [CustomerAddressController::class, 'show'], $mw);
    $router->delete('/api/admin/addresses/{id}', [CustomerAddressController::class, 'deleteAddress'], $mw);
}
