export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full px-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-3 w-32 rounded-lg bg-slate-200/70 animate-pulse" />
          </div>
        </div>

        {/* Card skeleton */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          {/* Title bar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-4 w-36 rounded-lg bg-slate-200 animate-pulse" />
          </div>

          {/* Skeleton lines */}
          <div className="space-y-2.5 pt-2">
            <div className="h-3 w-full rounded bg-slate-200/60 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-slate-200/60 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="h-3 w-4/6 rounded bg-slate-200/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>

          {/* Skeleton cards row */}
          <div className="grid grid-cols-3 gap-3 pt-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-slate-200/50 animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          {/* More skeleton lines */}
          <div className="space-y-2.5 pt-3">
            <div className="h-3 w-full rounded bg-slate-200/60 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="h-3 w-3/4 rounded bg-slate-200/60 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#006a4e] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium ml-2">Loading...</span>
        </div>
      </div>
    </div>
  )
}
