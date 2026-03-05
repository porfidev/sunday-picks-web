export type CreateUserResponse = {
  id: string;
  name: string;
  phone: string;
  email: string;
  is_admin: number;
};

export type GetUsersResponse = CreateUserResponse & {
  created_at: string;
  updated_at: string;
};
