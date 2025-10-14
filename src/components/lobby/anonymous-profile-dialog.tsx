"use client";

import ProfileDialog from "@/components/dialog-12";
import { useScopedI18n } from '@/locales/client';

interface AnonymousProfileDialogProps {
  open: boolean;
  onSave: (profile: { name: string; avatar?: string }) => Promise<void>;
  defaultName?: string;
}

export function AnonymousProfileDialog({
  open,
  onSave,
  defaultName = 'Anonymous'
}: AnonymousProfileDialogProps) {
  const lobbyT = useScopedI18n('lobby');
  const profileT = useScopedI18n('profileDialog');

  const handleSave = async (data: { name: string }) => {
    await onSave({
      name: data.name,
    });
  };

  return (
    <ProfileDialog
      open={open}
      onOpenChange={() => { }}
      onSave={handleSave}
      defaultName={defaultName === 'Anonymous' ? '' : defaultName}
      title={lobbyT('room.setProfile')}
      showTrigger={false}
    />
  );
}