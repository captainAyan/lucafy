import * as Yup from "yup";
import {
  USER_FIRST_NAME_MAX_LENGTH,
  USER_LAST_NAME_MAX_LENGTH,
  USER_MIDDLE_NAME_MAX_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_BIO_MAX_LENGTH,
  USER_ORGANIZATION_MAX_LENGTH,
  USER_JOB_TITLE_MAX_LENGTH,
  USER_LOCATION_MAX_LENGTH,
} from "../constants/policies";

export const RegisterSchema = Yup.object().shape({
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

export const LoginSchema = Yup.object().shape({
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

export const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .label("First Name")
    .min(1)
    .max(USER_FIRST_NAME_MAX_LENGTH)
    .required("First Name is required"),

  middleName: Yup.string()
    .label("Middle Name")
    .max(USER_MIDDLE_NAME_MAX_LENGTH)
    .optional()
    .default(""),

  lastName: Yup.string()
    .label("Last Name")
    .min(1)
    .max(USER_LAST_NAME_MAX_LENGTH)
    .required("Last Name is required"),

  email: Yup.string()
    .label("Email")
    .min(1)
    .max(USER_EMAIL_MAX_LENGTH)
    .email("Enter a valid email")
    .required("Email is required"),

  bio: Yup.string()
    .label("Bio")
    .max(USER_BIO_MAX_LENGTH)
    .optional()
    .default(""),

  organization: Yup.string()
    .label("Organization")
    .max(USER_ORGANIZATION_MAX_LENGTH)
    .optional()
    .default(""),

  jobTitle: Yup.string()
    .label("Job Title")
    .max(USER_JOB_TITLE_MAX_LENGTH)
    .optional()
    .default(""),

  location: Yup.string()
    .label("Location")
    .max(USER_LOCATION_MAX_LENGTH)
    .optional()
    .default(""),
});

export const ChangePasswordSchema = Yup.object().shape({
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
