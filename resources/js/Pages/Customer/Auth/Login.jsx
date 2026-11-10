import { Alert, Button, Checkbox, Input } from '@/Components/UI';
import CustomerAuthLayout from '@/Layouts/Customer/CustomerAuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('customer.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <CustomerAuthLayout title="Sign in">
            <Head title="Sign in" />

            {status && (
                <Alert variant="success" className="mb-4">
                    {status}
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    value={data.email}
                    error={errors.email}
                    autoComplete="username"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <Input
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    value={data.password}
                    error={errors.password}
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e.target.value)}
                />

                <Checkbox
                    id="remember"
                    label="Remember me"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                />

                <Button type="submit" className="w-full" disabled={processing}>
                    Sign in
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-600">
                New to online banking?{' '}
                <Link href={route('customer.register')} className="font-medium text-tenant-primary hover:underline">
                    Create an account
                </Link>
            </p>
        </CustomerAuthLayout>
    );
}
