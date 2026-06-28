import {
    Alert,
    Button,
    Checkbox,
    FormField,
    Input,
} from '@/Components/UI';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <Alert variant="success" className="mb-4">
                    {status}
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-4">
                <FormField label="Email" htmlFor="email" error={errors.email}>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </FormField>

                <FormField label="Password" htmlFor="password" error={errors.password}>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </FormField>

                <Checkbox
                    id="remember"
                    name="remember"
                    label="Remember me"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        Log in
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
