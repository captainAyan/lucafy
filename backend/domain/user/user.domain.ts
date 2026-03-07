import type { UserGender } from "../../constants/policies.js";

export default interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  bio?: string;
  organization?: string;
  jobTitle?: string;
  address?: string;
  dateOfBirth: Date | null;
  gender?: UserGender;
  createdAt: Date;
  updatedAt: Date;
}
