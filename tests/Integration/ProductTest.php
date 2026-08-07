<?php

declare(strict_types=1);

namespace Tests\Integration;

final class ProductTest extends ApiTestCase
{
    private static ?int $productId = null;

    public static function tearDownAfterClass(): void
    {
        if (self::$productId !== null) {
            self::rawRequest('DELETE', '/admin/products/' . self::$productId, null, [
                'Authorization: Bearer ' . self::$token,
                'X-CSRF-Token: ' . self::$csrfToken,
            ]);
            self::$productId = null;
        }
        parent::tearDownAfterClass();
    }

    public function testSuperAdminCanCreateAndUpdateProduct(): void
    {
        $name = 'PHPUnit Test Product ' . bin2hex(random_bytes(4));
        [$status, $body] = $this->apiPost('/admin/products', [
            'name' => $name,
            'price' => 42.50,
        ], true);

        $this->assertSame(201, $status, json_encode($body));
        self::$productId = (int) ($body['data']['id'] ?? 0);
        $this->assertGreaterThan(0, self::$productId);

        [$updStatus, $updBody] = $this->apiPut('/admin/products/' . self::$productId, [
            'name' => $name . ' Updated',
            'price' => 55.00,
        ], true);

        $this->assertSame(200, $updStatus, json_encode($updBody));
        $this->assertSame($name . ' Updated', $updBody['data']['name']);
    }

    public function testReorderEndpointWorks(): void
    {
        [$status, $body] = $this->apiGet('/admin/products?paginate=0', true);
        $this->assertSame(200, $status);
        $rows = $body['data'] ?? [];
        $this->assertNotEmpty($rows, 'Need at least one product to test reorder');

        $items = [];
        foreach (array_slice($rows, 0, min(3, count($rows))) as $i => $row) {
            $items[] = ['id' => (int) $row['id'], 'sort_order' => $i];
        }

        [$reorderStatus, $reorderBody] = $this->apiPatch('/admin/products/reorder', ['items' => $items], true);
        $this->assertSame(200, $reorderStatus, json_encode($reorderBody));
        $this->assertTrue($reorderBody['success'] ?? false);
    }
}
