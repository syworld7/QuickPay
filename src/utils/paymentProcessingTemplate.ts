export const PAYMENT_LOADER_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Processing payment</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: #f8fafc;
      color: #334155;
      padding: 1.5rem;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e2e8f0;
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h1 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; text-align: center; }
    p { font-size: 0.875rem; color: #64748b; text-align: center; max-width: 20rem; }
  </style>
</head>
<body>
  <div class="spinner" aria-hidden="true"></div>
  <h1>Processing payment</h1>
  <p>Please wait while we securely verify your transaction…</p>
</body>
</html>`;
