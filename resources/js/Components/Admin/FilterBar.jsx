import { Button, Input, Select } from '@/Components/UI';
import { router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Query-string filters for paginated index pages.
 * fields: [{ name, label, type: 'search' | 'select' | 'date', options?, placeholder? }]
 */
export default function FilterBar({ url, filters, fields }) {
    const [values, setValues] = useState(filters);

    const apply = (next) => {
        const query = Object.fromEntries(Object.entries(next).filter(([, value]) => value !== ''));
        router.get(url, query, { preserveState: true, preserveScroll: true, replace: true });
    };

    const submit = (e) => {
        e.preventDefault();
        apply(values);
    };

    const reset = () => {
        const cleared = Object.fromEntries(Object.keys(values).map((key) => [key, '']));
        setValues(cleared);
        apply(cleared);
    };

    const isFiltered = Object.values(filters).some((value) => value !== '');

    return (
        <form
            onSubmit={submit}
            className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:flex-wrap sm:items-end"
        >
            {fields.map((field) =>
                field.type === 'select' ? (
                    <Select
                        key={field.name}
                        id={`filter_${field.name}`}
                        label={field.label}
                        wrapperClassName="sm:w-44"
                        value={values[field.name]}
                        placeholder={null}
                        options={[{ value: '', label: field.placeholder ?? 'All' }, ...field.options]}
                        onChange={(e) => {
                            const next = { ...values, [field.name]: e.target.value };
                            setValues(next);
                            apply(next);
                        }}
                    />
                ) : (
                    <Input
                        key={field.name}
                        id={`filter_${field.name}`}
                        label={field.label}
                        type={field.type === 'date' ? 'date' : 'search'}
                        wrapperClassName={field.type === 'date' ? 'sm:w-44' : 'sm:w-72'}
                        value={values[field.name]}
                        placeholder={field.placeholder}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                    />
                ),
            )}

            <div className="flex gap-2">
                <Button type="submit" variant="secondary">
                    Filter
                </Button>
                {isFiltered && (
                    <Button type="button" variant="ghost" onClick={reset}>
                        Reset
                    </Button>
                )}
            </div>
        </form>
    );
}
