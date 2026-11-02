<?php

namespace App\Http\Requests\Admin;

use App\Models\Tenant;
use App\Tenancy\ThemeRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

abstract class TenantRequest extends FormRequest
{
    private const SLUG_PATTERN = '/^[a-z0-9]+(?:-[a-z0-9]+)*$/';

    private const HOST_PATTERN = '/^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/';

    abstract protected function tenant(): ?Tenant;

    protected function prepareForValidation(): void
    {
        $domain = Str::of((string) $this->input('domain'))
            ->trim()
            ->lower()
            ->replaceMatches('#^https?://#', '')
            ->before('/')
            ->toString();

        $this->merge([
            'slug' => Str::lower(trim((string) $this->input('slug'))),
            'domain' => $domain !== '' ? $domain : null,
            'is_active' => $this->boolean('is_active'),
            'settings' => [
                ...(array) $this->input('settings', []),
                'show_in_directory' => filter_var(
                    data_get($this->input('settings'), 'show_in_directory', true),
                    FILTER_VALIDATE_BOOLEAN,
                ),
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function tenantRules(): array
    {
        $tenantId = $this->tenant()?->getKey();
        $baseDomain = Str::lower((string) config('tenancy.base_domain'));

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:63',
                'regex:'.self::SLUG_PATTERN,
                Rule::notIn(config('tenancy.reserved_slugs')),
                Rule::unique('tenants', 'slug')->ignore($tenantId),
            ],
            'domain' => [
                'nullable',
                'string',
                'max:255',
                'regex:'.self::HOST_PATTERN,
                Rule::notIn(config('tenancy.central_domains')),
                'not_regex:/'.preg_quote('.'.$baseDomain, '/').'$/',
                Rule::unique('tenants', 'domain')->ignore($tenantId),
            ],
            'tagline' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'theme' => ['required', 'string', Rule::in(array_keys(app(ThemeRegistry::class)->all()))],
            'branding' => ['nullable', 'array'],
            'branding.primary_color' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'branding.secondary_color' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'settings' => ['nullable', 'array'],
            'settings.online_banking_url' => ['nullable', 'url', 'max:500'],
            'settings.show_in_directory' => ['boolean'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slug.regex' => 'The slug may only contain lowercase letters, numbers and single hyphens.',
            'domain.regex' => 'Enter a valid domain, for example bank.example.com.',
            'domain.not_regex' => 'Use the slug for subdomains of the base domain; custom domains must be different.',
            'branding.*.regex' => 'Use a hex color such as #4B286D.',
        ];
    }

    /**
     * Tenant attributes ready to persist (logo handled separately).
     *
     * @return array<string, mixed>
     */
    public function tenantAttributes(): array
    {
        $data = $this->safe()->only(['name', 'slug', 'domain', 'tagline', 'theme', 'is_active']);

        $data['branding'] = array_filter((array) $this->validated('branding', []));
        $data['settings'] = (array) $this->validated('settings', []);

        return $data;
    }
}
