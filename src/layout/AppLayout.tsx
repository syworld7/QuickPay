import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AppLayout() {
  const location = useLocation();

  const navLinkClass = (path: string) =>
    `px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
      location.pathname === path
        ? 'bg-indigo-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                QuickPay
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Link to="/" className={navLinkClass('/')}>
                Checkout
              </Link>
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
