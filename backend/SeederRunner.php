<?php

declare(strict_types=1);

require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/seeders/SliderSeeder.php';

use Backend\Config\Database;
use Backend\Seeders\SliderSeeder;

// Get seeder name from command line
$seederName = $argv[1] ?? 'SliderSeeder';
$action = $argv[2] ?? 'run'; // run, show, or list

try {
    $pdo = Database::connection();

    // Map seeder names to classes
    $seeders = [
        'SliderSeeder' => SliderSeeder::class,
    ];

    if (!isset($seeders[$seederName])) {
        echo "❌ Unknown seeder: {$seederName}\n";
        echo "\nAvailable seeders:\n";
        foreach (array_keys($seeders) as $name) {
            echo "  - php SeederRunner.php {$name} [run|show]\n";
        }
        exit(1);
    }

    $seederClass = $seeders[$seederName];
    $seeder = new $seederClass($pdo);

    if ($action === 'show') {
        $seeder->show();
    } else {
        $seeder->run();
        if (method_exists($seeder, 'show')) {
            $seeder->show();
        }
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
