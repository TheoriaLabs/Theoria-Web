-- Existing version-one documents belong to physics; new finance documents declare their domain.
alter table public.open_problems
  add column domain text generated always as (coalesce(document->>'domain', 'theoretical_physics')) stored not null,
  add constraint problem_domain check (coalesce(document->>'domain', 'theoretical_physics') in ('theoretical_physics', 'quantitative_finance'));
create index open_problems_domain_idx on public.open_problems (domain, primary_area, kind, title) where published;

-- Replace the signature to avoid ambiguous default-argument overloads in PostgREST.
drop function public.search_open_problems(text,text[],text[],text,integer,integer,text[]);
create function public.search_open_problems(
  search_query text default '', area_filter text[] default '{}', kind_filter text[] default '{}',
  sort_order text default 'relevance', offset_rows integer default 0, page_size integer default 12,
  review_filter text[] default '{}', domain_filter text default 'theoretical_physics'
) returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare result jsonb;
begin
  if search_query is null or length(search_query) > 200 or sort_order not in ('relevance','title','newest','area')
    or sort_order is null or offset_rows is null or offset_rows < 0 or offset_rows > 100000
    or page_size is null or page_size < 1 or page_size > 250
    or area_filter is null or kind_filter is null or review_filter is null
    or domain_filter is null or domain_filter not in ('theoretical_physics','quantitative_finance')
    or cardinality(area_filter) > 64 or cardinality(kind_filter) > 3 or cardinality(review_filter) > 2
    or array_position(area_filter, null) is not null or array_position(kind_filter, null) is not null or array_position(review_filter, null) is not null
    or not kind_filter <@ array['conjecture','open_question','construction_problem']::text[]
    or not review_filter <@ array['editorial','imported']::text[] then
    raise exception 'Invalid catalog query';
  end if;
  with visible as materialized (
    select * from public.open_problems where published and status = 'provisionally_open' and domain = domain_filter
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
revoke all on function public.search_open_problems(text,text[],text[],text,integer,integer,text[],text) from public;
grant execute on function public.search_open_problems(text,text[],text[],text,integer,integer,text[],text) to anon, authenticated, service_role;
