'use client'

import { motion } from 'framer-motion'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient matching portfolio header */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#2d3a4a] to-[#1a2332]" />

      {/* Decorative circles */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #006a4e, transparent)' }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #f42a41, transparent)' }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-8"
            style={{
              background: 'rgba(0,106,78,0.15)',
              border: '1px solid rgba(0,106,78,0.3)',
            }}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <AlertTriangle className="w-12 h-12 text-[#006a4e]" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-8xl md:text-9xl font-extrabold text-white mb-4 leading-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #fff, #006a4e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl font-bold text-white/90 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Page Not Found
        </motion.p>

        <motion.p
          className="text-sm md:text-base text-white/60 mb-10 max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <button
            onClick={() => {
              window.location.hash = 'home'
              window.location.reload()
            }}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #006a4e, #00875a)',
              boxShadow: '0 4px 16px rgba(0,106,78,0.3)',
            }}
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          className="flex justify-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#006a4e]/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
