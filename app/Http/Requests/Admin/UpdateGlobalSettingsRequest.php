<?php

namespace App\Http\Requests\Admin;

use App\Support\GlobalSettings;
use App\Tenancy\ThemeRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateGlobalSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('global-settings.update') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $settings = app(GlobalSettings::class);
        $data = $this->all();

        foreach ($settings->booleanKeys() as $key) {
            data_set($data, $key, filter_var(data_get($data, $key, false), FILTER_VALIDATE_BOOLEAN));
        }

        foreach (['system.supported_currencies', 'system.default_currency'] as $key) {
            if (is_string(data_get($data, $key))) {
                data_set($data, $key, Str::upper(trim(data_get($data, $key))));
            }
        }

        $this->replace($data);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = app(GlobalSettings::class)->rules();
        $rules['system.default_bank_theme'][] = Rule::in(array_keys(app(ThemeRegistry::class)->all()));

        return $rules;
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $supported = GlobalSettings::parseCurrencies((string) $this->input('system.supported_currencies'));

                if (! in_array($this->input('system.default_currency'), $supported, true)) {
                    $validator->errors()->add('system.default_currency', 'The default currency must be one of the supported currencies.');
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'system.supported_currencies.regex' => 'Use comma-separated 3-letter currency codes, e.g. CAD,USD.',
            'system.*_color.regex' => 'Use a hex color such as #4B286D.',
        ];
    }
}
