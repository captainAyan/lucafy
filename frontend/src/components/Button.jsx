export default function Button({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  ...attr
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium text-sm uppercase cursor-pointer disabled:cursor-not-allowed duration-300 focus:ring-4 focus:outline-none";

  const variants = {
    primary:
      "bg-indigo-500 text-white ring-indigo-200 hover:bg-indigo-600  disabled:bg-indigo-300",
    secondary:
      "bg-white text-indigo-500 ring-indigo-200 border-1 border-indigo-500 ring-indigo-200 hover:bg-indigo-600 hover:text-white disabled:bg-indigo-300",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...attr}
    >
      {isLoading && (
        <svg
          className="mr-2 size-4 animate-spin text-indigo"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {children}
    </button>
  );
}
