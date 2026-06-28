<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * @return list<string>
     */
    public static function socialMediaPlatforms(): array
    {
        return [
            'facebook',
            'instagram',
            'x',
            'linkedin',
            'youtube',
            'tiktok',
            'pinterest',
            'snapchat',
            'whatsapp',
            'telegram',
            'discord',
            'reddit',
            'threads',
            'github',
            'dribbble',
            'behance',
            'medium',
            'vimeo',
            'twitch',
            'spotify',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('settings.update') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'application_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'favicon' => ['nullable', 'file', 'mimes:ico,png,svg,jpg,jpeg,webp', 'max:512'],
            'address' => ['nullable', 'string', 'max:1000'],
            'google_map_embed_link' => ['nullable', 'string', 'max:2000'],
            'social_media' => ['nullable', 'array'],
            'social_media.*.platform' => ['nullable', 'string', Rule::in(self::socialMediaPlatforms())],
            'social_media.*.url' => ['nullable', 'url', 'max:500'],
        ];
    }
}
