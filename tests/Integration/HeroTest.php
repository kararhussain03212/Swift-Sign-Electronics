<?php

declare(strict_types=1);

namespace Tests\Integration;

final class HeroTest extends ApiTestCase
{
    public function testReorderEndpointWorks(): void
    {
        [$status, $body] = $this->apiGet('/admin/hero?paginate=0', true);
        $this->assertSame(200, $status);
        $rows = $body['data'] ?? [];

        if ($rows === []) {
            $this->markTestSkipped('No hero slides present to reorder against.');
        }

        $items = [];
        foreach (array_slice($rows, 0, min(3, count($rows))) as $i => $row) {
            $items[] = ['id' => (int) $row['id'], 'sort_order' => $i];
        }

        [$reorderStatus, $reorderBody] = $this->apiPatch('/admin/hero/reorder', ['items' => $items], true);
        $this->assertSame(200, $reorderStatus, json_encode($reorderBody));
        $this->assertTrue($reorderBody['success'] ?? false);
    }
}
