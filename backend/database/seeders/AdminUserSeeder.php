<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'driver']);
        $admin = User::updateOrCreate(
            ['email' => 'admin@driver.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'phone' => '1234567890',
                'password' => Hash::make('12345678'),
            ]
        );
        $admin->assignRole($adminRole);
    }
}
