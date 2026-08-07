<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

/**
 * Read-only view of the `users` table (storefront customer accounts),
 * as consumed by the admin Customers page. Not to be confused with
 * Admin (backend/models/Admin.php), which is the separate admins table.
 */
final class Customer extends BaseModel
{
    protected string $table = 'users';
    protected array $fillable = [];

    /**
     * All customers with their address count and full address list,
     * newest customer first.
     */
    public function allWithAddresses(): array
    {
        $stmt = $this->pdo->query('
            SELECT
                u.id, u.name, u.email,
                COUNT(a.id) as address_count,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        "id", a.id,
                        "label", a.label,
                        "first_name", a.first_name,
                        "last_name", a.last_name,
                        "phone", a.phone,
                        "email", a.email,
                        "street_address", a.street_address,
                        "apartment", a.apartment,
                        "city", a.city,
                        "state", a.state,
                        "postal_code", a.postal_code,
                        "country", a.country,
                        "is_default", a.is_default,
                        "created_at", a.created_at
                    )
                ) as addresses_json
            FROM users u
            LEFT JOIN addresses a ON u.id = a.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        ');

        return $stmt->fetchAll() ?: [];
    }
}
