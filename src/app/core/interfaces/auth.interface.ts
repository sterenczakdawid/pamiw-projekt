export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserToken {
  roles: Role[];
  sub: string;
  iat: number;
  exp: number;
}

export interface Role {
  authority: string;
}
