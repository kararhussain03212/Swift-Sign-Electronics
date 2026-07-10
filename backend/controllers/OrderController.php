<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Order;
use Backend\Utils\ActivityLogger;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseCrudController.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../utils/ActivityLogger.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class OrderController extends BaseCrudController
{
    protected string $modelClass = Order::class;
    protected string $resourceName = 'orders';
    protected array $requiredCreateFields = ['customer_name'];

    /**
     * Public checkout submission: order info + cart items.
     */
    public function publicStore(array $params = []): void
    {
        $raw   = $this->body();
        $order = Validator::sanitizeInput($raw);

        $errors = Validator::required($order, ['customer_name']);
        if ($errors !== []) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }

        $items = $raw['items'] ?? [];
        if (!is_array($items) || $items === []) {
            Response::error('Order must contain at least one item', 422);
        }

        $subtotal = 0.0;
        foreach ($items as $item) {
            $subtotal += ((float) ($item['price'] ?? 0)) * max(1, (int) ($item['quantity'] ?? 1));
        }

        $order['order_number'] = 'SSE-' . strtoupper(bin2hex(random_bytes(4)));
        $order['subtotal']     = $subtotal;
        $order['total']        = $subtotal;
        $order['status']       = 'pending';
        unset($order['items']);

        $model = new Order();
        $id    = $model->createWithItems($order, $items);

        Response::success($model->findWithItems($id), 'Order placed successfully', 201);
    }

    public function show(array $params): void
    {
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid resource ID', 422);
        }

        $row = (new Order())->findWithItems($id);
        if ($row === null) {
            Response::error('Resource not found', 404);
        }

        Response::success($row, 'Fetched successfully');
    }

    public function updateStatus(array $params): void
    {
        $this->requirePermission('edit_content');
        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Invalid resource ID', 422);
        }

        $model = new Order();
        if (!$model->find($id)) {
            Response::error('Resource not found', 404);
        }

        $status  = trim((string) ($this->body()['status'] ?? ''));
        $allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($status, $allowed, true)) {
            Response::error('Invalid status', 422);
        }

        $model->update($id, ['status' => $status]);
        ActivityLogger::log($this->currentAdminId(), 'update', $this->resourceName, $id);

        Response::success($model->findWithItems($id), 'Status updated');
    }
}
