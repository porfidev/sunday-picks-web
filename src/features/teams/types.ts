export type CreateTeamResponse = {
  id: string;
  name: string;
  logo_uri: string;
};

export type GetTeamsResponse = CreateTeamResponse & {
  created_at: string;
  updated_at: string;
};
