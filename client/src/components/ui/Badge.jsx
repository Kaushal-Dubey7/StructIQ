export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-card text-muted border border-border',
    blue: 'bg-blue-tint text-blue-accent border border-blue-accent/20',
    red: 'bg-danger-tint text-danger border border-danger/20',
    green: 'bg-success-tint text-success border border-success/20',
    amber: 'bg-warning-tint text-warning border border-warning/20',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
