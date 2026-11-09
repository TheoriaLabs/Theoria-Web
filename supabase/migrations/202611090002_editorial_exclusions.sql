-- Editorial scope removals, not claims that these problems have been solved.
-- Retain the source documents privately; exclude them from public search and direct reads.
update public.open_problems set published = false
where id in (
  'pubphys-qi-quantum-thermo-clock-precision-entropy',
  'pubphys-qi-causal-order-qrf-causal-inequality-realization'
);

-- Existing database rows may still link to the old public records.
-- Preserve every other relation and its order, including links to status-review holds.
update public.open_problems p
set document = jsonb_set(p.document, '{relations}', (
  select coalesce(jsonb_agg(relation order by position), '[]'::jsonb)
  from jsonb_array_elements(p.document->'relations') with ordinality as edges(relation, position)
  where relation->>'id' not in (
    'pubphys-qi-quantum-thermo-clock-precision-entropy',
    'pubphys-qi-causal-order-qrf-causal-inequality-realization'
  )
))
where exists (
  select 1 from jsonb_array_elements(p.document->'relations') as edges(relation)
  where relation->>'id' in (
    'pubphys-qi-quantum-thermo-clock-precision-entropy',
    'pubphys-qi-causal-order-qrf-causal-inequality-realization'
  )
);
