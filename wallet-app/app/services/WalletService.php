<?php

namespace App\Services;

use App\Mail\SendTokenMail;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

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

    public function addCredit($document, $phone, $amount)
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

            $user->balance += $amount;
            $user->save();

            $data = [
                'success' => true,
                'message' => 'credit added successfully',
                'cod_error' => '00',
                'data' => [
                    'document' => $document,
                    'new_balance' => $user->balance,
                ],
            ];
            return json_encode($data);
        } catch (\Exception $e) {
            $data = [
                'success' => false,
                'message_error' => 'ERROR_ADDING_CREDIT',
                'cod_error' => '500',
                'data' => $e->getMessage()
            ];
            return json_encode($data);
        }
    }

    public function requestPayment($document, $phone, $amount)
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

            $token = random_int(100000, 999999);
            $sessionId = Str::uuid()->toString();

            Mail::to($user->email)->send(new SendTokenMail($token));

            Transaction::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'token' => $token,
                'session_id' => $sessionId,
                'type' => 'debit',
                'status' => 'pending',
            ]);
            $data = [
                'success' => true,
                'message' => 'payment request created successfully',
                'cod_error' => '00',
                'data' => [
                    'document' => $document,
                    'session_id' => $sessionId,
                ],
            ];
            return json_encode($data);
        } catch (\Throwable $th) {
            $data = [
                'success' => false,
                'message_error' => 'ERROR_REQUESTING_PAYMENT',
                'cod_error' => '500',
                'data' => $th->getMessage()
            ];
            return json_encode($data);
        }
    }

    public function makePayment($sessionId, $token)
    {
        try {
            $transaction = Transaction::where('status', 'pending')
                ->where('type', 'debit')
                ->where('token', $token)
                ->where('session_id', $sessionId)
                ->first();

            if (!$transaction) {
                return json_encode([
                    'success' => false,
                    'message' => 'TRANSACTION_NOT_FOUND',
                    'cod_error' => '404',
                    'data' => '',
                ]);
            }

            $user = User::find($transaction->user_id);
            if (!$user) {
                return json_encode([
                    'success' => false,
                    'message' => 'TRANSACTION_NOT_FOUND',
                    'cod_error' => '404',
                    'data' => '',
                ]);
            }

            if ($user->balance < $transaction->amount) {
                return json_encode([
                    'success' => false,
                    'message' => 'INSUFFICIENT_FUNDS',
                    'cod_error' => '402',
                    'data' => '',
                ]);
            }

            $now = Carbon::now();
            $transactionDate = $transaction->created_at;
            $diffInMinutes = $transactionDate->diffInMinutes($now);

            if ($diffInMinutes > 5) {
                $transaction->status = 'failed';
                $transaction->save();
                return json_encode([
                    'success' => false,
                    'message' => 'TRANSACTION_EXPIRED',
                    'cod_error' => '408',
                    'data' => '',
                ]);
            }

            $user->balance -= $transaction->amount;
            $user->save();

            $transaction->status = 'completed';
            $transaction->save();

            $data = [
                'success' => true,
                'message' => 'Payment processed successfully',
                'cod_error' => '00',
                'data' => [
                    'document' => $user->document,
                    'new_balance' => $user->balance,
                ],
            ];
            return json_encode($data);
        } catch (\Throwable $th) {
            $data = [
                'success' => false,
                'message_error' => 'ERROR_REQUESTING_PAYMENT',
                'cod_error' => '500',
                'data' => $th->getMessage()
            ];
            return json_encode($data);
        }
    }
}
