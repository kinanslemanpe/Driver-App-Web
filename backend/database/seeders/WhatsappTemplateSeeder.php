<?php

namespace Database\Seeders;

use App\Models\WhatsAppTemplate;
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
                'message' => <<<EOT
Dear {{receiver_name}}, 📦 Hello, it’s Express. I have a shipment ({{tracking_number}}) from {{client_name}} service for you, and it would be an honor to deliver it to you.

The COD amount is ({{cod}}MR) and you can pay by cash.

Could you please send your location or the national address short code? I will contact you before arriving at your location.

For any problem or question about the delivery or the shipment, please contact our customer service hotline 968 22711502. Thank you.
EOT,
                'active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
