-- Five further editorial removals approved after the initial exclusions migration.
-- Preserve source documents privately and remove only links to the retired IDs.
do $$
declare
  retired_ids constant text[] := array[
    'pubphys-grav-evaporation-backreaction-black-to-white',
    'pubphys-qi-measurement-problem-psi-epistemic-overlap',
    'pubphys-qi-causal-order-qrf-qrf-general-frames',
    'pubphys-qi-quantum-principles-higher-order-gpt',
    'pubphys-qi-quantum-principles-quantum-set-principle'
  ];
begin
  update public.open_problems set published = false where id = any(retired_ids);

  update public.open_problems p
  set document = jsonb_set(p.document, '{relations}', (
    select coalesce(jsonb_agg(relation order by position), '[]'::jsonb)
    from jsonb_array_elements(p.document->'relations') with ordinality as edges(relation, position)
    where not (coalesce(relation->>'id', '') = any(retired_ids))
  ))
  where exists (
    select 1 from jsonb_array_elements(p.document->'relations') as edges(relation)
    where relation->>'id' = any(retired_ids)
  );
end;
$$;
