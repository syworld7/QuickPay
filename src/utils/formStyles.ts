export function fieldClass(hasError?: boolean, extra = '') {
  const base =
    'w-full px-4 py-3 border rounded-lg outline-none transition text-base ' +
    'focus:ring-2 focus:ring-offset-0';
  const normal =
    'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const error =
    'border-red-500 ring-2 ring-red-200 focus:ring-red-500 focus:border-red-500';
  return `${base} ${hasError ? error : normal} ${extra}`.trim();
}

export const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';
export const errorTextClass = 'text-red-600 text-sm mt-1.5';

export function selectFieldClass(hasError?: boolean, extra = '') {
  return `${fieldClass(hasError, `select-field ${extra}`)}`.trim();
}

export const modalOverlayClass =
  'fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/60 p-4';
