'use client';

import { usePathname, useRouter } from 'next/navigation';
import { CreateLobbyDialog } from '@/components/lobby/create-lobby-dialog';

export function CreateLobbyModalClient() {
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = pathname.includes('/new');

  return (
    <CreateLobbyDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    />
  );
}