import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Postzy | DM Labtech',
  description: 'Geração de criativos com IA, glassmorphism e experiência premium.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#07070b] text-white min-h-screen`}>
        {children}
        <Toaster
          richColors
          position="bottom-right"
          closeButton
          expand
          toastOptions={{
            style: {
              background: 'rgba(13, 13, 20, 0.82)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
            },
          }}
        />
      </body>
    </html>
  )
}