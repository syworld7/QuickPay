import { fieldClass, errorTextClass } from '../utils/formStyles';

interface MaskedCvvInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hasError?: boolean;
}

export default function MaskedCvvInput({
  value,
  onChange,
  error,
  hasError,
}: MaskedCvvInputProps) {
  const showError = hasError ?? Boolean(error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange(digits);
  };

  return (
    <div>
      <input
        type="password"
        inputMode="numeric"
        autoComplete="cc-csc"
        placeholder="•••"
        value={value}
        onChange={handleChange}
        maxLength={4}
        aria-invalid={showError}
        className={fieldClass(showError)}
      />
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
}
