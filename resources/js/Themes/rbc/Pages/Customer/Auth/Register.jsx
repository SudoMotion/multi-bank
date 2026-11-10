import PasswordField from '@/Components/Auth/PasswordField';
import CustomerAuthFooter from '@/Components/Customer/CustomerAuthFooter';
import { Input } from '@/Components/UI';
import AuthAnimatedLayout from '@/Layouts/AuthAnimatedLayout';
import { CustomerAuthLink } from '@/Layouts/Customer/CustomerAuthLayout';
import { Head, useForm } from '@inertiajs/react';

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
        <AuthAnimatedLayout
            alignTop
            contentClassName="max-w-lg"
            subtitle="Create your profile to enrol in secure online banking."
            footer={<CustomerAuthFooter />}
        >
            <Head title="Enrol in Online Banking" />

            <h1 className="text-2xl font-medium tracking-tight text-neutral-900">Enrol in Online Banking</h1>
            <p className="mt-2 text-sm text-neutral-600">
                Complete the form below to create your online banking profile.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        id="first_name"
                        label="First name"
                        value={data.first_name}
                        error={errors.first_name}
                        required
                        autoComplete="given-name"
                        className="focus:border-[#006ac3] focus:ring-[#006ac3]"
                        onChange={(e) => setData('first_name', e.target.value)}
                    />
                    <Input
                        id="last_name"
                        label="Last name"
                        value={data.last_name}
                        error={errors.last_name}
                        required
                        autoComplete="family-name"
                        className="focus:border-[#006ac3] focus:ring-[#006ac3]"
                        onChange={(e) => setData('last_name', e.target.value)}
                    />
                </div>

                <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    error={errors.email}
                    required
                    autoComplete="email"
                    className="focus:border-[#006ac3] focus:ring-[#006ac3]"
                    onChange={(e) => setData('email', e.target.value)}
                />

                <PasswordField
                    id="password"
                    label="Password"
                    value={data.password}
                    error={errors.password}
                    autoComplete="new-password"
                    onChange={(e) => setData('password', e.target.value)}
                />

                <PasswordField
                    id="password_confirmation"
                    label="Confirm password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 h-12 w-full bg-[#006ac3] text-base font-medium text-white transition-colors hover:bg-[#005daa] disabled:opacity-60"
                >
                    {processing ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-600">
                Already enrolled?{' '}
                <CustomerAuthLink href={route('customer.login')}>Sign in</CustomerAuthLink>
            </p>
        </AuthAnimatedLayout>
    );
}
