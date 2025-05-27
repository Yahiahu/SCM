export interface CreateUserDto {
  username: string;
  password_hash: string;
  email: string;
  phone?: string;
  role: string;
  organization_id: number;
}
