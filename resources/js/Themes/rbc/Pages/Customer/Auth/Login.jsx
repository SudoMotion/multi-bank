import PasswordField from '@/Components/Auth/PasswordField';
import CustomerAuthFooter from '@/Components/Customer/CustomerAuthFooter';
import ServiceNotices from '@/Components/Customer/ServiceNotices';
import { Alert } from '@/Components/UI';
import AuthAnimatedLayout from '@/Layouts/AuthAnimatedLayout';
import { CustomerAuthLink } from '@/Layouts/Customer/CustomerAuthLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const SAVED_USERNAME_KEY = 'rbc-saved-username';

function LockIcon({ className }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-3 0H10V6a2 2 0 0 1 4 0v2Z" />
        </svg>
    );
}

function HelpIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
        </svg>
    );
}

export default function Login({ status }) {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        const saved = window.localStorage.getItem(SAVED_USERNAME_KEY);
        if (saved) {
            setData('email', saved);
            setData('remember', true);
        }
    }, [setData]);

    const goToPassword = (e) => {
        e.preventDefault();
        clearErrors();
        if (!data.email.trim()) {
            return;
        }
        if (data.remember) {
            window.localStorage.setItem(SAVED_USERNAME_KEY, data.email.trim());
        } else {
            window.localStorage.removeItem(SAVED_USERNAME_KEY);
        }
        setStep(2);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('customer.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthAnimatedLayout contentClassName="max-w-[22rem]" footer={<CustomerAuthFooter />}>
            <Head title="Sign in" />

            {status && (
                <Alert variant="success" className="mb-6">
                    {status}
                </Alert>
            )}

            {step === 1 ? (
                <form onSubmit={goToPassword}>
                    <div className="flex items-center justify-between gap-2">
                        <label htmlFor="email" className="text-[15px] text-neutral-800">
                            Client Card or Username
                        </label>
                        <LockIcon className="h-4 w-4 text-neutral-900" />
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="username"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-2 block h-11 w-full border-2 border-[#8b2942] px-3 text-base shadow-sm transition-colors focus:border-[#006ac3] focus:outline-none focus:ring-1 focus:ring-[#006ac3]"
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}

                    <div className="mt-4 flex items-center gap-2">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded border-neutral-400 text-[#006ac3] focus:ring-[#006ac3]"
                        />
                        <label htmlFor="remember" className="text-sm text-neutral-800">
                            Save client card or username
                        </label>
                        <button
                            type="button"
                            className="text-[#006ac3]"
                            aria-label="About saving your username"
                            title="Your client card or username can be saved on this device for faster sign in."
                        >
                            <HelpIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 h-12 w-full bg-[#006ac3] text-base font-medium text-white transition-colors hover:bg-[#005daa]"
                    >
                        Next
                    </button>
                </form>
            ) : (
                <form onSubmit={submit}>
                    <p className="text-sm text-neutral-600">
                        Signing in as{' '}
                        <span className="font-medium text-neutral-900">{data.email}</span>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="ml-2 text-[#006ac3] hover:underline"
                        >
                            Change
                        </button>
                    </p>

                    <div className="mt-6">
                        <PasswordField
                            id="password"
                            label="Password"
                            value={data.password}
                            error={errors.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-6 h-12 w-full bg-[#006ac3] text-base font-medium text-white transition-colors hover:bg-[#005daa] disabled:opacity-60"
                    >
                        {processing ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            )}

            <div className="mt-6 space-y-3">
                <div>
                    <a href="#" className="text-[15px] text-[#006ac3] hover:underline">
                        Recover Your Username
                    </a>
                </div>
                <div>
                    <CustomerAuthLink href={route('customer.register')}>Enrol in Online Banking</CustomerAuthLink>
                </div>
            </div>

            <ServiceNotices />
        </AuthAnimatedLayout>
    );
}
