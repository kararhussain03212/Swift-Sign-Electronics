<?php

declare(strict_types=1);

namespace Backend\Utils;

/**
 * File-backed sliding-window rate limiter, keyed per bucket + client IP.
 * Mirrors the pattern AuthController used for login, generalized for reuse.
 */
final class RateLimiter
{
    /**
     * Aborts the request with a 429 if the caller has exceeded $maxAttempts
     * within $windowSeconds for the given $bucket; otherwise records this attempt.
     */
    public static function enforce(string $bucket, int $maxAttempts, int $windowSeconds): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $now = time();
        $path = dirname(__DIR__) . '/storage/rate_limit_' . preg_replace('/[^a-z0-9_-]/i', '_', $bucket) . '.json';

        if (!is_file($path)) {
            file_put_contents($path, json_encode([], JSON_UNESCAPED_SLASHES));
        }

        $raw = file_get_contents($path) ?: '[]';
        $state = json_decode($raw, true);
        if (!is_array($state)) {
            $state = [];
        }

        $entries = array_filter($state[$ip] ?? [], static fn ($timestamp): bool => ($now - (int) $timestamp) <= $windowSeconds);

        if (count($entries) >= $maxAttempts) {
            $minutes = max(1, (int) ceil($windowSeconds / 60));
            Response::error("Too many requests. Try again in {$minutes} minute" . ($minutes === 1 ? '' : 's') . '.', 429);
        }

        $entries[] = $now;
        $state[$ip] = array_values($entries);

        file_put_contents($path, json_encode($state, JSON_UNESCAPED_SLASHES));
    }
}
