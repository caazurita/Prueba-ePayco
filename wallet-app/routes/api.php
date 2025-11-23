<?php

use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/server/wallet', function () {
    return response()->file(storage_path('wsdl/wallet.wsdl'));
});



Route::post('/server/wallet', function () {
    $wsdl = storage_path('wsdl/wallet.wsdl');
    $server = new \SoapServer($wsdl);
    $server->setClass(WalletService::class);
    $server->handle();
});
