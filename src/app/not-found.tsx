export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-500">404</h1>
        <p className="mt-4 text-2xl">The page you requested was not found.</p>
        <p className="mt-2 text-lg text-gray-600">
          Sorry! The page you were looking for could not be found. This page may have been moved or deleted.
        </p>
        <a href="/" className="mt-6 inline-block rounded bg-red-500 px-6 py-3 text-lg text-white hover:bg-red-600">
          Go to Home Page
        </a>
      </div>
    </div>
  );
}
