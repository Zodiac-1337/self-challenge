-- ─── Challenges ───────────────────────────────────────────────────────────────
create table if not exists challenges (
  id                uuid        primary key,
  user_id           uuid        not null references auth.users(id) on delete cascade,
  title             text        not null,
  description       text        default '',
  deadline          text,
  failure_condition text        default 'Не выполнил задачу',
  reward            text        default 'Гордость за себя',
  stake             text        default '',
  difficulty        text        default 'medium',
  notes             jsonb       default '[]',
  target            jsonb,
  status            text        default 'active',
  created_at        timestamptz default now(),
  completed_at      timestamptz,
  failure_note      text,
  xp_earned         int         default 0,
  saved_hours       int         default 0,
  updated_at        timestamptz default now()
);

-- ─── User stats ───────────────────────────────────────────────────────────────
create table if not exists user_stats (
  user_id     uuid        primary key references auth.users(id) on delete cascade,
  streak      int         default 0,
  best_streak int         default 0,
  total_xp    int         default 0,
  updated_at  timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table challenges enable row level security;
alter table user_stats  enable row level security;

create policy "own challenges" on challenges for all using (auth.uid() = user_id);
create policy "own stats"      on user_stats  for all using (auth.uid() = user_id);

-- ─── Auto-update updated_at ──────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger challenges_updated_at before update on challenges for each row execute function set_updated_at();
create trigger user_stats_updated_at  before update on user_stats  for each row execute function set_updated_at();
