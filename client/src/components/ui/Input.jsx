import { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[13px] font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 text-[14px] bg-white border rounded ${error ? 'border-danger' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all duration-150 placeholder:text-muted/60 ${Icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[12px] text-danger">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
