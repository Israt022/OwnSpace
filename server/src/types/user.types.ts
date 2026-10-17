export interface UserResponse {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
