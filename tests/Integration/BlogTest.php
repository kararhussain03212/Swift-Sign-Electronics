<?php

declare(strict_types=1);

namespace Tests\Integration;

final class BlogTest extends ApiTestCase
{
    public function testDuplicateTitleGetsDisambiguatedSlug(): void
    {
        $title = 'PHPUnit Blog Post ' . bin2hex(random_bytes(4));

        [$status1, $body1] = $this->apiPost('/admin/blog', ['title' => $title], true);
        $this->assertSame(201, $status1, json_encode($body1));
        $id1 = (int) ($body1['data']['id'] ?? 0);
        $slug1 = (string) ($body1['data']['slug'] ?? '');
        $this->assertNotEmpty($slug1);

        [$status2, $body2] = $this->apiPost('/admin/blog', ['title' => $title], true);
        $this->assertSame(201, $status2, json_encode($body2));
        $id2 = (int) ($body2['data']['id'] ?? 0);
        $slug2 = (string) ($body2['data']['slug'] ?? '');

        $this->assertNotEmpty($slug2);
        $this->assertNotSame($slug1, $slug2, 'Second post with duplicate title should get a disambiguated slug');
        $this->assertSame($slug1 . '-2', $slug2);

        // Cleanup
        $this->apiDelete('/admin/blog/' . $id1, true);
        $this->apiDelete('/admin/blog/' . $id2, true);
    }
}
