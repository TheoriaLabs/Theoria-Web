export function ThetaLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <ellipse cx="20" cy="20" rx="13" ry="16" stroke="currentColor" strokeWidth="5" />
      <path d="M12 20h16" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}
