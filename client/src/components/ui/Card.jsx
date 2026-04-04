export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ${hover ? 'transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-border ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      {children}
    </div>
  )
}
