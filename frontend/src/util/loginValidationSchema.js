import * as Yup from "yup";
import {
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from "../constants/policy";

export default Yup.object().shape({
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
});
