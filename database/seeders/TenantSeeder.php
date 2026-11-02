<?php

namespace Database\Seeders;

use App\Models\AboutUs;
use App\Models\Setting;
use App\Models\Tenant;
use App\Models\User;
use App\Support\Permissions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Demo banks. tenant_id is set explicitly on every row because seeders may
 * run with model events disabled, which would skip BelongsToTenant stamping.
 */
class TenantSeeder extends Seeder
{
    /**
     * @return list<array<string, mixed>>
     */
    private function banks(): array
    {
        return [
            ['name' => 'Scotiabank', 'slug' => 'scotiabank', 'tagline' => "You're richer than you think.", 'logo' => 'scotiabank.svg', 'theme' => 'default', 'primary' => '#EC111A', 'secondary' => '#1F2937'],
            ['name' => 'TD Canada Trust', 'slug' => 'td', 'tagline' => 'Bank anywhere, anytime.', 'logo' => 'td.svg', 'theme' => 'default', 'primary' => '#008A00', 'secondary' => '#0B3B0B'],
            ['name' => 'BMO', 'slug' => 'bmo', 'tagline' => "We're here to help.", 'logo' => 'bmo.svg', 'theme' => 'default', 'primary' => '#0079C1', 'secondary' => '#0A2240'],
            ['name' => 'RBC Royal Bank', 'slug' => 'rbc', 'tagline' => 'Always with you.', 'logo' => 'rbc.svg', 'theme' => 'heritage', 'primary' => '#0051A5', 'secondary' => '#002144'],
            ['name' => 'CIBC', 'slug' => 'cibc', 'tagline' => 'Banking that fits your life.', 'logo' => 'cibc.svg', 'theme' => 'default', 'primary' => '#C41F3E', 'secondary' => '#3B0A14'],
            ['name' => 'Credit Union', 'slug' => 'credit-union', 'tagline' => 'Banking with a personal touch.', 'logo' => 'credit-union.svg', 'theme' => 'heritage', 'primary' => '#2E7D32', 'secondary' => '#1B3A1D'],
        ];
    }

    public function run(): void
    {
        foreach ($this->banks() as $bank) {
            $tenant = Tenant::query()->updateOrCreate(['slug' => $bank['slug']], [
                'name' => $bank['name'],
                'tagline' => $bank['tagline'],
                'theme' => $bank['theme'],
                'branding' => ['primary_color' => $bank['primary'], 'secondary_color' => $bank['secondary']],
                'settings' => ['show_in_directory' => true, 'online_banking_url' => null],
                'is_active' => true,
            ]);

            $this->seedLogo($tenant, $bank['logo']);

            $this->upsertForTenant(Setting::class, $tenant, [
                'application_name' => $tenant->name,
                'email' => "support@{$tenant->slug}.example.com",
                'phone' => '1-800-555-0100',
            ]);

            $this->upsertForTenant(AboutUs::class, $tenant, [
                'title' => "About {$tenant->name}",
                'description' => "{$tenant->name} has served Canadians for generations, offering everyday banking, borrowing and investing with the security of CDIC deposit protection.",
                'status' => 'active',
            ]);
        }

        $this->seedDemoBankAdmin();
    }

    private function seedLogo(Tenant $tenant, string $file): void
    {
        $source = public_path("images/banks/{$file}");

        if ($tenant->logo || ! File::exists($source)) {
            return;
        }

        $path = $tenant->storageDirectory('branding')."/{$file}";
        Storage::disk('public')->put($path, File::get($source));
        $tenant->update(['logo' => $path]);
    }

    /**
     * @param  class-string<Model>  $modelClass
     * @param  array<string, mixed>  $attributes
     */
    private function upsertForTenant(string $modelClass, Tenant $tenant, array $attributes): void
    {
        $model = $modelClass::acrossTenants()->where('tenant_id', $tenant->id)->first();

        if ($model) {
            return;
        }

        (new $modelClass)->forceFill(['tenant_id' => $tenant->id, ...$attributes])->save();
    }

    private function seedDemoBankAdmin(): void
    {
        $tenant = Tenant::query()->where('slug', 'scotiabank')->first();
        $email = 'admin@scotiabank.test';

        if (! $tenant || User::acrossTenants()->where('email', $email)->exists()) {
            return;
        }

        $user = new User;
        $user->forceFill([
            'tenant_id' => $tenant->id,
            'name' => 'Scotiabank Admin',
            'email' => $email,
            'password' => '123456789',
            'email_verified_at' => now(),
        ])->save();

        $user->assignRole(Permissions::BANK_ADMIN_ROLE);
    }
}
