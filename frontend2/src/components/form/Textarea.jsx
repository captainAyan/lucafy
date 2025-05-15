import { ErrorMessage, Field } from "formik";
export default function Textarea({
  label = "",
  name = "",
  placeholder = "",
  autofocus = false, // the html attribute is autoFocus not autofocus
  className = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
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
        as="textarea"
        type="text"
        name={name}
        placeholder={placeholder}
        className={`rounded-lg h-24 w-full p-4 text-sm border border-gray-300 focus:outline-none focus:ring-4 ring-indigo-200 duration-300 ${inputClassName}`}
        autoFocus={autofocus} // autoFocus is the html attribute
      />

      <span className={`text-sm py-2 mt-1 text-red-500 ${errorClassName}`}>
        <ErrorMessage name={name} />
      </span>
    </fieldset>
  );
}
