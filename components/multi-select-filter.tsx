"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = { value: string; label: string; count?: number };
export function MultiSelectFilter({ label, accessibleLabel = label, placeholder, options, values, onChange }: {
  label: string; accessibleLabel?: string; placeholder: string; options: Option[]; values: string[]; onChange: (values: string[]) => void;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.filter(option => values.includes(option.value));
  const description = selected.length ? selected.map(option => option.label).join(", ") : placeholder;
  const close = () => { setOpen(false); trigger.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  return <div className="problem-multiselect" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }}>
    <span className="problem-filter-label">{label}</span>
    <button ref={trigger} type="button" className="problem-multiselect-trigger" aria-label={accessibleLabel}
      aria-expanded={open} aria-controls={`${id}-options`} aria-describedby={`${id}-selection`} onClick={() => setOpen(value => !value)}>
      <span>{selected.length === 0 ? placeholder : selected.length === 1 ? selected[0].label : `${selected.length} selected`}</span>
      <span aria-hidden="true">▾</span>
    </button>
    <span id={`${id}-selection`} className="problem-filter-selection">{description}</span>
    <div id={`${id}-options`} className="problem-multiselect-panel" hidden={!open} role="group" aria-label={`${accessibleLabel} options`}>
      <div className="problem-multiselect-choices">{options.map(option => <label key={option.value} className="problem-multiselect-option">
        <input type="checkbox" value={option.value} checked={values.includes(option.value)} onChange={event => onChange(event.target.checked ? [...values, option.value] : values.filter(value => value !== option.value))} />
        <span>{option.label}</span>{option.count !== undefined && <small aria-hidden="true">{option.count}</small>}
      </label>)}</div>
      <div className="problem-multiselect-actions"><button type="button" onClick={() => onChange([])}>Clear selection</button><button type="button" onClick={close}>Done</button></div>
      <p>No selection includes all.</p>
    </div>
  </div>;
}
