<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        if ($this->isMethod('post') && $this->is('api/auth/register')) {
            return [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'phone' => 'required|string|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ];
        }

        if ($this->isMethod('post') && $this->is('api/auth/login')) {
            return [
                'email' => 'required|email',
                'password' => 'required|string',
            ];
        }
        return [];
    }
}
