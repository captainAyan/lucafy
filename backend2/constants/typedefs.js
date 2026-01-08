/**
 * @typedef {Object} Book
 * @property {import("mongoose").ObjectId} id - MongoDB ObjectId
 * @property {import("mongoose").ObjectId} _id - MongoDB ObjectId
 * @property {string} organization - The name of the organization.
 * @property {string} address - The address of the organization.
 * @property {string} currencyCode - Currency code, must be one of CURRENCY_CODE_ENUM.
 * @property {Date} createdAt - Timestamp of when the book was created.
 * @property {Date} updatedAt - Timestamp of when the book was last updated.
 * @property {string} [role] - Role of user who's fetching the book data. Only in get-books route
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
 * @property {string} [gender] - Optional. One of `USER_GENDER`.
 * @property {Date} createdAt - Timestamp when the user was created.
 * @property {Date} updatedAt - Timestamp when the user was last updated.
 */

/**
 * @typedef {Object} BookMember
 * @property {import("mongoose").ObjectId} id - MongoDB ObjectId
 * @property {import("mongoose").ObjectId} _id - MongoDB ObjectId
 * @property {User} user - the member's user data
 * @property {Book} book - the book
 * @property {string} role - role of the member
 * @property {Date} createdAt - Timestamp when the user was created.
 * @property {Date} updatedAt - Timestamp when the user was last updated.
 */

/**
 * @typedef {Object} LedgerGroup
 * @property {import("mongoose").ObjectId} id - MongoDB ObjectId
 * @property {import("mongoose").ObjectId} _id - MongoDB ObjectId
 * @property {string} name - ledger group name
 * @property {string} description - ledger group description
 * @property {string} [nature] - one of `LEDGER_NATURE`
 * @property {LedgerGroup} [parent] - parent of this ledger group
 * @property {Book} book - the book
 * @property {Array<LedgerGroup>} [ancestors] - array of ancestors
 * @property {Date} createdAt - Timestamp when the ledger group was created.
 * @property {Date} updatedAt - Timestamp when the ledger group was last updated.
 */

/**
 * @typedef {Object} Ledger
 * @property {import("mongoose").ObjectId} id - MongoDB ObjectId
 * @property {import("mongoose").ObjectId} _id - MongoDB ObjectId
 * @property {string} name - ledger name
 * @property {string} description - ledger description
 * @property {LedgerGroup} [ledgerGroup] - ledger group of this ledger
 * @property {Book} book - the book
 * @property {Date} createdAt - Timestamp when the ledger was created.
 * @property {Date} updatedAt - Timestamp when the ledger was last updated.
 */

/**
 * @typedef {Object} Line
 * @property {import("mongoose").ObjectId} id - MongoDB ObjectId
 * @property {import("mongoose").ObjectId} _id - MongoDB ObjectId
 * @property {Entry} entry - the entry
 * @property {Ledger} Ledger - ledger of the entry line
 * @property {Book} book - the book
 * @property {string} side - one of `LEDGER_SIDES`
 * @property {number} amount - amount of that line
 * @property {Date} createdAt - Timestamp when the entry line was created.
 * @property {Date} updatedAt - Timestamp when the entry line was last updated.
 */

/**
 * @typedef {Object} Entry
 * @property {import("mongoose").ObjectId} id - MongoDB ObjectId
 * @property {import("mongoose").ObjectId} _id - MongoDB ObjectId
 * @property {string} narration - entry narration
 * @property {Date} createdAt - Timestamp when the entry was created.
 * @property {Date} updatedAt - Timestamp when the entry was last updated.
 */
export {};
