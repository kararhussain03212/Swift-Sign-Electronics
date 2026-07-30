<?php

declare(strict_types=1);

namespace Backend\Seeders;

use Backend\Config\Database;
use PDO;

require_once __DIR__ . '/../config/database.php';

final class AdminSeeder
{
    public static function seed(): void
    {
        $pdo = Database::connection();

        $email = 'admin@sstechnologies.pk';
        $password = password_hash('admin123', PASSWORD_BCRYPT);
        $name = 'Swift Sign Admin';

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

        echo "Email: $email\n";
        echo "Password: admin123\n";
    }
}

// Run seeder if executed directly
if (php_sapi_name() === 'cli' && basename($argv[0] ?? '') === basename(__FILE__)) {
    try {
        AdminSeeder::seed();
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}
