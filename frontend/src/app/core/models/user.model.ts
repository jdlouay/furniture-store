export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
} 