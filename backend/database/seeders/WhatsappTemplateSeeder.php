<?php

namespace Database\Seeders;

use App\Models\WhatsAppTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WhatsappTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WhatsAppTemplate::updateOrCreate(
            ['key' => 'order_confirmation'],
            [
                'message' => 'Hello {receiver_name}, your tracking number is {tracking_number}.',
                'active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
