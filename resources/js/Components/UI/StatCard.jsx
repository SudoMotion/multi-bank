import { cn } from './cn';

export default function StatCard({ label, value, hint, className = '' }) {
    return (
        <div className={cn('rounded-lg border border-neutral-200 bg-white px-4 py-3', className)}>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
            {hint && <p className="mt-0.5 text-xs text-neutral-500">{hint}</p>}
        </div>
    );
}
