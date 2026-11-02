<?php

namespace App\Models;

use App\Tenancy\TenantScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Tenant extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'domain',
        'tagline',
        'logo',
        'theme',
        'branding',
        'settings',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'branding' => 'array',
            'settings' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class)->withoutGlobalScope(TenantScope::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function subdomainHost(): string
    {
        return $this->slug.'.'.config('tenancy.base_domain');
    }

    public function primaryHost(): string
    {
        return $this->domain ?: $this->subdomainHost();
    }

    public function url(string $path = '/'): string
    {
        $appUrl = parse_url((string) config('app.url'));
        $scheme = $appUrl['scheme'] ?? 'http';
        $port = isset($appUrl['port']) && ! $this->domain ? ':'.$appUrl['port'] : '';

        return $scheme.'://'.$this->primaryHost().$port.'/'.ltrim($path, '/');
    }

    public function logoUrl(): ?string
    {
        return $this->logo ? Storage::url($this->logo) : null;
    }

    /**
     * @return array{primary_color: string, secondary_color: string}
     */
    public function brandingWithDefaults(): array
    {
        return array_merge(config('tenancy.default_branding'), array_filter($this->branding ?? []));
    }

    /**
     * CSS custom properties ("R G B" triplets) consumed by Tailwind's
     * tenant-* colors. Only well-formed hex values are ever emitted.
     */
    public function cssVariables(): string
    {
        $defaults = config('tenancy.default_branding');
        $branding = $this->brandingWithDefaults();
        $variables = [];

        foreach (['primary' => 'primary_color', 'secondary' => 'secondary_color'] as $name => $key) {
            $hex = preg_match('/^#[0-9A-Fa-f]{6}$/', (string) $branding[$key]) ? $branding[$key] : $defaults[$key];
            [$r, $g, $b] = sscanf($hex, '#%02x%02x%02x');
            $luminance = (0.299 * $r + 0.587 * $g + 0.114 * $b) / 255;

            $variables[] = "--tenant-{$name}: {$r} {$g} {$b};";
            $variables[] = "--tenant-on-{$name}: ".($luminance > 0.6 ? '17 24 39' : '255 255 255').';';
        }

        return implode(' ', $variables);
    }

    public function setting(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings, $key, $default);
    }

    public function storageDirectory(string $folder): string
    {
        return "tenants/{$this->getKey()}/{$folder}";
    }

    /**
     * Public-safe payload shared with the frontend.
     *
     * @return array<string, mixed>
     */
    public function toContext(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'tagline' => $this->tagline,
            'logo_url' => $this->logoUrl(),
            'theme' => $this->theme,
            'branding' => $this->brandingWithDefaults(),
            'settings' => $this->settings ?? [],
            'url' => $this->url(),
        ];
    }
}
