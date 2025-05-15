import { Field } from "formik";

export default function FilterSelectInput({
  label = "",
  name = "",
  autofocus = false, // the html attribute is autoFocus not autofocus
  children,
  className = "",
  labelClassName = "",
  inputClassName = "",
  ...attr
}) {
  console.log(children);
  return (
    <fieldset className={`${className}`} {...attr}>
      <label
        htmlFor={name}
        className={`text-sm font-medium text-gray-700 ${labelClassName}`}
      >
        {label}
      </label>
      <Field
        as="select"
        name={name}
        autoFocus={autofocus}
        className={`h-full ms-2 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 ring-indigo-200 text-sm hover:cursor-pointer duration-300 ${inputClassName}`}
      >
        {children}
      </Field>
    </fieldset>
  );
}
