<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tracking_number'   => 'required|string',
            'receiver_name'     => 'required|string',
            'cod'               => 'required|numeric',
            'custom_fees'       => 'required|numeric',
            'client_name'       => 'required|string',
            'driver_id'         => 'required|numeric',
        ];
    }
}
