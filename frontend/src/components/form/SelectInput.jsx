import { ErrorMessage, Field } from "formik";

export default function SelectInput({
  label = "",
  type = "text",
  name = "",
  autofocus = false, // the html attribute is autoFocus not autofocus
  className = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
  children,
  ...attr
}) {
  return (
    <fieldset className={`${className}`} {...attr}>
      <label
        htmlFor={name}
        className={`inline-block text-sm px-1 py-2 ${labelClassName}`}
      >
        {label}
      </label>
      <Field
        type={type}
        name={name}
        as="select"
        className={`rounded-lg h-12 w-full px-4 text-sm border border-gray-300 focus:outline-none focus:ring-4 ring-indigo-200 duration-300 ${inputClassName}`}
        autoFocus={autofocus} // autoFocus is the html attribute
      >
        {children}
      </Field>

      <span className={`text-sm py-2 mt-1 text-red-500 ${errorClassName}`}>
        <ErrorMessage name={name} />
      </span>
    </fieldset>
  );
}
