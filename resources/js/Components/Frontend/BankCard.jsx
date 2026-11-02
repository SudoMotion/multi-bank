export default function BankCard({ bank }) {
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="flex min-h-[140px] items-center justify-center border-b border-neutral-100 bg-neutral-50/50 px-6 py-8">
                <img
                    src={bank.logo}
                    alt=""
                    className="max-h-16 w-full max-w-[220px] object-contain"
                />
            </div>

            <div className="flex flex-1 flex-col px-6 py-5">
                <h3 className="text-lg font-semibold text-neutral-900">{bank.name}</h3>
                <p className="mt-1 text-sm text-neutral-500">{bank.tagline}</p>

                <a
                    href={bank.sign_in_url}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-purple-dark"
                >
                    <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Sign in to online banking
                </a>
            </div>
        </article>
    );
}
