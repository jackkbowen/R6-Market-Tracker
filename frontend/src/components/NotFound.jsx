const NotFound = () => {
  return (
    <div className="min-h-96 flex flex-col items-center justify-center text-GreyHair3 px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found.</p>
      <p className="text-lg mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved. Let's get you back to the main page.
      </p>
      <a
        href="https://r6-market-frontend.vercel.app/"
        className="bg-Mossy1 hover:bg-Mossy2 text-GreyHair3 font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
