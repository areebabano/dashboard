const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      {/* Spinner */}
      <div className="relative mb-20 mr-20">
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1 left-1 w-14 h-14 border-4 border-gray-200 rounded-full"></div>
      </div>

      {/* Loading Text */}
      <p className="mt-0 text-lg font-semibold text-gray-400 animate-pulse">Please wait, loading...</p>
    </div>
  );
};

export default Loading;


