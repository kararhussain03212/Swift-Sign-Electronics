<?php

declare(strict_types=1);

namespace Tests\Integration;

final class AuthTest extends ApiTestCase
{
    public function testLoginWithValidCredentialsSucceeds(): void
    {
        [$status, $body] = self::rawRequest('POST', '/auth/login', [
            'email' => self::$adminEmail,
            'password' => self::$adminPassword,
        ], []);

        $this->assertSame(200, $status);
        $this->assertTrue($body['success']);
        $this->assertNotEmpty($body['data']['token']);
        $this->assertNotEmpty($body['data']['csrf_token']);
    }

    public function testLoginWithWrongPasswordFails(): void
    {
        [$status, $body] = self::rawRequest('POST', '/auth/login', [
            'email' => self::$adminEmail,
            'password' => 'wrong-password-xyz',
        ], []);

        $this->assertSame(401, $status);
        $this->assertFalse($body['success'] ?? true);
        $wrongPasswordMessage = $body['message'] ?? '';

        [$status2, $body2] = self::rawRequest('POST', '/auth/login', [
            'email' => 'unknown-user-does-not-exist@example.com',
            'password' => 'wrong-password-xyz',
        ], []);

        $this->assertSame(401, $status2);
        $unknownEmailMessage = $body2['message'] ?? '';

        // No user-enumeration: same status + same message for wrong password vs unknown email.
        $this->assertSame($wrongPasswordMessage, $unknownEmailMessage);
    }
}
