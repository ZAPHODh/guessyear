"use client";

import Dialog12 from "@/components/dialog-12";
import { useScopedI18n } from '@/locales/client';

interface AnonymousProfileDialogProps {
  open: boolean;
  onSave: (profile: { name: string; avatar?: string }) => void;
  defaultName?: string;
}

export function AnonymousProfileDialog({
  open,
  onSave,
  defaultName = 'Anonymous'
}: AnonymousProfileDialogProps) {
  const t = useScopedI18n('lobby');

  const handleSave = async (data: { name: string; picture?: string }) => {
    await onSave({
      name: data.name,
      avatar: data.picture
    });
  };

  return (
    <Dialog12
      open={open}
      onOpenChange={() => { }}
      onSave={handleSave}
      defaultName={defaultName === 'Anonymous' ? '' : defaultName}
      title="Set Your Profile"
      showTrigger={false}
      hideAvatarUpload={true}
    />
  );
}