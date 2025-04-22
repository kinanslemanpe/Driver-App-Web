<?php

namespace App\Http\Controllers;

use App\Http\Requests\DriverRequest;
use App\Http\Resources\UserLookupResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function lookup(Request $request)
    {
        $users = User::select('id', 'name', 'email')->get();
        $data = UserLookupResource::collection($users);
        return sendResponse("Lookup Returned Successfully", 200, $data);
    }
    public function listDrivers(Request $request)
    {
        $query = User::role('driver');
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }
        $drivers = $query->select('id', 'name', 'email', 'phone')->get();
        return sendResponse("Drivers Fetched Successfully", 200, $drivers);
    }

    public function createDriver(DriverRequest $request)
    {
        $validated = $request->validated();
        $driver = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);
        $driver->assignRole('driver');
        return sendResponse("Driver Created Successfully", 200, $driver);
    }
}
