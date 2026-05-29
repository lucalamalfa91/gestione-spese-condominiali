-- Preventivo / consuntivo per dovuto; riporto eccedenze su preventivo esercizio successivo

alter table dues
  add column if not exists due_kind text not null default 'preventivo'
    check (due_kind in ('preventivo', 'consuntivo'));

alter table dues
  add column if not exists carry_from_period_id bigint references fiscal_periods on delete set null;
