<?php

declare(strict_types=1);

namespace Backend\Seeders;

use PDO;
use PDOException;

/**
 * Slider Seeder
 *
 * Manages hero slider data and images in the database.
 * Usage: php SeederRunner.php SliderSeeder
 */
class SliderSeeder
{
    private PDO $pdo;

    /** Directory the app actually serves uploads from (see backend/utils/FileUpload.php). */
    private string $uploadsDir;

    /** Directory holding the source images to seed from (repo assets, not served directly). */
    private string $sourceDir;

    public function __construct(PDO $pdo, string $uploadsDir = '', string $sourceDir = '')
    {
        $this->pdo = $pdo;
        $this->uploadsDir = $uploadsDir ?: dirname(__DIR__) . '/uploads';
        $this->sourceDir = $sourceDir ?: dirname(dirname(__DIR__)) . '/dist';
    }

    /**
     * Copy the source hero images into the real uploads directory (flat, matching
     * FileUpload::upload()'s layout) and return their public "/uploads/..." paths.
     */
    private function getAvailableImages(): array
    {
        $sourceFiles = ['hero1.png', 'hero2.png', 'hero3.png'];

        if (!is_dir($this->uploadsDir) && !mkdir($this->uploadsDir, 0775, true)) {
            return [];
        }

        $images = [];
        foreach ($sourceFiles as $file) {
            $sourcePath = $this->sourceDir . '/' . $file;
            if (!is_file($sourcePath)) continue;

            $targetName = 'img_hero_slide_' . pathinfo($file, PATHINFO_FILENAME) . '.png';
            $targetPath = $this->uploadsDir . '/' . $targetName;
            copy($sourcePath, $targetPath);

            $images[] = '/uploads/' . $targetName;
        }

        return $images;
    }

    /**
     * Define slider data
     */
    private function getSliderData(): array
    {
        return [
            [
                'title' => 'Premium Electronics',
                'subtitle' => 'Explore our curated collection of quality components',
                'sort_order' => 1,
                'is_active' => 1,
                'image_index' => 0,
            ],
            [
                'title' => 'Latest Development Boards',
                'subtitle' => 'Powerful boards for your next project',
                'sort_order' => 2,
                'is_active' => 1,
                'image_index' => 1,
            ],
            [
                'title' => 'Expert Tools & Accessories',
                'subtitle' => 'Everything you need for electronics projects',
                'sort_order' => 3,
                'is_active' => 1,
                'image_index' => 2,
            ],
        ];
    }

    /**
     * Run the seeder
     */
    public function run(): void
    {
        try {
            echo "========================================\n";
            echo "🎬 Slider Seeder\n";
            echo "========================================\n\n";

            $images = $this->getAvailableImages();
            $sliders = $this->getSliderData();

            if (empty($images)) {
                echo "⚠️  No source images found in {$this->sourceDir}\n";
                return;
            }

            echo "✓ Found " . count($images) . " images:\n";
            foreach ($images as $i => $img) {
                echo "  [{$i}] {$img}\n";
            }
            echo "\n";

            // Clear existing sliders (optional)
            $this->pdo->exec('DELETE FROM hero_slides');
            $this->pdo->exec('ALTER TABLE hero_slides AUTO_INCREMENT = 1');
            echo "✓ Cleared existing sliders\n\n";

            // Insert new sliders
            $stmt = $this->pdo->prepare(
                'INSERT INTO hero_slides (title, subtitle, image, sort_order, is_active, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, NOW(), NOW())'
            );

            $created = 0;
            foreach ($sliders as $slider) {
                $imageIndex = min($slider['image_index'], count($images) - 1);
                $imagePath = $images[$imageIndex];

                if ($stmt->execute([
                    $slider['title'],
                    $slider['subtitle'],
                    $imagePath,
                    $slider['sort_order'],
                    $slider['is_active'],
                ])) {
                    $created++;
                    echo "✓ Created slider: {$slider['title']}\n";
                    echo "  Image: {$imagePath}\n";
                    echo "  Order: {$slider['sort_order']}\n\n";
                }
            }

            echo "========================================\n";
            echo "✓ Successfully seeded {$created} sliders!\n";
            echo "========================================\n";

        } catch (PDOException $e) {
            echo "❌ Error: " . $e->getMessage() . "\n";
            exit(1);
        }
    }

    /**
     * Show current sliders in database
     */
    public function show(): void
    {
        try {
            echo "\n📊 Current Sliders in Database:\n";
            echo "========================================\n\n";

            $stmt = $this->pdo->query('SELECT id, title, subtitle, image, sort_order, is_active FROM hero_slides ORDER BY sort_order ASC');
            $sliders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($sliders)) {
                echo "No sliders found.\n";
                return;
            }

            foreach ($sliders as $slider) {
                $status = $slider['is_active'] ? '✅ Active' : '⭕ Inactive';
                echo "[ID: {$slider['id']}] {$slider['title']}\n";
                echo "  Subtitle: {$slider['subtitle']}\n";
                echo "  Image: {$slider['image']}\n";
                echo "  Order: {$slider['sort_order']} | Status: {$status}\n\n";
            }

        } catch (PDOException $e) {
            echo "❌ Error: " . $e->getMessage() . "\n";
            exit(1);
        }
    }
}
