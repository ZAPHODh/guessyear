
export default async function GameLayout({
  children,
  lobbyModal,
}: {
  children: React.ReactNode
  lobbyModal: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <main className="flex-1">
        {children}
        {lobbyModal}
      </main>
    </div>
  )
}