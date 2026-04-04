export function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-accent/30 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-accent text-white hover:bg-blue-hover active:bg-blue-hover',
    secondary: 'bg-transparent text-blue-accent border border-blue-accent hover:bg-blue-tint',
    ghost: 'bg-transparent text-muted hover:text-text-primary hover:bg-card',
    danger: 'bg-danger text-white hover:bg-red-700',
    'ghost-danger': 'bg-transparent text-danger hover:bg-danger-tint',
    success: 'bg-success text-white hover:bg-green-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[13px] rounded gap-1.5',
    md: 'px-4 py-2 text-[14px] rounded-[6px] gap-2',
    lg: 'px-6 py-2.5 text-[15px] rounded-[6px] gap-2',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
