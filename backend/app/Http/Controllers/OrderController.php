<?php
namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\User;;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request, $driverId)
    {
        $user = auth()->user();
        if ($user->hasRole('admin')) {
            $orders = Order::all();
        } else {
            $orders = Order::where('driver_id', $driverId)->get();
        }
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
        Order::truncate();
        return sendResponse("All orders deleted", 200);
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
    public function uploadOrders(Request $request, $driverId)
    {
        $driver = User::find($driverId);
        if (!$driver) {
            return sendResponse("Driver not found", 404);
        }
        $orders = $request->input('orders');
        if (empty($orders)) {
            return sendResponse("No orders provided", 400);
        }
        $createdOrders = [];
        foreach ($orders as $orderData) {
            $createdOrder = Order::create([
                'driver_id'       => $driverId,
                'tracking_number' => $orderData['tracking_number'],
                'receiver_name'   => $orderData['receiver_name'],
                'cod'             => $orderData['cod'] ?? null,
                'custom_fees'     => $orderData['custom_fees'] ?? null,
                'client_name'     => $orderData['client_name'] ?? null,
            ]);
            $createdOrders[] = $createdOrder;
        }
        return sendResponse(
            "Orders Uploaded and Assigned Successfully",
            200,
            OrderResource::collection($createdOrders)
        );
    }

}

