<?php

namespace App\Http\Requests\Item;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
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
            'type' => 'required|in:TASK,NOTE',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required_if:type,TASK|nullable|in:TODO,IN_PROGRESS,REVIEW,DONE',
            'due_date' => 'nullable|date',
            'mentioned_users' => 'nullable|array',
            'mentioned_users.*' => 'integer|exists:users,id',
        ];
    }
}
