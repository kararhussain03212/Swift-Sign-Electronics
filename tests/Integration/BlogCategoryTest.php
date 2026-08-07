<?php

declare(strict_types=1);

namespace Tests\Integration;

final class BlogCategoryTest extends ApiTestCase
{
    public function testRenameCascadesToPosts(): void
    {
        $catName = 'PHPUnit Cat ' . bin2hex(random_bytes(4));
        [$catStatus, $catBody] = $this->apiPost('/admin/blog-categories', ['name' => $catName], true);
        $this->assertSame(201, $catStatus, json_encode($catBody));
        $catId = (int) ($catBody['data']['id'] ?? 0);

        $postTitle = 'PHPUnit Post For Cat ' . bin2hex(random_bytes(4));
        [$postStatus, $postBody] = $this->apiPost('/admin/blog', [
            'title' => $postTitle,
            'category' => $catName,
        ], true);
        $this->assertSame(201, $postStatus, json_encode($postBody));
        $postId = (int) ($postBody['data']['id'] ?? 0);
        $this->assertSame($catName, $postBody['data']['category']);

        $newCatName = $catName . ' Renamed';
        [$renameStatus, $renameBody] = $this->apiPut('/admin/blog-categories/' . $catId, ['name' => $newCatName], true);
        $this->assertSame(200, $renameStatus, json_encode($renameBody));

        [$getStatus, $getBody] = $this->apiGet('/admin/blog/' . $postId, true);
        $this->assertSame(200, $getStatus);
        $this->assertSame($newCatName, $getBody['data']['category'], 'Post category should reflect renamed category');

        // Cleanup
        $this->apiDelete('/admin/blog/' . $postId, true);
        $this->apiDelete('/admin/blog-categories/' . $catId, true);
    }
}
