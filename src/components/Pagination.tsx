import { selectFieldClass } from '../utils/formStyles';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const goTo = (next: number) => {
    if (disabled) return;
    const clamped = Math.min(Math.max(1, next), safeTotalPages);
    if (clamped !== page) onPageChange(clamped);
  };

  const pageNumbers = getPageNumbers(page, safeTotalPages);

  return (
    <nav
      className="flex flex-col gap-4 px-4 py-3 border-t border-gray-100 bg-gray-50/80"
      aria-label="Transaction pagination"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{start}</span>–
          <span className="font-medium text-gray-900">{end}</span> of{' '}
          <span className="font-medium text-gray-900">{totalItems}</span>
        </p>

        <label className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
          <span className="whitespace-nowrap">Rows per page</span>
          <select
            value={pageSize}
            disabled={disabled}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Transactions per page"
            className={selectFieldClass(false, 'w-auto min-w-[4.5rem] py-1.5 text-sm')}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={disabled || page <= 1}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>

        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pageNumbers.map((item, index) =>
            item === '…' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                disabled={disabled}
                aria-current={item === page ? 'page' : undefined}
                className={`min-w-[2.25rem] px-2.5 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  item === page
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40'
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        <span className="sm:hidden px-2 text-sm text-gray-600">
          {page} / {safeTotalPages}
        </span>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={disabled || page >= safeTotalPages}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '…')[] = [1];

  if (current > 3) pages.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('…');

  pages.push(total);
  return pages;
}
