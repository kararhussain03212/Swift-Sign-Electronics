<?php

declare(strict_types=1);

namespace Tests\Integration;

final class ForeignKeyValidationTest extends ApiTestCase
{
    public function testNavLinkItemWithNonexistentParentReturns422(): void
    {
        [$status, $body] = $this->apiPost('/admin/nav-link-items', [
            'nav_link_id' => 999999,
            'label' => 'Bad Link',
            'url' => '/bad',
        ], true);

        $this->assertSame(422, $status, json_encode($body));
        $this->assertArrayHasKey('fields', $body['data'] ?? $body['errors'] ?? $body);
    }

    public function testFooterLinkWithNonexistentGroupReturns422(): void
    {
        [$status, $body] = $this->apiPost('/admin/footer-links', [
            'group_id' => 999999,
            'label' => 'Bad Footer Link',
            'url' => '/bad',
        ], true);

        $this->assertSame(422, $status, json_encode($body));
    }
}
