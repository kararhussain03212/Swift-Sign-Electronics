<?php
require_once __DIR__ . '/config/Database.php';

use Backend\Config\Database;

try {
    $pdo = Database::connection();

    // Clear existing categories
    $pdo->exec('DELETE FROM categories');
    $pdo->exec('ALTER TABLE categories AUTO_INCREMENT = 1');

    // Insert 3 new categories
    $categories = [
        ['cat_key' => 'tool', 'name' => 'Tool', 'icon' => 'wrench', 'sort_order' => 1, 'is_active' => 1],
        ['cat_key' => 'instrument', 'name' => 'Instrument', 'icon' => 'microphone', 'sort_order' => 2, 'is_active' => 1],
        ['cat_key' => 'project', 'name' => 'Project', 'icon' => 'briefcase', 'sort_order' => 3, 'is_active' => 1],
    ];

    $stmt = $pdo->prepare('INSERT INTO categories (cat_key, name, icon, sort_order, is_active) VALUES (?, ?, ?, ?, ?)');

    foreach ($categories as $cat) {
        $stmt->execute([$cat['cat_key'], $cat['name'], $cat['icon'], $cat['sort_order'], $cat['is_active']]);
    }

    echo "✓ Categories seeded successfully!\n";
    echo "  - Tool\n";
    echo "  - Instrument\n";
    echo "  - Project\n";
} catch (Exception $e) {
    echo "✗ Error seeding categories: " . $e->getMessage() . "\n";
    exit(1);
}
