import * as Yup from "yup";
import {
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from "../constants/policy";

export default Yup.object().shape({
  oldPassword: Yup.string()
    .label("Old Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
  newPassword: Yup.string()
    .label("New Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
  confirmNewPassword: Yup.string()
    .label("Confirmation New Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required()
    .test(
      "confirmation-new-password-matching",
      "Confirmation New Password not matching",
      (confirmNewPassword, { parent: { newPassword } }) =>
        newPassword === confirmNewPassword
    ),
});
