import type { PaymentStatus } from '../types';

type FinalStatus = Exclude<PaymentStatus, null>;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const STATUS_CONFIG: Record<
  FinalStatus,
  { title: string; defaultMessage: string; icon: string; accent: string; bg: string }
> = {
  Success: {
    title: 'Payment Successful',
    defaultMessage: 'Your payment has been processed successfully.',
    icon: '✓',
    accent: '#16a34a',
    bg: '#f0fdf4',
  },
  Failed: {
    title: 'Payment Failed',
    defaultMessage: 'Your payment could not be processed. Please try again.',
    icon: '✕',
    accent: '#dc2626',
    bg: '#fef2f2',
  },
  Pending: {
    title: 'Payment Pending',
    defaultMessage: 'Your payment is being processed. Please wait.',
    icon: '⏳',
    accent: '#ca8a04',
    bg: '#fefce8',
  },
};

export function buildPaymentStatusTemplate(status: FinalStatus, message?: string): string {
  const config = STATUS_CONFIG[status];
  const body = escapeHtml(message?.trim() || config.defaultMessage);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(config.title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: ${config.bg};
      color: #1e293b;
      padding: 2rem 1.5rem;
    }
    .card {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
      padding: 2rem;
      max-width: 22rem;
      width: 100%;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    .icon {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background: ${config.accent};
      color: #fff;
      font-size: 1.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
    }
    h1 { font-size: 1.25rem; font-weight: 700; color: ${config.accent}; margin-bottom: 0.75rem; }
    p { font-size: 0.9375rem; color: #475569; line-height: 1.5; margin-bottom: 1.5rem; }
    .hint { font-size: 0.8125rem; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon" aria-hidden="true">${config.icon}</div>
    <h1>${escapeHtml(config.title)}</h1>
    <p>${body}</p>
    <p class="hint">You may close this window when finished.</p>
  </div>
</body>
</html>`;
}
