import Role from "@entities/role";

export class RegisterDto {
  uuid?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export class LoginDto {
  email: string;
  password: string;
}

export class UpdateUserDto {
  uuid?: string;
  name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  role?: Role;
}
