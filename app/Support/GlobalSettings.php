<?php

namespace App\Support;

use App\Models\GlobalSetting;
use App\Tenancy\ThemeRegistry;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Registry for platform-wide settings (central landing page + system config).
 *
 * Adding a field to schema() is enough for it to be stored, validated and
 * rendered in the Global Settings admin page. Values are read by the central
 * site and platform features only; tenant sites keep their own Setting rows.
 */
class GlobalSettings
{
    private const CACHE_KEY = 'global_settings.v1';

    /**
     * @var array<string, mixed>|null
     */
    private ?array $resolved = null;

    /**
     * @return array<string, array{label: string, description: string, fields: array<string, array<string, mixed>>}>
     */
    public function schema(): array
    {
        return [
            'landing' => [
                'label' => 'Landing Page',
                'description' => 'Content of the central platform homepage, navbar and footer. Bank sites are not affected.',
                'fields' => [
                    'brand_title' => ['label' => 'Navbar Title', 'type' => 'text', 'default' => 'Canadian Deposit Insurance Corporation', 'rules' => ['required', 'string', 'max:120']],
                    'hero_title' => ['label' => 'Hero Title', 'type' => 'text', 'default' => 'Simple and secure online banking', 'rules' => ['required', 'string', 'max:160']],
                    'hero_subtitle' => ['label' => 'Hero Subtitle', 'type' => 'textarea', 'default' => 'Choose your financial institution below and sign in to view your accounts, balances and cards — protected with the same security you trust.', 'rules' => ['nullable', 'string', 'max:500']],
                    'hero_cta' => ['label' => 'Hero Button Label', 'type' => 'text', 'default' => 'Select your bank', 'rules' => ['required', 'string', 'max:60']],
                    'directory_title' => ['label' => 'Bank Directory Title', 'type' => 'text', 'default' => 'Select your bank to sign in', 'rules' => ['required', 'string', 'max:120']],
                    'directory_subtitle' => ['label' => 'Bank Directory Subtitle', 'type' => 'text', 'default' => 'All member institutions', 'rules' => ['nullable', 'string', 'max:160']],
                    'show_calculator' => ['label' => 'Show calculator section', 'type' => 'boolean', 'default' => true, 'rules' => ['boolean']],
                    'calculator_title' => ['label' => 'Calculator Title', 'type' => 'text', 'default' => 'Deposit coverage calculator', 'rules' => ['nullable', 'string', 'max:120']],
                    'calculator_text' => ['label' => 'Calculator Text', 'type' => 'textarea', 'default' => 'Estimate how your deposits are protected across member institutions. This tool will be available here soon.', 'rules' => ['nullable', 'string', 'max:500']],
                    'footer_text' => ['label' => 'Footer Text', 'type' => 'text', 'default' => 'Deposits with member institutions are protected.', 'rules' => ['nullable', 'string', 'max:200']],
                ],
            ],
            'system' => [
                'label' => 'System',
                'description' => 'Platform-wide configuration used by the super admin tools and shared banking logic.',
                'fields' => [
                    'support_email' => ['label' => 'Platform Support Email', 'type' => 'email', 'default' => null, 'rules' => ['nullable', 'email', 'max:255']],
                    'supported_currencies' => ['label' => 'Supported Currencies', 'type' => 'text', 'default' => 'CAD,USD', 'help' => 'Comma-separated ISO codes, e.g. CAD,USD.', 'rules' => ['required', 'string', 'max:100', 'regex:/^[A-Z]{3}(\s*,\s*[A-Z]{3})*$/']],
                    'default_currency' => ['label' => 'Default Currency', 'type' => 'text', 'default' => 'CAD', 'help' => 'Must be one of the supported currencies.', 'rules' => ['required', 'string', 'size:3', 'regex:/^[A-Z]{3}$/']],
                    'max_transaction_amount' => ['label' => 'Max Single Transaction', 'type' => 'integer', 'default' => 1000000, 'help' => 'In major units (e.g. dollars). Applies to every bank.', 'rules' => ['required', 'integer', 'min:1', 'max:1000000000']],
                    'default_bank_theme' => ['label' => 'Default Theme for New Banks', 'type' => 'select', 'options' => 'themes', 'default' => ThemeRegistry::DEFAULT, 'rules' => ['required', 'string']],
                    'default_primary_color' => ['label' => 'Default Primary Color', 'type' => 'color', 'default' => '#4B286D', 'help' => 'Pre-fills the create-bank form only.', 'rules' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/']],
                    'default_secondary_color' => ['label' => 'Default Secondary Color', 'type' => 'color', 'default' => '#1F2937', 'rules' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/']],
                ],
            ],
        ];
    }

    /**
     * @return array<string, mixed> flat "group.field" => default
     */
    public function defaults(): array
    {
        $defaults = [];

        foreach ($this->schema() as $group => $definition) {
            foreach ($definition['fields'] as $field => $config) {
                $defaults["{$group}.{$field}"] = $config['default'];
            }
        }

        return $defaults;
    }

    /**
     * @return array<string, mixed> flat "group.field" => value
     */
    public function all(): array
    {
        return $this->resolved ??= array_merge(
            $this->defaults(),
            array_intersect_key(
                Cache::rememberForever(self::CACHE_KEY, fn () => GlobalSetting::query()->pluck('value', 'key')->all()),
                $this->defaults(),
            ),
        );
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->all()[$key] ?? $default;
    }

    /**
     * @return array<string, mixed> field => value for one group
     */
    public function group(string $group): array
    {
        $values = [];

        foreach ($this->all() as $key => $value) {
            if (Str::startsWith($key, "{$group}.")) {
                $values[Str::after($key, "{$group}.")] = $value;
            }
        }

        return $values;
    }

    /**
     * @param  array<string, mixed>  $values  nested ["group" => ["field" => value]] or flat dot keys
     */
    public function update(array $values): void
    {
        $flat = array_intersect_key(Arr::dot($values), $this->defaults());

        foreach ($flat as $key => $value) {
            GlobalSetting::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->flush();
    }

    public function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
        $this->resolved = null;
    }

    /**
     * @return array<string, list<mixed>> validation rules keyed "group.field"
     */
    public function rules(): array
    {
        $rules = [];

        foreach ($this->schema() as $group => $definition) {
            foreach ($definition['fields'] as $field => $config) {
                $rules["{$group}.{$field}"] = $config['rules'];
            }
        }

        return $rules;
    }

    /**
     * @return list<string> "group.field" keys of boolean fields
     */
    public function booleanKeys(): array
    {
        $keys = [];

        foreach ($this->schema() as $group => $definition) {
            foreach ($definition['fields'] as $field => $config) {
                if ($config['type'] === 'boolean') {
                    $keys[] = "{$group}.{$field}";
                }
            }
        }

        return $keys;
    }

    /**
     * @return list<string>
     */
    public function currencies(): array
    {
        return self::parseCurrencies((string) $this->get('system.supported_currencies'));
    }

    /**
     * @return list<string>
     */
    public static function parseCurrencies(string $value): array
    {
        return array_values(array_unique(array_filter(array_map(
            fn (string $code) => Str::upper(trim($code)),
            explode(',', $value),
        ))));
    }

    /**
     * Schema + current values shaped for the admin form.
     *
     * @return list<array<string, mixed>>
     */
    public function formGroups(): array
    {
        $optionSources = [
            'themes' => collect(app(ThemeRegistry::class)->all())
                ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
                ->values()
                ->all(),
        ];

        return collect($this->schema())
            ->map(fn (array $definition, string $group) => [
                'key' => $group,
                'label' => $definition['label'],
                'description' => $definition['description'],
                'fields' => collect($definition['fields'])
                    ->map(fn (array $config, string $field) => [
                        'name' => $field,
                        'label' => $config['label'],
                        'type' => $config['type'],
                        'help' => $config['help'] ?? null,
                        'required' => in_array('required', $config['rules'], true),
                        'options' => isset($config['options']) ? $optionSources[$config['options']] : null,
                    ])
                    ->values()
                    ->all(),
            ])
            ->values()
            ->all();
    }
}
