<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSpaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Add policy check later if needed
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_private' => ['boolean'],
        ];
    }
}
