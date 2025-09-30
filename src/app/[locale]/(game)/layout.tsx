
import React from 'react'

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}