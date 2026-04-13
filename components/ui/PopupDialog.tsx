'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface PopupDialogProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
}

export function PopupDialog({
  open,
  title,
  description,
  onClose,
  children,
  footer,
}: PopupDialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-panel gradient-border relative w-full max-w-lg rounded-[28px] p-6"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="mb-5 pr-10">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              {description ? (
                <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
              ) : null}
            </div>

            {children ? <div className="mb-5">{children}</div> : null}
            {footer ? <div className="flex flex-wrap justify-end gap-3">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}