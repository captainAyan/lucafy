import { ErrorMessage, Field } from "formik";

export default function Input({
  label,
  type = "text",
  name = "",
  placeholder = "",
  autofocus = false, // the html attribute is autoFocus not autofocus
  ...attr
}) {
  return (
    <fieldset {...attr}>
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
}
