<?php

declare(strict_types=1);

namespace Tests\Integration;

final class OrderTest extends ApiTestCase
{
    public function testServerSideRecomputesTamperedPrice(): void
    {
        [$prodStatus, $prodBody] = self::rawRequest('GET', '/public/products?paginate=0', null, []);
        $this->assertSame(200, $prodStatus);
        $products = $prodBody['data'] ?? [];
        $this->assertNotEmpty($products, 'Need at least one public product to test order pricing');

        $product = $products[0];
        $productId = (int) $product['id'];
        $realPrice = (float) $product['price'];
        $discount = (float) ($product['discount'] ?? 0);
        $expectedUnitPrice = round($realPrice * (1 - max(0, min(100, $discount)) / 100), 2);

        $tamperedPrice = 0.01;

        [$orderStatus, $orderBody] = $this->apiPost('/public/orders', [
            'customer_name' => 'PHPUnit Tester',
            'items' => [
                [
                    'product_id' => $productId,
                    'quantity' => 1,
                    'price' => $tamperedPrice,
                    'name' => 'tampered name',
                ],
            ],
        ], false);

        $this->assertSame(201, $orderStatus, json_encode($orderBody));
        $orderId = (int) ($orderBody['data']['id'] ?? 0);
        $this->assertGreaterThan(0, $orderId);

        $items = $orderBody['data']['items'] ?? [];
        $this->assertNotEmpty($items, 'Order should include items');
        $storedPrice = (float) ($items[0]['unit_price'] ?? $items[0]['price'] ?? -1);

        $this->assertSame($expectedUnitPrice, $storedPrice, 'Stored unit price must be server-computed, not the tampered client value');
        $this->assertNotEquals($tamperedPrice, $storedPrice);

        // Cleanup via admin endpoint
        $del = self::rawRequest('DELETE', '/admin/orders/' . $orderId, null, [
            'Authorization: Bearer ' . self::$token,
            'X-CSRF-Token: ' . self::$csrfToken,
        ]);
        $this->assertSame(200, $del[0], 'Failed to clean up test order: ' . json_encode($del[1]));
    }
}
