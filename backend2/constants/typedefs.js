/**
 * @typedef {Object} Book
 * @property {import("mongoose").ObjectId} id - MongoDB ObjectId
 * @property {import("mongoose").ObjectId} _id - MongoDB ObjectId
 * @property {string} organization - The name of the organization.
 * @property {string} address - The address of the organization.
 * @property {string} currencyCode - Currency code, must be one of CURRENCY_CODE_ENUM.
 * @property {Date} createdAt - Timestamp of when the book was created.
 * @property {Date} updatedAt - Timestamp of when the book was last updated.
 */

/**
 * @typedef {Object} User
 * @property {import("mongoose").ObjectId} id - MongoDB ObjectId
 * @property {import("mongoose").ObjectId} _id - MongoDB ObjectId
 * @property {string} firstName - Required. User's first name.
 * @property {string} [middleName] - Optional. User's middle name. Defaults to empty string.
 * @property {string} lastName - Required. User's last name.
 * @property {string} email - Required. Unique, lowercase email address.
 * @property {string} password - Required. Hashed password (not usually returned from DB).
 * @property {string} [bio] - Optional. Short user bio.
 * @property {string} [organization] - Optional. Organization name.
 * @property {string} [jobTitle] - Optional. Job title.
 * @property {string} [address] - Optional. Physical address.
 * @property {Date|null} [dateOfBirth] - Optional. Date of birth.
 * @property {string} [gender] - Optional. One of `USER_GENDER_ENUM`.
 * @property {Date} createdAt - Timestamp when the user was created.
 * @property {Date} updatedAt - Timestamp when the user was last updated.
 */

export {};
