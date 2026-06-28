<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAboutUsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('about-us.edit') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:2048'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }
}
