const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-7xl font-extrabold text-red-400">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Oops! The page you're looking for doesn't exist.
      </h2>
      <p className="text-gray-600 text-center mt-2 max-w-md">
        It seems you've hit a dead end. The page might have been removed, had
        its name changed, or is temporarily unavailable.
      </p>
      <a
        href="/"
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
