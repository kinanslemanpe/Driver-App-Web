<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WhatsAppTemplateController;

// Start Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);
// End Auth

// Start Users
Route::middleware(['auth:sanctum', 'authorize:admin'])
    ->get('/users/lookup', [UserController::class, 'lookup']);
// End Users
// Start Drivers
Route::middleware('auth:sanctum')->get('/drivers', [UserController::class, 'listDrivers']);
Route::middleware(['auth:sanctum', 'authorize:admin'])->post('/drivers', [UserController::class, 'createDriver']);
// End Drivers

// Start Orders
Route::middleware(['auth:sanctum', 'authorize:admin|driver'])->group(function() {
    Route::post('/drivers/{driverId}/orders', [OrderController::class, 'store']);
    Route::put('/drivers/{driverId}/orders/{orderId}', [OrderController::class, 'update']);
    Route::get('/drivers/{driverId}/orders', [OrderController::class, 'index']);
});
Route::middleware(['auth:sanctum', 'authorize:admin'])->group(function () {
    Route::delete('/drivers/{driverId}/orders/{orderId}', [OrderController::class, 'delete']);
    Route::delete('/drivers/{driverId}/orders', [OrderController::class, 'destroy']);
});
// End Orders

// Start Whatsapp Templates
Route::get('/WhatsApp-template', [WhatsAppTemplateController::class, 'index']);
Route::middleware(['auth:sanctum', 'authorize:admin'])->group(function () {
    Route::post('/WhatsApp-template', [WhatsAppTemplateController::class, 'store']);
    Route::put('/WhatsApp-template', [WhatsAppTemplateController::class, 'update']);
});
// End Whatsapp Templates

