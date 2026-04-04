export function Skeleton({ className = '', width, height }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height: height || '16px' }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-border rounded-lg p-5 space-y-3">
      <Skeleton height="20px" width="60%" />
      <Skeleton height="14px" width="80%" />
      <Skeleton height="14px" width="40%" />
      <div className="flex gap-2 mt-4">
        <Skeleton height="32px" width="80px" />
        <Skeleton height="32px" width="80px" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 px-4 border-b border-border">
          <Skeleton height="16px" width="25%" />
          <Skeleton height="16px" width="20%" />
          <Skeleton height="16px" width="15%" />
          <Skeleton height="16px" width="10%" />
          <Skeleton height="16px" width="10%" />
        </div>
      ))}
    </div>
  )
}
