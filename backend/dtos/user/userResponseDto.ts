export default interface UserResponseDto {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  bio?: string;
  organization?: string;
  jobTitle?: string;
  address?: string;
  dateOfBirth: string | null;
  gender?: string;
  createdAt: string;
  updatedAt: string;
}
