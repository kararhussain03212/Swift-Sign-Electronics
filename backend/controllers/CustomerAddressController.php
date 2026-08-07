<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Address;
use Backend\Models\Customer;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/Address.php';
require_once __DIR__ . '/../models/Customer.php';
require_once __DIR__ . '/../utils/Response.php';

final class CustomerAddressController extends BaseController
{
    public function index(array $params = []): void
    {
        $this->requirePermission('manage_users');

        try {
            $model = new Customer();
            $rows = $model->allWithAddresses();

            $customers = array_map(function ($row) {
                $addresses = [];
                if (!empty($row['addresses_json'])) {
                    $addressesArray = json_decode('[' . $row['addresses_json'] . ']', true);
                    $addresses = is_array($addressesArray) ? $addressesArray : [];
                }

                return [
                    'id' => (int) $row['id'],
                    'name' => (string) ($row['name'] ?? ''),
                    'email' => (string) ($row['email'] ?? ''),
                    'address_count' => (int) ($row['address_count'] ?? 0),
                    'addresses' => $addresses,
                ];
            }, $rows);

            Response::success($customers, 'Customers with addresses fetched successfully');
        } catch (\Throwable $e) {
            Response::error('Failed to fetch customer addresses: ' . $e->getMessage(), 500);
        }
    }

    public function show(array $params): void
    {
        $this->requirePermission('manage_users');
        $customerId = (int) ($params['id'] ?? 0);

        if ($customerId <= 0) {
            Response::error('Invalid customer ID.', 422);
        }

        try {
            $customerModel = new Customer();
            $customer = $customerModel->find($customerId);

            if (!$customer) {
                Response::error('Customer not found.', 404);
            }

            $model = new Address();
            $addresses = $model->findByUserId($customerId);

            Response::success([
                'id' => (int) $customer['id'],
                'name' => (string) ($customer['name'] ?? ''),
                'email' => (string) ($customer['email'] ?? ''),
                'addresses' => array_map(fn ($addr) => $this->serializeAddress($addr), $addresses),
            ], 'Customer addresses fetched successfully');
        } catch (\Throwable $e) {
            Response::error('Failed to fetch customer: ' . $e->getMessage(), 500);
        }
    }

    public function deleteAddress(array $params): void
    {
        $this->requirePermission('manage_users');
        $addressId = (int) ($params['id'] ?? 0);

        if ($addressId <= 0) {
            Response::error('Invalid address ID.', 422);
        }

        try {
            $model = new Address();
            $address = $model->find($addressId);

            if (!$address) {
                Response::error('Address not found.', 404);
            }

            $model->delete($addressId);
            Response::success(null, 'Address deleted successfully');
        } catch (\Throwable $e) {
            Response::error('Failed to delete address: ' . $e->getMessage(), 500);
        }
    }

    private function serializeAddress(array $row): array
    {
        return [
            'id' => (int) ($row['id'] ?? 0),
            'user_id' => (int) ($row['user_id'] ?? 0),
            'label' => (string) ($row['label'] ?? ''),
            'first_name' => (string) ($row['first_name'] ?? ''),
            'last_name' => (string) ($row['last_name'] ?? ''),
            'phone' => (string) ($row['phone'] ?? ''),
            'email' => (string) ($row['email'] ?? ''),
            'street_address' => (string) ($row['street_address'] ?? ''),
            'apartment' => (string) ($row['apartment'] ?? ''),
            'city' => (string) ($row['city'] ?? ''),
            'state' => (string) ($row['state'] ?? ''),
            'postal_code' => (string) ($row['postal_code'] ?? ''),
            'country' => (string) ($row['country'] ?? ''),
            'is_default' => (bool) ($row['is_default'] ?? false),
            'created_at' => $row['created_at'] ?? null,
        ];
    }
}
