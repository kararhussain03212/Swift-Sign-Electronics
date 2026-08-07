<?php

declare(strict_types=1);

namespace Tests\Integration;

final class CategoryTest extends ApiTestCase
{
    public function testCrudRoundTrip(): void
    {
        $name = 'Test Category ' . bin2hex(random_bytes(4));

        [$createStatus, $createBody] = $this->apiPost('/admin/categories', ['name' => $name], true);
        $this->assertSame(201, $createStatus, json_encode($createBody));
        $id = (int) ($createBody['data']['id'] ?? 0);
        $this->assertGreaterThan(0, $id);

        [$getStatus, $getBody] = $this->apiGet('/admin/categories/' . $id, true);
        $this->assertSame(200, $getStatus);
        $this->assertSame($name, $getBody['data']['name']);

        $newName = $name . ' Updated';
        [$updStatus, $updBody] = $this->apiPut('/admin/categories/' . $id, ['name' => $newName], true);
        $this->assertSame(200, $updStatus, json_encode($updBody));
        $this->assertSame($newName, $updBody['data']['name']);

        [$getStatus2, $getBody2] = $this->apiGet('/admin/categories/' . $id, true);
        $this->assertSame(200, $getStatus2);
        $this->assertSame($newName, $getBody2['data']['name']);

        [$delStatus, $delBody] = $this->apiDelete('/admin/categories/' . $id, true);
        $this->assertSame(200, $delStatus, json_encode($delBody));

        [$getStatus3] = $this->apiGet('/admin/categories/' . $id, true);
        $this->assertSame(404, $getStatus3);
    }

    public function testUpdateWithInvalidIdReturns404(): void
    {
        [$status, $body] = $this->apiPut('/admin/categories/999999999', ['name' => 'Nope'], true);
        $this->assertSame(404, $status, json_encode($body));
    }
}
