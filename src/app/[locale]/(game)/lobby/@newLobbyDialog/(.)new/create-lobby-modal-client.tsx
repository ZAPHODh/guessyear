'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CreateLobbyDialog } from '@/components/lobby/create-lobby-dialog';

export function CreateLobbyModalClient() {
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = pathname.includes('/new');

  return (
    <Dialog open={isOpen} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <CreateLobbyDialog />
      </DialogContent>
    </Dialog>
  );
}