export type CreateGameResponse = {
  id: string;
  game_datetime: string;
  season_id: number;
  week_id: number;
  local_team_id: number;
  visit_team_id: number;
  is_played: number;
};

export type RelatedGameEntity = {
  id: string | number;
  name: string;
};

export type GetGameResponse = CreateGameResponse & {
  local_score?: number | null;
  visit_score?: number | null;
  season_name?: string;
  week_name?: string;
  local_team_name?: string;
  visit_team_name?: string;
  local_team?: RelatedGameEntity;
  visit_team?: RelatedGameEntity;
  created_at?: string;
  updated_at?: string;
};
