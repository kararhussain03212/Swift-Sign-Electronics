<?php

declare(strict_types=1);

use Backend\Controllers\AddressController;
use Backend\Controllers\AboutPageController;
use Backend\Controllers\AboutValueCardController;
use Backend\Controllers\AboutTeamMemberController;
use Backend\Controllers\AboutAccoladeCardController;
use Backend\Controllers\AboutTestimonialController;
use Backend\Controllers\BlogCategoryController;
use Backend\Controllers\BlogController;
use Backend\Controllers\CategoryController;
use Backend\Controllers\ContactController;
use Backend\Controllers\FooterLinkGroupController;
use Backend\Controllers\HeroController;
use Backend\Controllers\NavLinkController;
use Backend\Controllers\OrderController;
use Backend\Controllers\ProductController;
use Backend\Controllers\ProductCommentController;
use Backend\Controllers\SectionBannerController;
use Backend\Controllers\SettingController;
use Backend\Controllers\SocialLinkController;
use Backend\Middleware\AuthMiddleware;
use Backend\Utils\Router;

require_once __DIR__ . '/../controllers/HeroController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../controllers/OrderController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/ProductCommentController.php';
require_once __DIR__ . '/../controllers/SectionBannerController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/BlogCategoryController.php';
require_once __DIR__ . '/../controllers/SettingController.php';
require_once __DIR__ . '/../controllers/ContactController.php';
require_once __DIR__ . '/../controllers/AboutPageController.php';
require_once __DIR__ . '/../controllers/AboutValueCardController.php';
require_once __DIR__ . '/../controllers/AboutTeamMemberController.php';
require_once __DIR__ . '/../controllers/AboutAccoladeCardController.php';
require_once __DIR__ . '/../controllers/AboutTestimonialController.php';
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
    $router->get('/api/public/sections', [SectionBannerController::class, 'publicIndex']);
    $router->get('/api/public/sections/{key}', [SectionBannerController::class, 'publicShowByKey']);
    $router->post('/api/public/orders', [OrderController::class, 'publicStore']);
    $router->get('/api/public/products', [ProductController::class, 'publicIndex']);
    $router->get('/api/public/products/{slug}', [ProductController::class, 'publicShowBySlug']);

    // Product Comments (public, anonymous, token-guarded edit/delete)
    $router->get('/api/public/products/{productId}/comments', [ProductCommentController::class, 'publicIndex']);
    $router->post('/api/public/products/{productId}/comments', [ProductCommentController::class, 'store']);
    $router->put('/api/public/comments/{id}', [ProductCommentController::class, 'update']);
    $router->delete('/api/public/comments/{id}', [ProductCommentController::class, 'destroy']);
    $router->get('/api/public/blog', [BlogController::class, 'publicIndex']);
    $router->get('/api/public/blog/search', [BlogController::class, 'publicSearch']);
    $router->get('/api/public/blog/settings', [BlogController::class, 'publicBlogSettings']);
    $router->get('/api/public/blog-categories', [BlogCategoryController::class, 'publicIndex']);
    $router->get('/api/public/blog/{slug}', [BlogController::class, 'publicShowBySlug']);
    $router->get('/api/public/settings', [SettingController::class, 'publicIndex']);
    $router->get('/api/public/contact-page',  [ContactController::class, 'publicContactPage']);
    $router->post('/api/public/contact', [ContactController::class, 'store']);
    $router->get('/api/public/about-page', [AboutPageController::class, 'publicShow']);
    $router->get('/api/public/about-value-cards', [AboutValueCardController::class, 'publicIndex']);
    $router->get('/api/public/about-team-members', [AboutTeamMemberController::class, 'publicIndex']);
    $router->get('/api/public/about-accolade-cards', [AboutAccoladeCardController::class, 'publicIndex']);
    $router->get('/api/public/about-testimonials', [AboutTestimonialController::class, 'publicIndex']);
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
