<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class Order extends BaseModel
{
    protected string $table = 'orders';
    protected array $fillable = [
        'order_number', 'customer_name', 'customer_email', 'customer_phone',
        'address', 'city', 'country', 'notes',
        'subtotal', 'total', 'status',
    ];

    public function createWithItems(array $order, array $items): int
    {
        $this->pdo->beginTransaction();

        try {
            $orderId = $this->create($order);

            $stmt = $this->pdo->prepare(
                'INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
                 VALUES (:order_id, :product_id, :product_name, :unit_price, :quantity, :line_total)'
            );

            foreach ($items as $item) {
                $qty   = max(1, (int) ($item['quantity'] ?? 1));
                $price = (float) ($item['price'] ?? 0);
                $stmt->execute([
                    ':order_id'     => $orderId,
                    ':product_id'   => isset($item['product_id']) ? (int) $item['product_id'] : null,
                    ':product_name' => (string) ($item['name'] ?? ''),
                    ':unit_price'   => $price,
                    ':quantity'     => $qty,
                    ':line_total'   => $price * $qty,
                ]);
            }

            $this->pdo->commit();
            return $orderId;
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function findWithItems(int $id): ?array
    {
        $order = $this->find($id);
        if ($order === null) {
            return null;
        }

        $stmt = $this->pdo->prepare('SELECT * FROM order_items WHERE order_id = :id');
        $stmt->execute([':id' => $id]);
        $order['items'] = $stmt->fetchAll() ?: [];

        return $order;
    }
}
