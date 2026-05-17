import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { PaymentStatus } from '../types';
import { useCompletePaymentRedirect } from '../hooks/useCompletePaymentRedirect';
import { modalOverlayClass } from '../utils/formStyles';
import { PAYMENT_LOADER_TEMPLATE } from '../utils/paymentProcessingTemplate';
import {
  openPaymentPopup,
  renderPaymentStatusInPopup,
} from '../utils/paymentRedirectWindow';
import { buildPaymentStatusTemplate } from '../utils/paymentStatusTemplate';

export type RedirectMode = 'popup' | 'iframe';

interface PaymentRedirectProps {
  url: string;
  mode: RedirectMode;
  onStatus: (status: PaymentStatus, message?: string) => void;
  onClose: () => void;
}

type FinalStatus = Exclude<PaymentStatus, null>;

function ProcessingSpinner({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin text-indigo-600 mx-auto ${className}`}
      viewBox="0 0 24 24"
      aria-hidden
    >
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
  );
}

function ProcessingModal({ children }: { children: ReactNode }) {
  return (
    <div className={modalOverlayClass}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in border border-gray-100">
        {children}
      </div>
    </div>
  );
}

export default function PaymentRedirect({
  url,
  mode,
  onStatus,
  onClose,
}: PaymentRedirectProps) {
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [phase, setPhase] = useState<'loading' | 'complete'>('loading');
  const [iframeDoc, setIframeDoc] = useState(PAYMENT_LOADER_TEMPLATE);
  const [result, setResult] = useState<{ status: FinalStatus; message?: string } | null>(
    null
  );
  const { result: redirectResult, error: redirectError } = useCompletePaymentRedirect(url);
  const onStatusRef = useRef(onStatus);
  const onCloseRef = useRef(onClose);
  const popupRef = useRef<Window | null>(null);
  const appliedRef = useRef(false);

  onStatusRef.current = onStatus;
  onCloseRef.current = onClose;

  const applyResult = (status: FinalStatus, message?: string) => {
    setResult({ status, message });
    setPhase('complete');

    if (mode === 'popup') {
      renderPaymentStatusInPopup(popupRef.current, status, message);
    } else {
      setIframeDoc(buildPaymentStatusTemplate(status, message));
    }

    onStatusRef.current(status, message);

    if (mode === 'popup') {
      onCloseRef.current();
    }
  };

  useEffect(() => {
    appliedRef.current = false;
    setPopupBlocked(false);
    setPhase('loading');
    setIframeDoc(PAYMENT_LOADER_TEMPLATE);
    setResult(null);

    if (mode === 'popup') {
      const popup = openPaymentPopup();
      popupRef.current = popup;
      if (!popup) {
        setPopupBlocked(true);
      }
    }
  }, [url, mode]);

  useEffect(() => {
    if (appliedRef.current) return;

    if (redirectResult) {
      appliedRef.current = true;
      applyResult(redirectResult.status, redirectResult.message);
      return;
    }

    if (redirectError) {
      appliedRef.current = true;
      applyResult('Failed', redirectError);
    }
  }, [redirectResult, redirectError]);

  if (mode === 'popup' && phase === 'complete') {
    return null;
  }

  if (mode === 'iframe') {
    const statusConfig =
      result?.status === 'Success'
        ? { title: 'Payment Successful', color: 'text-green-600' }
        : result?.status === 'Failed'
          ? { title: 'Payment Failed', color: 'text-red-600' }
          : result?.status === 'Pending'
            ? { title: 'Payment Pending', color: 'text-yellow-600' }
            : null;

    return (
      <div className={modalOverlayClass}>
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-lg w-full animate-scale-in border border-gray-100">
          <h3
            className={`text-lg font-semibold mb-1 text-center ${
              statusConfig?.color ?? 'text-gray-900'
            }`}
          >
            {phase === 'complete' && statusConfig
              ? statusConfig.title
              : 'Processing payment'}
          </h3>
          <p className="text-sm text-gray-600 mb-4 text-center">
            {phase === 'complete' && result?.message
              ? result.message
              : 'Verifying your transaction securely…'}
          </p>
          <iframe
            srcDoc={iframeDoc}
            title="Payment redirect"
            className="w-full h-56 sm:h-64 rounded-lg border border-gray-200 bg-white"
            sandbox="allow-same-origin"
          />
          {phase === 'loading' && (
            <div className="flex items-center justify-center gap-3 mt-4 text-sm text-gray-500">
              <ProcessingSpinner className="h-5 w-5" />
              <span>Confirming payment status…</span>
            </div>
          )}
          {phase === 'complete' && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Result is also shown on the main page. Close the status dialog when finished.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <ProcessingModal>
      <ProcessingSpinner />
      <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Processing payment</h3>
      {popupBlocked ? (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Popup was blocked. Your payment is still being verified on this page.
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          Please wait. Your result will appear in the popup and on this page.
        </p>
      )}
    </ProcessingModal>
  );
}
