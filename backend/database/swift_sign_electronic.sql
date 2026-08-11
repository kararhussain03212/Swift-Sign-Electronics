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
('Swift Sign Admin', 'info@sstechnologies.pk', '$2y$10$y97wngfdhpyFd84yGDM3o.eWE5goD3KzypzMxKMzsuhi/1ErE4MvG', 'admin');

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
  `documents`      JSON DEFAULT NULL,
  `faqs`           JSON DEFAULT NULL,
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
  '+92 333 8399480', '+92 333 8399480', 'info@sstechnologies.pk',
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
-- nav_link_items (dropdown sub-links shown under a nav_links entry)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nav_link_items` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nav_link_id` INT UNSIGNED NOT NULL,
  `label`       VARCHAR(120) NOT NULL,
  `url`         VARCHAR(500) NOT NULL,
  `sort_order`  SMALLINT NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_nav_link_items_nav_link` (`nav_link_id`),
  CONSTRAINT `fk_nav_link_items_nav_link` FOREIGN KEY (`nav_link_id`) REFERENCES `nav_links`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
('contact_email', 'info@sstechnologies.pk', 'text', 105),
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

-- ------------------------------------------------------------
-- about_page_settings (singleton row id=1)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `about_page_settings` (
  `id`                       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hero_badge`               VARCHAR(120)  DEFAULT NULL,
  `hero_heading`             VARCHAR(255)  DEFAULT NULL,
  `hero_heading_highlight`   VARCHAR(255)  DEFAULT NULL,
  `hero_description`         TEXT          DEFAULT NULL,
  `hero_image`                VARCHAR(500)  DEFAULT NULL,
  `anatomy_heading`          VARCHAR(255)  DEFAULT NULL,
  `anatomy_subheading`       VARCHAR(500)  DEFAULT NULL,
  `ceo_eyebrow`              VARCHAR(120)  DEFAULT NULL,
  `ceo_quote`                TEXT          DEFAULT NULL,
  `ceo_name`                 VARCHAR(180)  DEFAULT NULL,
  `ceo_title`                VARCHAR(180)  DEFAULT NULL,
  `ceo_photo`                VARCHAR(500)  DEFAULT NULL,
  `team_heading`             VARCHAR(255)  DEFAULT NULL,
  `team_subheading`          VARCHAR(500)  DEFAULT NULL,
  `accolades_eyebrow`        VARCHAR(120)  DEFAULT NULL,
  `accolades_heading`        VARCHAR(255)  DEFAULT NULL,
  `accolades_heading_highlight` VARCHAR(255) DEFAULT NULL,
  `accolades_description`    VARCHAR(500)  DEFAULT NULL,
  `testimonials_heading`     VARCHAR(255)  DEFAULT NULL,
  `testimonials_subheading`  VARCHAR(500)  DEFAULT NULL,
  `created_at`               DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`               DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `about_page_settings` (
  `id`, `hero_badge`, `hero_heading`, `hero_heading_highlight`, `hero_description`, `hero_image`,
  `anatomy_heading`, `anatomy_subheading`,
  `ceo_eyebrow`, `ceo_quote`, `ceo_name`, `ceo_title`, `ceo_photo`,
  `team_heading`, `team_subheading`,
  `accolades_eyebrow`, `accolades_heading`, `accolades_heading_highlight`, `accolades_description`,
  `testimonials_heading`, `testimonials_subheading`
) VALUES (
  1, 'About Our Company', 'Engineering the', 'Future of Tech.',
  'Swift Sign Electronics is the premier architect of high-quality electronics and cutting-edge components, bridging the gap between profound innovation and global usability.',
  'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'The anatomy of excellence.', 'We are more than a distributor; we are the foundation upon which modern technology is built.',
  'Message from the CEO',
  'At Swift Sign Electronics, our vision extends far beyond supplying hardware. We exist to architect the foundation for tomorrow''s creators. Every microchip and component we deliver carries our absolute guarantee of excellence and reliability.',
  'Sir Tahir', 'Chief Executive Officer',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
  'The minds behind the magic.', 'Decades of combined engineering and strategic leadership.',
  'Accolades', 'Certified', 'Excellence.', 'Global standards met and exceeded across every department.',
  'Don''t just take our word for it.', 'Industry leaders trust Swift Sign Electronics to power their most critical innovations.'
);

-- ------------------------------------------------------------
-- about_value_cards ("anatomy of excellence" grid)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `about_value_cards` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `icon`           VARCHAR(60)   DEFAULT NULL,
  `title`          VARCHAR(180)  DEFAULT NULL,
  `description`    TEXT          DEFAULT NULL,
  `style_variant`  ENUM('light','dark','gradient','image') NOT NULL DEFAULT 'light',
  `image`          VARCHAR(500)  DEFAULT NULL,
  `sort_order`     SMALLINT      NOT NULL DEFAULT 0,
  `is_active`      TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `about_value_cards` (`id`, `icon`, `title`, `description`, `style_variant`, `image`, `sort_order`, `is_active`) VALUES
(1, 'FiCpu', 'Relentless Pursuit of Quality', 'Our organization is driven by a singular mission: to democratize access to enterprise-grade electronic components. From consumer silicon to industrial-grade hardware, every piece we source undergoes rigorous validation by our team of elite engineers.', 'light', NULL, 0, 1),
(2, 'FiActivity', 'Innovation First', 'Staying ahead of the curve is in our DNA. We continuously adapt to the rapidly evolving tech landscape.', 'dark', NULL, 1, 1),
(3, 'FiUsers', 'Client Centric', 'We build lasting partnerships through transparency, unparalleled support, and a deep understanding of your needs.', 'gradient', NULL, 2, 1),
(4, NULL, NULL, NULL, 'image', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200', 3, 1);

-- ------------------------------------------------------------
-- about_team_members ("the minds behind the magic")
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `about_team_members` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(180)  NOT NULL,
  `role`       VARCHAR(180)  DEFAULT NULL,
  `photo`      VARCHAR(500)  DEFAULT NULL,
  `sort_order` SMALLINT      NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `about_team_members` (`id`, `name`, `role`, `photo`, `sort_order`, `is_active`) VALUES
(1, 'Sir Tahir', 'Co-Founder & CEO', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600', 0, 1),
(2, 'Professor Ibn e Ameen', 'Chief Architect', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600', 1, 1);

-- ------------------------------------------------------------
-- about_accolade_cards ("certified excellence")
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `about_accolade_cards` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `icon`          VARCHAR(60)   DEFAULT NULL,
  `badge_text`    VARCHAR(60)   DEFAULT NULL,
  `title`         VARCHAR(180)  NOT NULL,
  `description`   TEXT          DEFAULT NULL,
  `size_variant`  ENUM('featured','standard','wide') NOT NULL DEFAULT 'standard',
  `sort_order`    SMALLINT      NOT NULL DEFAULT 0,
  `is_active`     TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `about_accolade_cards` (`id`, `icon`, `badge_text`, `title`, `description`, `size_variant`, `sort_order`, `is_active`) VALUES
(1, 'FiAward', '2024', 'Tech Innovator of the Year', 'Awarded for our disruptive advancements in hardware architecture and our commitment to sustainable, high-performance silicon solutions on a global scale.', 'featured', 0, 1),
(2, 'FiCheckCircle', 'Certification', 'ISO 9001:2015', 'Maintaining the highest international standards for rigorous quality management systems.', 'standard', 1, 1),
(3, 'FiTarget', 'Compliance', 'RoHS Compliant', 'Strict adherence to environmental safety, ensuring lead-free and eco-conscious manufacturing.', 'standard', 2, 1),
(4, 'FiStar', '2025', 'Best Global Support', 'Recognized by the B2B tech consortium for unmatched global client servicing and rapid supply chain resolution.', 'wide', 3, 1);

-- ------------------------------------------------------------
-- about_testimonials ("don't just take our word for it")
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `about_testimonials` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `rating`     TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `quote`      TEXT          NOT NULL,
  `name`       VARCHAR(180)  NOT NULL,
  `title`      VARCHAR(180)  DEFAULT NULL,
  `avatar`     VARCHAR(500)  DEFAULT NULL,
  `sort_order` SMALLINT      NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `about_testimonials` (`id`, `rating`, `quote`, `name`, `title`, `avatar`, `sort_order`, `is_active`) VALUES
(1, 5, 'Swift Sign Electronics completely transformed our supply chain. Their components are highly reliable, and their custom hardware solutions demonstrate absolute mastery of the craft.', 'Sarah Ahmed', 'VP Engineering, InnovateX', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', 0, 1),
(2, 5, 'The attention to detail and rigorous quality control is unmatched. We''ve sourced parts globally for years, but Swift Sign is in a completely different league of its own.', 'David Chen', 'CTO, Quantum Robotics', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', 1, 1),
(3, 5, 'Exceptional service and flawless execution. They delivered a massive bulk order of rare silicon components exactly when we needed it to meet our launch deadline.', 'Elena Rodriguez', 'Director of Hardware, NexTech', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200', 2, 1);

-- ------------------------------------------------------------
-- product_comments (customer comments/reviews on a product; edit_token
-- lets the anonymous poster edit/delete their own comment without login)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_comments` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `name`       VARCHAR(120) NOT NULL,
  `email`      VARCHAR(180) NOT NULL,
  `comment`    TEXT NOT NULL,
  `edit_token` CHAR(64) NOT NULL,
  `status`     ENUM('visible','hidden') NOT NULL DEFAULT 'visible',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_product_id` (`product_id`),
  INDEX `idx_edit_token` (`edit_token`),
  CONSTRAINT `fk_product_comments_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
