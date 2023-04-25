import * as Yup from "yup";
import {
  USER_EMAIL_MAX_LENGTH,
  USER_FIRST_NAME_MAX_LENGTH,
  USER_LAST_NAME_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from "../constants/policies";

export default Yup.object().shape({
  firstName: Yup.string()
    .label("First Name")
    .min(1)
    .max(USER_FIRST_NAME_MAX_LENGTH)
    .required(),
  lastName: Yup.string()
    .label("Last Name")
    .min(1)
    .max(USER_LAST_NAME_MAX_LENGTH)
    .required(),
  email: Yup.string()
    .label("Email")
    .min(1)
    .max(USER_EMAIL_MAX_LENGTH)
    .email()
    .required(),
  password: Yup.string()
    .label("Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
  confirmPassword: Yup.string()
    .label("Confirmation Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required()
    .test(
      "confirmation-password-matching",
      "Confirmation Password not matching",
      (confirmationPassword, { parent: { password } }) =>
        password === confirmationPassword
    ),
});
