import FieldWrapper from './FieldWrapper';
import { fieldClassName } from './styles';
import { cn } from './cn';

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export default function ColorInput({
    id,
    label,
    value = '',
    error,
    required = false,
    wrapperClassName = '',
    onChange,
}) {
    const pickerValue = HEX_PATTERN.test(value) ? value : '#000000';

    return (
        <FieldWrapper
            label={label}
            id={id}
            error={error}
            required={required}
            className={wrapperClassName}
        >
            <div className="flex gap-2">
                <input
                    type="color"
                    aria-label={`${label} picker`}
                    value={pickerValue}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-neutral-300 bg-white p-1 shadow-sm"
                />
                <input
                    id={id}
                    type="text"
                    value={value}
                    maxLength={7}
                    placeholder="#000000"
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(fieldClassName, 'font-mono uppercase')}
                />
            </div>
        </FieldWrapper>
    );
}
