<?php

declare(strict_types=1);

namespace Tests\Integration;

final class UserTest extends ApiTestCase
{
    public function testSelfRoleChangeIsForbidden(): void
    {
        [$status, $body] = $this->apiPut('/admin/users/' . self::$adminId, ['role' => 'editor'], true);
        $this->assertSame(403, $status, json_encode($body));
    }

    public function testThrowawayUserCrud(): void
    {
        $email = 'phpunit-test-' . bin2hex(random_bytes(4)) . '@example.com';

        [$createStatus, $createBody] = $this->apiPost('/admin/users', [
            'name' => 'PHPUnit Throwaway',
            'email' => $email,
            'password' => 'Password123',
            'role' => 'editor',
            'status' => 'active',
        ], true);

        $this->assertSame(201, $createStatus, json_encode($createBody));
        $id = (int) ($createBody['data']['id'] ?? 0);
        $this->assertGreaterThan(0, $id);

        [$delStatus, $delBody] = $this->apiDelete('/admin/users/' . $id, true);
        $this->assertSame(200, $delStatus, json_encode($delBody));

        [$getStatus] = $this->apiGet('/admin/users/' . $id, true);
        $this->assertSame(404, $getStatus);
    }
}
