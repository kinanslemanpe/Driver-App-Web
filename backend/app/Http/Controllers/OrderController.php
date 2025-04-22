<?php
namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\User;

class OrderController extends Controller
{
    public function index($driverId)
    {
        $orders = Order::where('driver_id', $driverId)->get();
        return sendResponse("Orders Returned Successfully", 200, OrderResource::collection($orders));
    }

    public function store(OrderRequest $request, $driverId)
    {
        $driver = User::find($driverId);
        if (!$driver) {
            return sendResponse("Driver not found", 404);
        }
        $validated = $request->validated();
        $order = Order::create([
            'driver_id'       => $driverId,
            'tracking_number' => $validated['tracking_number'],
            'receiver_name'   => $validated['receiver_name'],
            'cod'             => $validated['cod'],
            'custom_fees'     => $validated['custom_fees'],
            'client_name'     => $validated['client_name'],
        ]);
        return sendResponse("Order Created Successfully", 200, new OrderResource($order));
    }

    public function update(OrderRequest $request, $driverId, $orderId)
    {
        $validated = $request->validated();
        $order = Order::find($orderId);
        if (!$order) {
            return sendResponse("Order not found", 404);
        }
        $order->update($validated);
        return sendResponse("Order Updated Successfully", 200, new OrderResource($order));
    }

    public function destroy($driverId)
    {
        $orders = Order::where('driver_id', $driverId)->get();
        if ($orders->isEmpty()) {
            return sendResponse("No orders found for this driver", 404);
        }
        Order::where('driver_id', $driverId)->delete();
        return sendResponse("All orders deleted", 200, OrderResource::collection($orders));
    }

    public function delete($driverId, $orderId)
    {
        $order = Order::find($orderId);
        if (!$order) {
            return sendResponse("Order not found", 404);
        }
        $order->delete();
        return sendResponse("Order Deleted Successfully", 200, new OrderResource($order));
    }
}

