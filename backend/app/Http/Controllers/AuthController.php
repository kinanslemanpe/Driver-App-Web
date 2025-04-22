<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use App\Http\Requests\AuthRequest;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(AuthRequest $request)
    {
        $fields = $request->validated();
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'phone' => $fields['phone'],
            'password' => Hash::make($fields['password']),
        ]);
        $driverRole = Role::firstOrCreate(['name' => 'driver']);
        $user->assignRole($driverRole);
        $token = $user->createToken('auth-token')->plainTextToken;
        $data = ['user' => new UserResource($user), 'token' => $token];
        return sendResponse("Register Successfully", 200, $data);
    }

    public function login(AuthRequest $request)
    {
        $fields = $request->validated();
        $user = User::where('email', $fields['email'])->first();
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;
        $data = ['user' => new UserResource($user), 'token' => $token];
        return sendResponse("Login Successfully", 200, $data);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return sendResponse("Logged out", 200);
    }
}
