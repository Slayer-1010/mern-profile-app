function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white 
        transition-colors hover:bg-blue-700 focus:outline-none 
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
