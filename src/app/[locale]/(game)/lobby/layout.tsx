import React from 'react'

export default function LobbyLayout({
  children,
  newLobbyDialog,
}: {
  children: React.ReactNode;
  newLobbyDialog: React.ReactNode;
}) {
  return (
    <>
      {children}
      {newLobbyDialog}
    </>
  );
}