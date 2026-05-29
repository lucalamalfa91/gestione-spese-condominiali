-- Installments per due, signed payments, carry-forward metadata

alter table dues
  add column if not exists split_mode text not null default 'monthly'
    check (split_mode in ('monthly', 'bimonthly', 'semiannual', 'custom'));

alter table dues
  add column if not exists split_custom jsonb;

alter table payments
  add column if not exists installment_key text;

alter table payments
  add column if not exists carry_from_period_id bigint references fiscal_periods on delete set null;

alter table payments
  add column if not exists is_carry_forward boolean not null default false;

create index if not exists idx_payments_installment_key on payments(house_id, installment_key)
  where installment_key is not null;
