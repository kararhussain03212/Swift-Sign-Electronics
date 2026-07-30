<?php

declare(strict_types=1);

require_once __DIR__ . '/config/database.php';

use Backend\Config\Database;

try {
    $pdo = Database::connection();

    // Create admin if not exists
    $email = 'admin@sstechnologies.pk';
    $password = password_hash('admin123', PASSWORD_BCRYPT);
    $name = 'Swift Sign Admin';

    // Check if table exists
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'admins'")->rowCount();

    if ($tableCheck === 0) {
        // Create admins table if it doesn't exist
        $pdo->exec('
            CREATE TABLE admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT "editor",
                status VARCHAR(50) DEFAULT "active",
                designation VARCHAR(255),
                phone VARCHAR(20),
                location VARCHAR(255),
                bio TEXT,
                profile_photo VARCHAR(255),
                permissions_json JSON,
                last_login_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX (email),
                INDEX (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ');
        echo "✓ Created admins table\n";
    }

    // Check if admin exists
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $existing = $stmt->fetch();

    if ($existing) {
        // Update existing admin
        $stmt = $pdo->prepare('UPDATE admins SET password = :password, updated_at = NOW() WHERE email = :email');
        $stmt->execute([
            ':password' => $password,
            ':email' => $email,
        ]);
        echo "✓ Admin password updated successfully!\n";
    } else {
        // Create new admin
        $stmt = $pdo->prepare('
            INSERT INTO admins (name, email, password, role, status, created_at, updated_at)
            VALUES (:name, :email, :password, :role, :status, NOW(), NOW())
        ');
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $password,
            ':role' => 'admin',
            ':status' => 'active',
        ]);
        echo "✓ Admin account created successfully!\n";
    }

    echo "\n=== Admin Credentials ===\n";
    echo "Email: $email\n";
    echo "Password: admin123\n";
    echo "========================\n";

} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
