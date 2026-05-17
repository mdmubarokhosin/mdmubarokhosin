'use client'

import { AlertCircle, Home, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6">
      <div className="max-w-md w-full text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
          style={{
            background: '#f42a4115',
            border: '1px solid #f42a4130',
          }}
        >
          <AlertCircle className="w-10 h-10 text-[#f42a41]" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-800 mb-3">
          Something Went Wrong
        </h1>

        <p className="text-sm text-slate-500 mb-2 leading-relaxed">
          An unexpected error occurred while loading this page. This might be a temporary issue.
        </p>

        {error?.message && (
          <p className="text-xs text-slate-400 mb-8 font-mono bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 max-w-full overflow-hidden text-ellipsis">
            {error.message}
          </p>
        )}

        {!error?.message && (
          <div className="mb-8" />
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              window.location.hash = 'home'
              window.location.reload()
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #006a4e, #00875a)',
              boxShadow: '0 4px 12px rgba(0,106,78,0.25)',
            }}
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>

          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
