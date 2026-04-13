// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner' // <-- A Mágica dos Popups

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Postzy | DM Labtech',
  description: 'Geração de Criativos com Inteligência Artificial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#0a0a0f] text-white min-h-screen selection:bg-[#ff3d6e]/30`}>
        {children}
        
        {/* Configuração Premium do Sonner (Glassmorphism) */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(19, 19, 26, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
            className: 'shadow-2xl shadow-[#ff3d6e]/10'
          }}
        />
      </body>
    </html>
  )
}