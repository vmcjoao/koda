-- Expected input / output format sections on problems

alter table public.problems
  add column if not exists input_format_md text not null default '',
  add column if not exists output_format_md text not null default '';
