import { Button } from './UI';

export default function SecondaryButton({ type = 'button', ...props }) {
    return (
        <Button
            type={type}
            variant="secondary"
            size="sm"
            className="uppercase tracking-widest"
            {...props}
        />
    );
}
