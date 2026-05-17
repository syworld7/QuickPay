import { formatPhoneInput, PHONE_COUNTRY_CODES } from '../utils/phone';
import { fieldClass, labelClass, errorTextClass, selectFieldClass } from '../utils/formStyles';

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (value: string) => void;
  countryCodeError?: string;
  phoneNumberError?: string;
}

export default function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  countryCodeError,
  phoneNumberError,
}: PhoneInputProps) {
  const hasError = Boolean(countryCodeError || phoneNumberError);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPhoneNumberChange(formatPhoneInput(e.target.value));
  };

  return (
    <div>
      <label className={labelClass}>Phone Number *</label>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          aria-label="Country code"
          className={selectFieldClass(Boolean(countryCodeError), 'w-full sm:w-36 shrink-0')}
        >
          {PHONE_COUNTRY_CODES.map((item) => (
            <option key={item.id} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="123 456 7890"
          value={phoneNumber}
          onChange={handlePhoneChange}
          maxLength={12}
          aria-label="Phone number"
          className={fieldClass(hasError, 'flex-1 min-w-0')}
        />
      </div>
      {(phoneNumberError || countryCodeError) && (
        <p className={errorTextClass}>{phoneNumberError || countryCodeError}</p>
      )}
    </div>
  );
}
