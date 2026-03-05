export type SaveGameResultItem = {
  game_id: number;
  local_score: number;
  visit_score: number;
};

export type SaveGameResultResponse = {
  success?: boolean;
  message?: string;
  items?: SaveGameResultItem[];
};

