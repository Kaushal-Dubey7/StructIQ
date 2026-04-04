export function StatusDot({ status, className = '' }) {
  const colors = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-danger',
    planning: 'text-blue-accent',
    active: 'text-warning status-dot-active',
    completed: 'text-success',
  }

  return (
    <span className={`${colors[status] || 'text-muted'} ${className}`}>●</span>
  )
}
