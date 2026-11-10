import PasswordField from '@/Components/Auth/PasswordField';
import { Alert, Button, Checkbox, Input, cn } from '@/Components/UI';
import AuthAnimatedLayout from '@/Layouts/AuthAnimatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function FadeIn({ delay = 0, className, children }) {
    return (
        <div
            className={cn('animate-login-fade-up opacity-0', className)}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

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
        <AuthAnimatedLayout subtitle="Sign in to access the admin panel securely.">
            <Head title="Admin log in" />

            <div className="w-full max-w-md">
                <FadeIn delay={0}>
                    <h2 className="text-2xl font-medium tracking-tight text-neutral-900 md:text-[1.75rem]">
                        Admin sign in
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">Enter your staff credentials to continue.</p>
                </FadeIn>

                {status && (
                    <FadeIn delay={80} className="mt-6">
                        <Alert variant="success">{status}</Alert>
                    </FadeIn>
                )}

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <FadeIn delay={120}>
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            name="email"
                            value={data.email}
                            error={errors.email}
                            autoComplete="username"
                            isFocused={true}
                            className="transition-shadow duration-200 focus:border-[#006ac3] focus:ring-[#006ac3]"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </FadeIn>

                    <FadeIn delay={200}>
                        <PasswordField
                            id="password"
                            label="Password"
                            value={data.password}
                            error={errors.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </FadeIn>

                    <FadeIn delay={280}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                label="Remember me"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <Link
                                href={route('admin.password.request')}
                                className="text-sm font-medium text-[#006ac3] transition-colors hover:text-[#005daa] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </FadeIn>

                    <FadeIn delay={360}>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 w-full border-transparent bg-[#006ac3] text-base font-medium shadow-sm transition-all duration-200 hover:bg-[#005daa] hover:shadow-md focus:ring-[#006ac3] active:scale-[0.99] disabled:hover:shadow-sm"
                        >
                            {processing ? 'Signing in…' : 'Log in'}
                        </Button>
                    </FadeIn>
                </form>
            </div>
        </AuthAnimatedLayout>
    );
}
