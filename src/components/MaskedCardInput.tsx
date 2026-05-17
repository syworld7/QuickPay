import { useState } from 'react';
import { formatCardInput, formatMaskedDisplay } from '../utils/maskCardNumber';
import { detectCardBrand, type CardBrand } from '../utils/cardBrand';
import { fieldClass, errorTextClass } from '../utils/formStyles';
import CardBrandIcon from './CardBrandIcon';

interface MaskedCardInputProps {
  value: string;
  onChange: (value: string) => void;
  onCardTypeChange?: (brand: CardBrand) => void;
  error?: string;
  hasError?: boolean;
}

function parseCardDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

export default function MaskedCardInput({
  value,
  onChange,
  onCardTypeChange,
  error,
  hasError,
}: MaskedCardInputProps) {
  const [focused, setFocused] = useState(false);
  const showError = hasError ?? Boolean(error);

  const storedDigits = parseCardDigits(value);
  const brand = detectCardBrand(value);

  // Blurred: masked digits only. Focused: spaced digits for editing.
  const displayValue = focused
    ? formatCardInput(value)
    : storedDigits.length >= 10
      ? formatMaskedDisplay(value)
      : formatCardInput(value);

  const handleFocus = () => setFocused(true);

  const handleBlur = () => {
    setFocused(false);
    onChange(formatCardInput(value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw.includes('*')) {
      return;
    }

    const formatted = formatCardInput(raw);
    onChange(formatted);
    onCardTypeChange?.(detectCardBrand(formatted));
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="•••• •••• •••• ••••"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={23}
          aria-invalid={showError}
          className={fieldClass(showError, 'font-mono tracking-wide pr-[4.5rem]')}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
          <CardBrandIcon brand={brand} />
        </div>
      </div>
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
}
