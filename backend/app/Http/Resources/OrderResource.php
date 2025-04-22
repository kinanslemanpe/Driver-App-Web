<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'driver_id'       => $this->driver_id,
            'driver_name'     => $this->driver->name,
            'client_name'     => $this->client_name,
            'receiver_name'   => $this->receiver_name,
            'tracking_number' => $this->tracking_number,
            'cod'             => $this->cod,
            'custom_fees'     => $this->custom_fees,
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
        ];    }
}
