import { PAYMENT_LOADER_TEMPLATE } from './paymentProcessingTemplate';
import { buildPaymentStatusTemplate } from './paymentStatusTemplate';
import type { PaymentStatus } from '../types';

const POPUP_NAME = 'quickpay_payment';
const POPUP_FEATURES =
  'popup=yes,width=520,height=640,left=100,top=80,scrollbars=yes,resizable=yes';

let activePopup: Window | null = null;

export function openPaymentPopup(): Window | null {
  const popup = window.open('about:blank', POPUP_NAME, POPUP_FEATURES);
  if (!popup) return null;

  try {
    popup.document.open();
    popup.document.write(PAYMENT_LOADER_TEMPLATE);
    popup.document.close();
    activePopup = popup;
  } catch {
    popup.close();
    return null;
  }

  return popup;
}

export function renderPaymentStatusInPopup(
  popup: Window | null,
  status: Exclude<PaymentStatus, null>,
  message?: string
): void {
  const target = popup && !popup.closed ? popup : activePopup;
  if (!target || target.closed) return;

  try {
    target.document.open();
    target.document.write(buildPaymentStatusTemplate(status, message));
    target.document.close();
  } catch {
    /* popup may be cross-origin in edge cases */
  }
}

export function closePaymentPopup(popup: Window | null = activePopup): void {
  try {
    if (popup && !popup.closed) {
      popup.close();
    }
  } catch {
    /* already closed */
  }
  if (popup === activePopup) {
    activePopup = null;
  }
}
