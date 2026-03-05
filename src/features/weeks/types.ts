export type CreateWeekResponse = {
  id: string;
  name: string;
}

export type GetWeekResponse = CreateWeekResponse & {
  created_at: string;
  updated_at: string;
};
