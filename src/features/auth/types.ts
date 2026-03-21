export type LoginResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  user: {
    email: string;
    id: number;
    is_admin: number;
    name: string;
  };
};

export type ChangePasswordResponse = {
  message: string;
};
