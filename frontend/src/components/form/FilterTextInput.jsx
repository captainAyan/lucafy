import { Field } from "formik";

export default function FilterTextInput({
  // label = "",
  placeholder = "",
  type = "text",
  name = "",
  autofocus = false, // the html attribute is autoFocus not autofocus
  children,
  className = "",
  inputClassName = "",
  // labelClassName = "",
  ...attr
}) {
  return (
    <fieldset className={`${className}`} {...attr}>
      {/* <label
        htmlFor={name}
        className={`text-sm font-medium text-gray-700 ${labelClassName}`}
      >
        {label}
      </label> */}

      <div className="flex-inline h-full relative w-56 border-1 border-gray-300 rounded-lg">
        <Field
          type={type}
          name={name}
          autoFocus={autofocus}
          className={`h-full px-2 block w-full border-gray-300 rounded-lg sm:text-sm focus:outline-none focus:ring-4 ring-indigo-200 duration-300 ${inputClassName}`}
          placeholder={placeholder}
        />
        {children}
      </div>
    </fieldset>
  );
}
