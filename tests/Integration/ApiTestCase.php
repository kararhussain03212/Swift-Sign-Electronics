<?php

declare(strict_types=1);

namespace Tests\Integration;

use PHPUnit\Framework\TestCase;

abstract class ApiTestCase extends TestCase
{
    protected static string $baseUrl = 'http://localhost/Electronics/backend/api';

    protected static string $adminEmail = 'info@sstechnologies.pk';
    protected static string $adminPassword = 'SwiftSign@2026';

    protected static ?string $token = null;
    protected static ?string $csrfToken = null;
    protected static ?int $adminId = null;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        if (self::$token !== null) {
            return;
        }

        [$status, $body] = self::rawRequest('POST', '/auth/login', [
            'email' => self::$adminEmail,
            'password' => self::$adminPassword,
        ], []);

        if ($status !== 200 || !isset($body['data']['token'])) {
            throw new \RuntimeException('Failed to authenticate test admin: ' . json_encode($body));
        }

        self::$token = $body['data']['token'];
        self::$csrfToken = $body['data']['csrf_token'];
        self::$adminId = (int) ($body['data']['admin']['id'] ?? 0);
    }

    /**
     * @return array{0:int,1:array<mixed>}
     */
    protected static function rawRequest(string $method, string $path, ?array $body, array $headers): array
    {
        $url = self::$baseUrl . $path;
        $ch = curl_init($url);

        $payload = $body !== null ? json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null;

        $defaultHeaders = ['Content-Type: application/json'];
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => array_merge($defaultHeaders, $headers),
        ]);

        if ($payload !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        }

        $response = curl_exec($ch);
        if ($response === false) {
            throw new \RuntimeException('cURL error: ' . curl_error($ch));
        }
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode((string) $response, true);
        if (!is_array($decoded)) {
            $decoded = ['raw' => $response];
        }

        return [$status, $decoded];
    }

    protected function authHeaders(): array
    {
        return [
            'Authorization: Bearer ' . self::$token,
            'X-CSRF-Token: ' . self::$csrfToken,
        ];
    }

    protected function apiGet(string $path, bool $authed = false): array
    {
        return self::rawRequest('GET', $path, null, $authed ? $this->authHeaders() : []);
    }

    protected function apiPost(string $path, array $body = [], bool $authed = false): array
    {
        return self::rawRequest('POST', $path, $body, $authed ? $this->authHeaders() : []);
    }

    protected function apiPut(string $path, array $body = [], bool $authed = false): array
    {
        return self::rawRequest('PUT', $path, $body, $authed ? $this->authHeaders() : []);
    }

    protected function apiPatch(string $path, array $body = [], bool $authed = false): array
    {
        return self::rawRequest('PATCH', $path, $body, $authed ? $this->authHeaders() : []);
    }

    protected function apiDelete(string $path, bool $authed = false): array
    {
        return self::rawRequest('DELETE', $path, null, $authed ? $this->authHeaders() : []);
    }
}
