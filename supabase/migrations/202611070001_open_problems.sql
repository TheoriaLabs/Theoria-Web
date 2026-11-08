-- Public read-only catalog. The JSON document preserves statements, assumptions and provenance without loss.
create table public.open_problems (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  document jsonb not null,
  published boolean not null default false,
  title text generated always as (document->>'title') stored not null,
  primary_area text generated always as (document->>'primary_area') stored not null,
  kind text generated always as (document->>'kind') stored not null,
  status text generated always as (document->>'status') stored not null,
  compiled_on text generated always as (document->>'compiled_on') stored not null,
  search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(document->>'title', '') || ' ' || coalesce((document->'aliases')::text, '')), 'A') ||
    setweight(to_tsvector('english', coalesce((document->'tags')::text, '') || ' ' || coalesce(document->>'primary_area', '') || ' ' || coalesce((document->'secondary_areas')::text, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(document->>'statement', '') || ' ' || coalesce(document->>'physics_motivation', '') || ' ' || coalesce(document->>'resolution_target', '') || ' ' || coalesce((document->'assumptions')::text, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint problem_identity check ((document->>'id' = id and document->'schema_version' = '1'::jsonb) is true),
  constraint problem_shape check (
    jsonb_typeof(document) = 'object' and document ?& array['id','schema_version','title','statement','sources','aliases','tags','assumptions','relations']
    and length(document->>'title') > 0 and length(document->>'statement') > 0
    and jsonb_typeof(document->'sources') = 'array' and jsonb_array_length(document->'sources') > 0
    and jsonb_typeof(document->'relations') = 'array'
  ),
  constraint problem_kind check (kind in ('conjecture', 'open_question', 'construction_problem'))
);
create index open_problems_search_idx on public.open_problems using gin(search_document);
create index open_problems_filter_idx on public.open_problems (primary_area, kind, title) where published;

create function public.touch_open_problem() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger open_problems_updated before update on public.open_problems for each row execute function public.touch_open_problem();

alter table public.open_problems enable row level security;
revoke all on table public.open_problems from anon, authenticated;
grant select on table public.open_problems to anon, authenticated;
grant all on table public.open_problems to service_role;
create policy "Read published provisional problems" on public.open_problems for select to anon, authenticated
  using (published and status = 'provisionally_open');
-- No public write policies. Imports use a server-side secret/service-role key.

create function public.search_open_problems(
  search_query text default '', area_filter text[] default '{}', kind_filter text[] default '{}',
  sort_order text default 'relevance', offset_rows integer default 0, page_size integer default 12,
  review_filter text[] default '{}'
) returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare result jsonb;
begin
  if search_query is null or length(search_query) > 200 or sort_order not in ('relevance','title','newest','area')
    or sort_order is null or offset_rows is null or offset_rows < 0 or offset_rows > 100000
    or page_size is null or page_size < 1 or page_size > 250
    or area_filter is null or kind_filter is null or review_filter is null
    or cardinality(area_filter) > 64 or cardinality(kind_filter) > 3 or cardinality(review_filter) > 2
    or array_position(area_filter, null) is not null or array_position(kind_filter, null) is not null or array_position(review_filter, null) is not null
    or not kind_filter <@ array['conjecture','open_question','construction_problem']::text[]
    or not review_filter <@ array['editorial','imported']::text[] then
    raise exception 'Invalid catalog query';
  end if;
  with visible as materialized (
    select * from public.open_problems where published and status = 'provisionally_open'
  ), filtered as (
    select *, ts_rank(search_document, websearch_to_tsquery('english', search_query)) as relevance
    from visible
    where (cardinality(area_filter) = 0 or primary_area = any(area_filter) or coalesce(document->'secondary_areas', '[]'::jsonb) ?| area_filter)
      and (cardinality(kind_filter) = 0 or kind = any(kind_filter))
      and (cardinality(review_filter) = 0 or ('imported' = any(review_filter) and document->>'review_level' = 'source_import')
        or ('editorial' = any(review_filter) and document->>'review_level' <> 'source_import'))
      and (btrim(search_query) = '' or search_document @@ websearch_to_tsquery('english', search_query)
        or strpos(lower(title), lower(search_query)) > 0)
  ), ordered as (
    select document, row_number() over (order by
      case when sort_order = 'relevance' then relevance end desc nulls last,
      case when sort_order = 'newest' then compiled_on end desc nulls last,
      case when sort_order = 'area' then primary_area end asc nulls last,
      title asc, id asc) as position from filtered
  ), selected as (
    select * from ordered order by position limit page_size offset offset_rows
  )
  select jsonb_build_object(
    'items', coalesce((select jsonb_agg(document order by position) from selected), '[]'::jsonb),
    'total', (select count(*) from filtered), 'total_all', (select count(*) from visible),
    'areas', coalesce((select jsonb_agg(jsonb_build_object('value', area, 'count', n) order by area)
      from (select area, count(distinct id) as n from (
        select id, primary_area as area from visible
        union all
        select id, jsonb_array_elements_text(coalesce(document->'secondary_areas', '[]'::jsonb)) as area from visible
      ) memberships group by area) counts), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;
revoke all on function public.search_open_problems(text,text[],text[],text,integer,integer,text[]) from public;
grant execute on function public.search_open_problems(text,text[],text[],text,integer,integer,text[]) to anon, authenticated, service_role;
