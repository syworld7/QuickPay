import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16 sm:py-24">
      <p className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        404
      </p>
      <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 text-center">
        Page not found
      </h1>
      <p className="mt-2 text-sm sm:text-base text-gray-600 text-center max-w-md">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
      >
        Go back to checkout
      </Link>
    </div>
  );
}
