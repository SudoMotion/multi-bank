import { Button, Input } from '@/Components/UI';
import CustomerAuthLayout from '@/Layouts/Customer/CustomerAuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('customer.register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <CustomerAuthLayout title="Open online access">
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        id="first_name"
                        label="First name"
                        value={data.first_name}
                        error={errors.first_name}
                        required
                        onChange={(e) => setData('first_name', e.target.value)}
                    />
                    <Input
                        id="last_name"
                        label="Last name"
                        value={data.last_name}
                        error={errors.last_name}
                        required
                        onChange={(e) => setData('last_name', e.target.value)}
                    />
                </div>

                <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    error={errors.email}
                    autoComplete="username"
                    required
                    onChange={(e) => setData('email', e.target.value)}
                />

                <Input
                    id="password"
                    label="Password"
                    type="password"
                    value={data.password}
                    error={errors.password}
                    autoComplete="new-password"
                    required
                    onChange={(e) => setData('password', e.target.value)}
                />

                <Input
                    id="password_confirmation"
                    label="Confirm password"
                    type="password"
                    value={data.password_confirmation}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                    required
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                <Button type="submit" className="w-full" disabled={processing}>
                    Create account
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-600">
                Already registered?{' '}
                <Link href={route('customer.login')} className="font-medium text-tenant-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </CustomerAuthLayout>
    );
}
