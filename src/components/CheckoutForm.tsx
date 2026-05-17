import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PaymentFormData, PaymentStatus } from '../types';
import {
  paymentFormSchema,
  CURRENCIES,
  COUNTRIES,
  MONTHS,
  generateYearOptions,
} from '../utils/validation';
import { buildFullPhone } from '../utils/phone';
import { fieldClass, labelClass, errorTextClass, selectFieldClass } from '../utils/formStyles';
import { useInitiatePayment } from '../hooks/useInitiatePayment';
import StatusModal from './StatusModal';
import PaymentRedirect, { type RedirectMode } from './PaymentRedirect';
import MaskedCardInput from './MaskedCardInput';
import MaskedCvvInput from './MaskedCvvInput';
import PhoneInput from './PhoneInput';

export default function CheckoutForm() {
  const { initiate, isLoading } = useInitiatePayment();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [redirectMode, setRedirectMode] = useState<RedirectMode>('popup');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      currency: 'USD',
      country: 'US',
      expiryMonth: '',
      expiryYear: '',
      cardNumber: '',
      cvv: '',
      phoneCountryCode: '+1',
      phoneNumber: '',
      phone: '',
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    const payload: PaymentFormData = {
      ...data,
      phone: buildFullPhone(data.phoneCountryCode, data.phoneNumber),
    };

    try {
      const response = await initiate(payload);

      if (response.redirection_url) {
        setRedirectUrl(response.redirection_url);
      } else {
        setPaymentStatus('Failed');
      }
    } catch {
      setPaymentStatus('Failed');
    }
  };

  const handleRedirectStatus = useCallback((status: PaymentStatus, message?: string) => {
    setPaymentStatus(status);
    setStatusMessage(message);
  }, []);

  const handleRedirectClose = useCallback(() => {
    setRedirectUrl(null);
  }, []);

  const inputClass = (name: keyof PaymentFormData) => fieldClass(Boolean(errors[name]));
  const selectClass = (name: keyof PaymentFormData) => selectFieldClass(Boolean(errors[name]));

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Secure Payment
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Complete your payment securely</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6" noValidate>
              <div>
                <label className={labelClass}>Card Holder Name *</label>
                <input
                  {...register('cardHolderName')}
                  type="text"
                  placeholder="John Doe"
                  aria-invalid={Boolean(errors.cardHolderName)}
                  className={inputClass('cardHolderName')}
                />
                {errors.cardHolderName && (
                  <p className={errorTextClass}>{errors.cardHolderName.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClass('email')}
                />
                {errors.email && <p className={errorTextClass}>{errors.email.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Card Number *</label>
                <Controller
                  name="cardNumber"
                  control={control}
                  render={({ field }) => (
                    <MaskedCardInput
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.cardNumber?.message}
                      hasError={Boolean(errors.cardNumber)}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Expiry Month *</label>
                  <select
                    {...register('expiryMonth')}
                    aria-invalid={Boolean(errors.expiryMonth)}
                    className={selectClass('expiryMonth')}
                  >
                    <option value="">Month</option>
                    {MONTHS.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  {errors.expiryMonth && (
                    <p className={errorTextClass}>{errors.expiryMonth.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Expiry Year *</label>
                  <select
                    {...register('expiryYear')}
                    aria-invalid={Boolean(errors.expiryYear)}
                    className={selectClass('expiryYear')}
                  >
                    <option value="">Year</option>
                    {generateYearOptions().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.expiryYear && (
                    <p className={errorTextClass}>{errors.expiryYear.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>CVV *</label>
                  <Controller
                    name="cvv"
                    control={control}
                    render={({ field }) => (
                      <MaskedCvvInput
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.cvv?.message}
                        hasError={Boolean(errors.cvv)}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Amount *</label>
                  <input
                    {...register('amount')}
                    type="text"
                    inputMode="decimal"
                    placeholder="100.00"
                    aria-invalid={Boolean(errors.amount)}
                    className={inputClass('amount')}
                  />
                  {errors.amount && <p className={errorTextClass}>{errors.amount.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Currency *</label>
                  <select
                    {...register('currency')}
                    aria-invalid={Boolean(errors.currency)}
                    className={selectClass('currency')}
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                  {errors.currency && (
                    <p className={errorTextClass}>{errors.currency.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Redirect Mode</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="redirectMode"
                      checked={redirectMode === 'popup'}
                      onChange={() => setRedirectMode('popup')}
                      className="text-indigo-600"
                    />
                    <span className="text-sm text-gray-700">Popup window</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="redirectMode"
                      checked={redirectMode === 'iframe'}
                      onChange={() => setRedirectMode('iframe')}
                      className="text-indigo-600"
                    />
                    <span className="text-sm text-gray-700">Iframe (in-page)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>Country *</label>
                <select
                  {...register('country')}
                  aria-invalid={Boolean(errors.country)}
                  className={selectClass('country')}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.country && <p className={errorTextClass}>{errors.country.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Address *</label>
                <textarea
                  {...register('address')}
                  placeholder="123 Main Street, Apt 4B"
                  rows={3}
                  aria-invalid={Boolean(errors.address)}
                  className={fieldClass(Boolean(errors.address), 'resize-none')}
                />
                {errors.address && <p className={errorTextClass}>{errors.address.message}</p>}
              </div>

              <Controller
                name="phoneCountryCode"
                control={control}
                render={({ field: codeField }) => (
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field: numField }) => (
                      <PhoneInput
                        countryCode={codeField.value}
                        phoneNumber={numField.value}
                        onCountryCodeChange={codeField.onChange}
                        onPhoneNumberChange={numField.onChange}
                        countryCodeError={errors.phoneCountryCode?.message}
                        phoneNumberError={errors.phoneNumber?.message}
                      />
                    )}
                  />
                )}
              />

              <button
                type="submit"
                disabled={isLoading || Boolean(redirectUrl)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 sm:py-4 px-6 rounded-lg font-bold text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg touch-manipulation"
              >
                {isLoading || redirectUrl ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Pay Now'
                )}
              </button>

              <p className="flex items-center justify-center text-xs sm:text-sm text-gray-500 text-center">
                <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Your payment information is encrypted and secure
              </p>
            </form>
          </div>
        </div>
      </div>

      {redirectUrl && (
        <PaymentRedirect
          url={redirectUrl}
          mode={redirectMode}
          onStatus={handleRedirectStatus}
          onClose={handleRedirectClose}
        />
      )}

      <StatusModal
        status={paymentStatus}
        message={statusMessage}
        onClose={() => {
          setPaymentStatus(null);
          setStatusMessage(undefined);
          setRedirectUrl(null);
        }}
      />
    </>
  );
}
