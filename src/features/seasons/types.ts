export type CreateSeasonResponse = {
  id: string;
  name: string;
};

export type GetSeasonResponse = CreateSeasonResponse & {
  created_at: string;
  updated_at: string;
};
