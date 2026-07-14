-- ============================================================
-- Swift Sign Electronics — Database Schema
-- Database: swift_sign_electronic
-- Run: c:\xampp\mysql\bin\mysql.exe -u root < backend/database/swift_sign_electronic.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `swift_sign_electronic`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `swift_sign_electronic`;

-- ------------------------------------------------------------
-- admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`              VARCHAR(120) NOT NULL,
  `email`             VARCHAR(180) NOT NULL UNIQUE,
  `password`          VARCHAR(255) NOT NULL,
  `role`              ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  `status`            ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `designation`       VARCHAR(120) DEFAULT NULL,
  `phone`             VARCHAR(50) DEFAULT NULL,
  `location`          VARCHAR(255) DEFAULT NULL,
  `bio`               TEXT DEFAULT NULL,
  `profile_photo`     VARCHAR(255) DEFAULT NULL,
  `permissions_json`  JSON DEFAULT NULL,
  `last_login_at`     DATETIME DEFAULT NULL,
  `created_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed admin — PLACEHOLDER PASSWORD 'SwiftSign@2026', CHANGE AFTER FIRST LOGIN
INSERT IGNORE INTO `admins` (`name`, `email`, `password`, `role`) VALUES
('Swift Sign Admin', 'admin@swiftsignelectronics.com', '$2y$10$y97wngfdhpyFd84yGDM3o.eWE5goD3KzypzMxKMzsuhi/1ErE4MvG', 'admin');

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`          VARCHAR(120) NOT NULL,
  `email`         VARCHAR(180) NOT NULL UNIQUE,
  `password`      VARCHAR(255) NOT NULL,
  `role`          ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  `profile_photo` VARCHAR(255) DEFAULT NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- activity_logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_id`    INT UNSIGNED DEFAULT NULL,
  `action`      VARCHAR(80) NOT NULL,
  `resource`    VARCHAR(80) NOT NULL,
  `resource_id` INT UNSIGNED DEFAULT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- hero_slides (home page hero slider)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`       VARCHAR(255) DEFAULT NULL,
  `subtitle`    VARCHAR(500) DEFAULT NULL,
  `button_text` VARCHAR(120) DEFAULT NULL,
  `button_link` VARCHAR(500) DEFAULT NULL,
  `image`       VARCHAR(500) DEFAULT NULL,
  `sort_order`  SMALLINT NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- categories (nav strip + product taxonomy)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `cat_key`    VARCHAR(80) NOT NULL UNIQUE,
  `name`       VARCHAR(120) NOT NULL,
  `icon`       VARCHAR(80) DEFAULT NULL,
  `sort_order` SMALLINT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- products (electronics: tools, instruments, project kits, components)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`           VARCHAR(255) NOT NULL,
  `slug`           VARCHAR(255) NOT NULL UNIQUE,
  `category`       VARCHAR(80) DEFAULT NULL,
  `brand`          VARCHAR(120) DEFAULT NULL,
  `model`          VARCHAR(120) DEFAULT NULL,
  `price`          DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount`       SMALLINT DEFAULT NULL,
  `rating`         DECIMAL(3,1) DEFAULT NULL,
  `reviews`        INT UNSIGNED DEFAULT 0,
  `stock`          INT UNSIGNED NOT NULL DEFAULT 0,
  `thumbnail`      VARCHAR(500) DEFAULT NULL,
  `images`         JSON DEFAULT NULL,
  `description`    TEXT DEFAULT NULL,
  `introduction`   JSON DEFAULT NULL,
  `specifications` JSON DEFAULT NULL,
  `shipping_list`  JSON DEFAULT NULL,
  `featured`       TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order`     SMALLINT NOT NULL DEFAULT 0,
  `is_active`      TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_products_category` (`category`),
  INDEX `idx_products_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- section_banners (featured banner per home section: Tools / Instruments / Projects)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `section_banners` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `section_key` VARCHAR(80) NOT NULL UNIQUE,
  `kicker`      VARCHAR(120) DEFAULT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `subtitle`    VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `bg_image`    VARCHAR(500) DEFAULT NULL,
  `sort_order`  SMALLINT NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- blog_posts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`          VARCHAR(255) NOT NULL,
  `slug`           VARCHAR(255) NOT NULL UNIQUE,
  `excerpt`        TEXT DEFAULT NULL,
  `body`           LONGTEXT DEFAULT NULL,
  `cover`          VARCHAR(500) DEFAULT NULL,
  `category`       VARCHAR(120) DEFAULT NULL,
  `category_color` VARCHAR(20) DEFAULT NULL,
  `author_name`    VARCHAR(120) DEFAULT NULL,
  `author_avatar`  VARCHAR(500) DEFAULT NULL,
  `author_role`    VARCHAR(120) DEFAULT NULL,
  `read_time`      VARCHAR(40) DEFAULT NULL,
  `tags`           JSON DEFAULT NULL,
  `featured`       TINYINT(1) NOT NULL DEFAULT 0,
  `is_published`   TINYINT(1) NOT NULL DEFAULT 1,
  `published_at`   DATETIME DEFAULT NULL,
  `sort_order`     SMALLINT NOT NULL DEFAULT 0,
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- blog_categories (filter chips + admin-managed category list)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(120) NOT NULL,
  `slug`       VARCHAR(120) NOT NULL UNIQUE,
  `sort_order` SMALLINT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `blog_categories` (`id`, `name`, `slug`, `sort_order`) VALUES
(1, 'IoT', 'iot', 1),
(2, 'Robotics', 'robotics', 2),
(3, 'Artificial Intelligence', 'artificial-intelligence', 3),
(4, 'Hardware Design', 'hardware-design', 4),
(5, 'Firmware Development', 'firmware-development', 5),
(6, 'Smart Home', 'smart-home', 6);

-- ------------------------------------------------------------
-- settings (generic key/value site settings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key`    VARCHAR(120) NOT NULL UNIQUE,
  `setting_value`  LONGTEXT DEFAULT NULL,
  `setting_type`   VARCHAR(20) NOT NULL DEFAULT 'text',
  `order_position` INT UNSIGNED NOT NULL DEFAULT 0,
  `status`         ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- contact_messages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(120) NOT NULL,
  `email`      VARCHAR(180) NOT NULL,
  `phone`      VARCHAR(30) DEFAULT NULL,
  `subject`    VARCHAR(255) NOT NULL,
  `message`    TEXT NOT NULL,
  `status`     ENUM('unread','read','replied') NOT NULL DEFAULT 'unread',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- contact_page_settings (singleton row id=1)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_page_settings` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hero_badge`           VARCHAR(120)  DEFAULT NULL,
  `hero_heading`         VARCHAR(255)  DEFAULT NULL,
  `hero_highlight`       VARCHAR(255)  DEFAULT NULL,
  `hero_description`     TEXT          DEFAULT NULL,
  `seo_meta_description` VARCHAR(255)  DEFAULT NULL,
  `form_title`           VARCHAR(255)  DEFAULT NULL,
  `name_placeholder`     VARCHAR(120)  DEFAULT NULL,
  `email_placeholder`    VARCHAR(120)  DEFAULT NULL,
  `phone_placeholder`    VARCHAR(120)  DEFAULT NULL,
  `subject_placeholder`  VARCHAR(120)  DEFAULT NULL,
  `message_placeholder`  VARCHAR(120)  DEFAULT NULL,
  `submit_button_text`   VARCHAR(120)  DEFAULT NULL,
  `availability_text`    VARCHAR(255)  DEFAULT NULL,
  `contact_heading`      VARCHAR(255)  DEFAULT NULL,
  `contact_description`  TEXT          DEFAULT NULL,
  `whatsapp_number`      VARCHAR(50)   DEFAULT NULL,
  `phone_number`         VARCHAR(50)   DEFAULT NULL,
  `email`                VARCHAR(255)  DEFAULT NULL,
  `address`              TEXT          DEFAULT NULL,
  `google_map_url`       TEXT          DEFAULT NULL,
  `locations`            JSON          DEFAULT NULL,
  `facebook_url`         VARCHAR(500)  DEFAULT NULL,
  `instagram_url`        VARCHAR(500)  DEFAULT NULL,
  `youtube_url`          VARCHAR(500)  DEFAULT NULL,
  `tiktok_url`           VARCHAR(500)  DEFAULT NULL,
  `created_at`           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `contact_page_settings` (
  `id`, `hero_badge`, `hero_heading`, `hero_highlight`, `hero_description`,
  `seo_meta_description`,
  `form_title`, `name_placeholder`, `email_placeholder`, `phone_placeholder`,
  `subject_placeholder`, `message_placeholder`, `submit_button_text`,
  `availability_text`, `contact_heading`, `contact_description`,
  `whatsapp_number`, `phone_number`, `email`, `address`, `google_map_url`, `locations`,
  `facebook_url`, `instagram_url`, `youtube_url`, `tiktok_url`
) VALUES (
  1, 'GET IN TOUCH', 'Contact', 'Swift Sign Electronics',
  'Questions about our products? Bulk orders? Feedback? We''re here for you — always.',
  'Contact Swift Sign Electronics for tools, components, and project kits. Call, WhatsApp, or email us — we typically reply within one business day.',
  'Send Us A Message', 'Full Name', 'Email Address', 'Phone Number',
  'Subject', 'Your Message', 'Send Message',
  'Available Mon - Sat, 9am - 6pm', 'We''d love to hear from you',
  'Reach out through any channel below and our dedicated team will respond promptly.',
  '+92 333 8399480', '+92 333 8399480', 'info@swiftsigngeneraltrading.com',
  'Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan',
  'https://maps.google.com/?q=Office+22,+4th+Floor,+Pakland+City+Center,+I-8+Markaz,+Islamabad,+Pakistan',
  '[{"address":"Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan","google_map_url":"https://maps.google.com/?q=Office+22,+4th+Floor,+Pakland+City+Center,+I-8+Markaz,+Islamabad,+Pakistan"}]',
  '#', '#', '#', '#'
);

-- ------------------------------------------------------------
-- nav_links (main navbar links)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nav_links` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `link_key`        VARCHAR(80) DEFAULT NULL,
  `label`           VARCHAR(120) NOT NULL,
  `url`             VARCHAR(500) NOT NULL,
  `sort_order`      SMALLINT NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1) NOT NULL DEFAULT 1,
  `open_in_new_tab` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `nav_links` (`id`, `link_key`, `label`, `url`, `sort_order`) VALUES
(1, 'home', 'Home', '/', 1),
(2, 'products', 'Products', '/products', 2),
(3, 'blogs', 'Blog', '/blog', 3),
(4, 'contact', 'Contact', '/contact', 4);

-- ------------------------------------------------------------
-- footer_link_groups + footer_links (Quick Links / Legal Information columns)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `footer_link_groups` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`      VARCHAR(120) NOT NULL,
  `sort_order` SMALLINT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `footer_links` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `group_id`   INT UNSIGNED NOT NULL,
  `label`      VARCHAR(120) NOT NULL,
  `url`        VARCHAR(500) NOT NULL,
  `sort_order` SMALLINT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_footer_links_group` (`group_id`),
  CONSTRAINT `fk_footer_links_group` FOREIGN KEY (`group_id`) REFERENCES `footer_link_groups`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `footer_link_groups` (`id`, `title`, `sort_order`) VALUES
(1, 'Quick Links', 1),
(2, 'Legal Information', 2);

INSERT IGNORE INTO `footer_links` (`id`, `group_id`, `label`, `url`, `sort_order`) VALUES
(1, 1, 'Home Page', '/', 1),
(2, 1, 'About Us', '#about', 2),
(3, 1, 'Contact Us', '/contact', 3),
(4, 1, 'Support & FAQs', '#faq', 4),
(5, 2, 'Terms & Conditions', '/terms-and-conditions', 1),
(6, 2, 'Privacy Policy', '/privacy-policy', 2),
(7, 2, 'Return Policy', '/return-policy', 3),
(8, 2, 'Shipping Policy', '/shipping-policy', 4);

-- ------------------------------------------------------------
-- social_links (footer social icons) — placeholder URLs, replace with real ones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `social_links` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `platform`   VARCHAR(40) NOT NULL,
  `url`        VARCHAR(500) NOT NULL,
  `sort_order` SMALLINT NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `social_links` (`id`, `platform`, `url`, `sort_order`) VALUES
(1, 'github', 'https://github.com/', 1),
(2, 'discord', 'https://discord.com/', 2),
(3, 'twitter', 'https://twitter.com/', 3),
(4, 'linkedin', 'https://linkedin.com/', 4);

-- ------------------------------------------------------------
-- site-wide settings (navbar/footer) — appended to generic settings key/value store
-- ------------------------------------------------------------
INSERT IGNORE INTO `settings` (`setting_key`, `setting_value`, `setting_type`, `order_position`) VALUES
('brand_name', 'Swift Sign', 'text', 101),
('brand_subtitle', 'Electronics', 'text', 102),
('footer_description', 'Empowering engineers, scholars, and makers with premium components, customizable final year projects, and diagnostic laboratory tools.', 'text', 103),
('contact_phone', '+92 333 8399480', 'text', 104),
('contact_email', 'info@it.swiftsignbm.com', 'text', 105),
('contact_address', 'Office 22, 4th Floor, Pakland city center, I-8 Markaz, Islamabad, Pakistan.', 'text', 106),
('copyright_text', 'Swift Sign Electronics. All rights reserved.', 'text', 107),
('designed_by_text', 'swiftsign', 'text', 108),
('designed_by_url', 'https://it.swiftsignbm.com/', 'text', 109),
('topbar_messages', '[{\"text\":\"100% Genuine Electronic Components\"},{\"text\":\"Nationwide Fast Delivery\"},{\"text\":\"Tech Support: +92 333 8399480\"}]', 'json', 110);

-- ------------------------------------------------------------
-- addresses (customer addresses)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `addresses` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         INT UNSIGNED NOT NULL,
  `label`           VARCHAR(120) DEFAULT NULL,
  `first_name`      VARCHAR(120) NOT NULL,
  `last_name`       VARCHAR(120) DEFAULT NULL,
  `phone`           VARCHAR(30) NOT NULL,
  `email`           VARCHAR(180) DEFAULT NULL,
  `street_address`  VARCHAR(255) NOT NULL,
  `apartment`       VARCHAR(120) DEFAULT NULL,
  `city`            VARCHAR(120) NOT NULL,
  `state`           VARCHAR(120) DEFAULT NULL,
  `postal_code`     VARCHAR(20) DEFAULT NULL,
  `country`         VARCHAR(120) NOT NULL,
  `is_default`      TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_addresses_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- orders + order_items (checkout submissions)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_number`   VARCHAR(40) NOT NULL UNIQUE,
  `customer_name`  VARCHAR(180) NOT NULL,
  `customer_email` VARCHAR(180) DEFAULT NULL,
  `customer_phone` VARCHAR(30) DEFAULT NULL,
  `address`        TEXT DEFAULT NULL,
  `city`           VARCHAR(120) DEFAULT NULL,
  `country`        VARCHAR(120) DEFAULT NULL,
  `notes`          TEXT DEFAULT NULL,
  `subtotal`       DECIMAL(10,2) NOT NULL DEFAULT 0,
  `total`          DECIMAL(10,2) NOT NULL DEFAULT 0,
  `status`         ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_items` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id`     INT UNSIGNED NOT NULL,
  `product_id`   INT UNSIGNED DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `unit_price`   DECIMAL(10,2) NOT NULL DEFAULT 0,
  `quantity`     INT UNSIGNED NOT NULL DEFAULT 1,
  `line_total`   DECIMAL(10,2) NOT NULL DEFAULT 0,
  INDEX `idx_order_items_order` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
