<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class WalletService
{
    public function createUser($name, $document, $phone, $email)
    {
        try {
            $user = User::where('email', $email)
                ->orWhere('document', $document)
                ->orWhere('phone', $phone)
                ->first();

            if ($user) {
                return json_encode([
                    'success' => false,
                    'message' => 'USER_ALREADY_EXISTS',
                    'cod_error' => '409',
                    'data' => '',
                ]);
            }

            $user = User::create([
                'name' => $name,
                'document' => $document,
                'phone' => $phone,
                'email' => $email,
            ]);

            $data = [
                'success' => true,
                'message' => 'user created successfully',
                'cod_error' => '00',
                'data' =>  $user->only(['name', 'email', 'phone', 'document']),
            ];
            return json_encode($data);
        } catch (\Exception $e) {
            $data = [
                'success' => false,
                'message_error' => 'ERROR_CREATING_USER',
                'cod_error' => '500',
                'data' => $e->getMessage()
            ];
            return json_encode($data);
        }
    }
    public function getBalance($document, $phone)
    {
        try {
            $user = User::where('document', $document)
                ->where('phone', $phone)
                ->first();

            if (!$user) {
                return json_encode([
                    'success' => false,
                    'message' => 'USER_NOT_FOUND',
                    'cod_error' => '404',
                    'data' => '',
                ]);
            }

            $balance = $user->balance;
            $data = [
                'success' => true,
                'message' => 'balance retrieved successfully',
                'cod_error' => '00',
                'data' => [
                    'document' => $document,
                    'balance' => $balance,
                ],
            ];
            return json_encode($data);
        } catch (\Exception $e) {
            $data = [
                'success' => false,
                'message_error' => 'ERROR_RETRIEVING_BALANCE',
                'cod_error' => '500',
                'data' => $e->getMessage()
            ];
            return json_encode($data);
        }
    }
}
