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
        <input
          ref={ref}
          className={`w-full py-2 text-[14px] bg-white border rounded ${error ? 'border-danger' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent transition-all duration-150 placeholder:text-muted/60 px-3 ${className} !text-black`}
          {...props}
        />
      </div>
      {error && <p className="text-[12px] text-danger">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
