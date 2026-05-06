CREATE TABLE IF NOT EXISTS user_progress (
  user_id text PRIMARY KEY,
  progress jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
