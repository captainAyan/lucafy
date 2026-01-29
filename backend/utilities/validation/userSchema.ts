import { z } from "zod";

import {
  USER_FIRST_NAME_MAX_LENGTH,
  USER_MIDDLE_NAME_MAX_LENGTH,
  USER_LAST_NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USER_BIO_MAX_LENGTH,
  ORGANIZATION_NAME_MAX_LENGTH,
  USER_JOB_TITLE_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
  UserGender,
} from "../../constants/policies.js";

export const createUserSchema = z
  .object({
    firstName: z.string().min(1).max(USER_FIRST_NAME_MAX_LENGTH),
    lastName: z.string().min(1).max(USER_LAST_NAME_MAX_LENGTH),
    email: z.email().min(1).max(EMAIL_MAX_LENGTH),
    password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
  })
  .strip();

export const userLoginSchema = z
  .object({
    email: z.email().min(1).max(EMAIL_MAX_LENGTH),
    password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
  })
  .strip();

export const editUserSchema = z
  .object({
    firstName: z.string().min(1).max(USER_FIRST_NAME_MAX_LENGTH),
    middleName: z
      .string()
      .max(USER_MIDDLE_NAME_MAX_LENGTH)
      .optional()
      .or(z.literal("")),
    lastName: z.string().min(1).max(USER_LAST_NAME_MAX_LENGTH),
    email: z.email().min(1).max(EMAIL_MAX_LENGTH),
    bio: z.string().max(USER_BIO_MAX_LENGTH).optional().or(z.literal("")),
    organization: z
      .string()
      .max(ORGANIZATION_NAME_MAX_LENGTH)
      .optional()
      .or(z.literal("")),
    jobTitle: z
      .string()
      .max(USER_JOB_TITLE_MAX_LENGTH)
      .optional()
      .or(z.literal("")),
    address: z.string().max(ADDRESS_MAX_LENGTH).optional().or(z.literal("")),
    dateOfBirth: z.date().nullable().optional(),
    gender: z.enum(UserGender).optional(),
  })
  .strip();

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().required(),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .max(PASSWORD_MAX_LENGTH)
      .required(),
  })
  .options({ stripUnknown: true });
