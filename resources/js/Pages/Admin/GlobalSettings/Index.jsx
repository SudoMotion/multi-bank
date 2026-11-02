import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import {
    Alert,
    Button,
    Card,
    Checkbox,
    ColorInput,
    Input,
    Select,
    Textarea,
} from '@/Components/UI';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

const fullWidth = 'sm:col-span-2 lg:col-span-3 xl:col-span-4';
const halfWidth = 'sm:col-span-2';

function SettingField({ group, field, value, error, onChange }) {
    const id = `${group}_${field.name}`;
    const help = field.help && !error && (
        <p className="mt-1.5 text-xs text-neutral-500">{field.help}</p>
    );

    switch (field.type) {
        case 'boolean':
            return (
                <div className={fullWidth}>
                    <Checkbox
                        id={id}
                        label={field.label}
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    {help}
                </div>
            );
        case 'textarea':
            return (
                <div className={fullWidth}>
                    <Textarea
                        id={id}
                        label={field.label}
                        required={field.required}
                        value={value ?? ''}
                        error={error}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {help}
                </div>
            );
        case 'color':
            return (
                <div>
                    <ColorInput
                        id={id}
                        label={field.label}
                        required={field.required}
                        value={value ?? ''}
                        error={error}
                        onChange={onChange}
                    />
                    {help}
                </div>
            );
        case 'select':
            return (
                <div className={halfWidth}>
                    <Select
                        id={id}
                        label={field.label}
                        required={field.required}
                        value={value ?? ''}
                        placeholder={null}
                        options={field.options ?? []}
                        error={error}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {help}
                </div>
            );
        default:
            return (
                <div className={halfWidth}>
                    <Input
                        id={id}
                        label={field.label}
                        type={field.type === 'integer' ? 'number' : field.type}
                        required={field.required}
                        value={value ?? ''}
                        error={error}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {help}
                </div>
            );
    }
}

export default function Index({ groups, values }) {
    const { flash } = usePage().props;
    const { data, setData, put, processing, errors } = useForm(values);

    const updateField = (group, name, value) => {
        setData(group, { ...data[group], [name]: value });
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.global-settings.update'), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Global Settings">
            <Head title="Global Settings" />

            <AdminPageHeader
                title="Global Settings"
                description="Platform-wide configuration. Each bank keeps its own site settings, so changes here never alter bank sites."
            />

            {flash?.success && <Alert variant="success">{flash.success}</Alert>}

            <AdminForm onSubmit={submit} className="space-y-4">
                {groups.map((group) => (
                    <Card key={group.key} title={group.label} description={group.description}>
                        <AdminFormGrid>
                            {group.fields.map((field) => (
                                <SettingField
                                    key={field.name}
                                    group={group.key}
                                    field={field}
                                    value={data[group.key]?.[field.name]}
                                    error={errors[`${group.key}.${field.name}`]}
                                    onChange={(value) => updateField(group.key, field.name, value)}
                                />
                            ))}
                        </AdminFormGrid>
                    </Card>
                ))}

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        Save Global Settings
                    </Button>
                </div>
            </AdminForm>
        </AdminLayout>
    );
}
