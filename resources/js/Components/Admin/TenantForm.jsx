import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import {
    Button,
    Card,
    Checkbox,
    ColorInput,
    FileInput,
    Input,
    Select,
} from '@/Components/UI';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

function slugify(value) {
    return value
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 63);
}

export default function TenantForm({
    form,
    onSubmit,
    themes,
    baseDomain,
    logoUrl = null,
    isCreate = false,
    submitLabel = 'Save Bank',
}) {
    const { data, setData, processing, errors, progress } = form;
    const [logoPreview, setLogoPreview] = useState(logoUrl);
    const [slugTouched, setSlugTouched] = useState(!isCreate);

    const updateName = (value) => {
        setData((current) => ({
            ...current,
            name: value,
            slug: slugTouched ? current.slug : slugify(value),
        }));
    };

    const updateNested = (group, key, value) => {
        setData(group, { ...data[group], [key]: value });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const pathUrl = `/${data.slug || 'your-bank'}`;

    return (
        <AdminForm onSubmit={onSubmit} className="space-y-4">
            <Card title="Bank Details">
                <AdminFormGrid>
                    <Input
                        id="name"
                        label="Bank Name"
                        wrapperClassName="sm:col-span-2"
                        value={data.name}
                        error={errors.name}
                        required
                        onChange={(e) => updateName(e.target.value)}
                    />

                    <Input
                        id="tagline"
                        label="Tagline"
                        wrapperClassName="sm:col-span-2"
                        value={data.tagline}
                        placeholder="Banking with a personal touch."
                        error={errors.tagline}
                        onChange={(e) => setData('tagline', e.target.value)}
                    />

                    <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                        <Checkbox
                            id="is_active"
                            label="Active — the bank's site and admin panel are reachable"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        <Checkbox
                            id="show_in_directory"
                            label="List this bank on the platform homepage"
                            checked={data.settings.show_in_directory}
                            onChange={(e) =>
                                updateNested('settings', 'show_in_directory', e.target.checked)
                            }
                        />
                    </div>
                </AdminFormGrid>
            </Card>

            <Card
                title="Public URL"
                description="Each bank is served under its slug on the platform domain. A custom domain is optional."
            >
                <AdminFormGrid>
                    <div className="sm:col-span-2">
                        <Input
                            id="slug"
                            label="Slug"
                            value={data.slug}
                            error={errors.slug}
                            required
                            onChange={(e) => {
                                setSlugTouched(true);
                                setData('slug', e.target.value.toLowerCase());
                            }}
                        />
                        {!errors.slug && (
                            <p className="mt-1.5 text-xs text-neutral-500">
                                Path: <span className="font-mono">{pathUrl}</span>
                            </p>
                        )}
                    </div>

                    <Input
                        id="domain"
                        label="Custom Domain"
                        wrapperClassName="sm:col-span-2"
                        value={data.domain}
                        placeholder="online.examplebank.com"
                        error={errors.domain}
                        onChange={(e) => setData('domain', e.target.value)}
                    />
                </AdminFormGrid>
            </Card>

            <Card title="Branding & Design">
                <AdminFormGrid>
                    <FileInput
                        id="logo"
                        label="Logo"
                        wrapperClassName="sm:col-span-2"
                        accept="image/*"
                        error={errors.logo}
                        hint="PNG, JPG or SVG. Max 2MB."
                        placeholder={logoPreview ? 'Replace current logo' : 'No file chosen'}
                        onChange={handleLogoChange}
                    >
                        {logoPreview && (
                            <div className="mt-3 inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-2">
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="h-16 w-auto max-w-[200px] object-contain"
                                />
                            </div>
                        )}
                        {progress && (
                            <p className="mt-2 text-sm text-neutral-500">
                                Uploading: {progress.percentage}%
                            </p>
                        )}
                    </FileInput>

                    <div className="sm:col-span-2">
                        <Select
                            id="theme"
                            label="Design Theme"
                            value={data.theme}
                            placeholder={null}
                            options={themes}
                            error={errors.theme}
                            onChange={(e) => setData('theme', e.target.value)}
                        />
                        <p className="mt-1.5 text-xs text-neutral-500">
                            Pages, layouts and components missing from a theme fall back to the
                            default design.
                        </p>
                    </div>

                    <ColorInput
                        id="primary_color"
                        label="Primary Color"
                        value={data.branding.primary_color}
                        error={errors['branding.primary_color']}
                        onChange={(value) => updateNested('branding', 'primary_color', value)}
                    />

                    <ColorInput
                        id="secondary_color"
                        label="Secondary Color"
                        value={data.branding.secondary_color}
                        error={errors['branding.secondary_color']}
                        onChange={(value) => updateNested('branding', 'secondary_color', value)}
                    />

                    <div className="flex items-end sm:col-span-2">
                        <div className="flex h-10 w-full overflow-hidden rounded-md border border-neutral-200 text-xs font-medium">
                            <div
                                className="flex flex-1 items-center justify-center text-white"
                                style={{ backgroundColor: data.branding.primary_color }}
                            >
                                Primary
                            </div>
                            <div
                                className="flex flex-1 items-center justify-center text-white"
                                style={{ backgroundColor: data.branding.secondary_color }}
                            >
                                Secondary
                            </div>
                        </div>
                    </div>
                </AdminFormGrid>
            </Card>

            <Card title="Online Banking">
                <AdminFormGrid>
                    <Input
                        id="online_banking_url"
                        label="Online Banking Sign-in URL"
                        wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                        value={data.settings.online_banking_url ?? ''}
                        placeholder="https://secure.examplebank.com/login"
                        error={errors['settings.online_banking_url']}
                        onChange={(e) =>
                            updateNested('settings', 'online_banking_url', e.target.value)
                        }
                    />
                </AdminFormGrid>
            </Card>

            {isCreate && (
                <Card
                    title="Bank Administrator"
                    description="Optional. Creates a user who signs in on the bank's own domain with the bank-admin role."
                >
                    <AdminFormGrid>
                        <Input
                            id="admin_name"
                            label="Name"
                            value={data.admin.name}
                            error={errors['admin.name']}
                            onChange={(e) => updateNested('admin', 'name', e.target.value)}
                        />
                        <Input
                            id="admin_email"
                            label="Email"
                            type="email"
                            value={data.admin.email}
                            error={errors['admin.email']}
                            onChange={(e) => updateNested('admin', 'email', e.target.value)}
                        />
                        <Input
                            id="admin_password"
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            value={data.admin.password}
                            error={errors['admin.password']}
                            onChange={(e) => updateNested('admin', 'password', e.target.value)}
                        />
                    </AdminFormGrid>
                </Card>
            )}

            <div className="flex justify-end gap-3">
                <Link href={route('admin.tenants.index')}>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </div>
        </AdminForm>
    );
}
