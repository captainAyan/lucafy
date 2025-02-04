import { ErrorMessage, Field } from "formik";

export const Button = ({
  onClick,
  children,
  className = "",
  type = "",
  variant = "primary",
  disabled = false,
  isLoading = false, // TODO gotta implement loading view
}) => {
  const baseStyles =
    "rounded-lg h-12 w-full px-4 font-medium text-sm uppercase cursor-pointer disabled:cursor-not-allowed duration-300 focus:ring-4 ring-indigo-200 focus:outline-none";

  const variants = {
    primary:
      "bg-indigo-500 text-white hover:bg-indigo-600  disabled:bg-indigo-300",
    secondary:
      "bg-white text-indigo-500 border-1 border-indigo-500 hover:bg-indigo-600 hover:text-white disabled:bg-indigo-300",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Input = ({
  label,
  type = "text",
  name = "",
  placeholder = "",
  className = "",
  autofocus = false, // the html attribute is autoFocus not autofocus
}) => {
  return (
    <fieldset className={className}>
      <label htmlFor={name} className="inline-block text-sm px-1 py-2">
        {label}
      </label>
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className="rounded-lg h-12 w-full px-4 text-sm border border-gray-300 focus:outline-none focus:ring-4 ring-indigo-200 duration-300"
        autoFocus={autofocus} // autoFocus is the html attribute
      />

      <span className="text-sm py-2 mt-1 text-red-500">
        <ErrorMessage name={name} />
      </span>
    </fieldset>
  );
};
