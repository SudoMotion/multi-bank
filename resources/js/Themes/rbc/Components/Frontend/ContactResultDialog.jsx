import { Button } from '@/Components/UI';
import { cn } from '@/Components/UI/cn';
import { createPortal } from 'react-dom';

function SuccessIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ErrorIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
    );
}

export default function ContactResultDialog({ open, type, message, onClose }) {
    if (! open || ! type) {
        return null;
    }

    const isSuccess = type === 'success';

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-result-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-neutral-900/45"
                aria-label="Close dialog"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md border border-neutral-200 bg-white shadow-xl">
                <div className={cn('px-6 py-4', isSuccess ? 'bg-[#006ac3]' : 'bg-red-600')}>
                    <div className="flex items-center gap-3 text-white">
                        {isSuccess ? (
                            <SuccessIcon className="h-8 w-8 shrink-0" />
                        ) : (
                            <ErrorIcon className="h-8 w-8 shrink-0" />
                        )}
                        <h2 id="contact-result-title" className="text-lg font-semibold">
                            {isSuccess ? 'Request submitted' : 'Submission failed'}
                        </h2>
                    </div>
                </div>

                <div className="px-6 py-5">
                    <p className="text-sm leading-relaxed text-neutral-700">{message}</p>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="button"
                            className={cn(
                                'min-w-[7rem]',
                                isSuccess && 'border-[#006ac3] bg-[#006ac3] hover:bg-[#005daa]',
                            )}
                            variant={isSuccess ? 'primary' : 'secondary'}
                            onClick={onClose}
                        >
                            OK
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
