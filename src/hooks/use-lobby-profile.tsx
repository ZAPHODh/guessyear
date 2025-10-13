"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { updateUserProfile } from '@/app/[locale]/actions';
import type { User } from '@/lib/types/lobby';

interface ProfileData {
  name: string;
  avatar?: string;
}

export function useLobbyProfile(initialUser: User | null) {
  const [user, setUser] = useState(initialUser);
  const [showProfileDialog, setShowProfileDialog] = useState(!initialUser || !initialUser.name);
  const [anonymousProfile, setAnonymousProfile] = useState<ProfileData>({
    name: initialUser?.name || initialUser?.email?.split('@')[0] || 'Anonymous',
    avatar: initialUser?.picture || ''
  });
  const [isProfileSet, setIsProfileSet] = useState(!!initialUser?.name);

  const handleSaveProfile = async (profile: ProfileData) => {
    try {
      if (user) {
        const result = await updateUserProfile({
          name: profile.name,
          picture: profile.avatar
        });

        if (result?.data?.success) {
          setUser({
            ...user,
            name: profile.name,
            picture: profile.avatar || null
          });

          setAnonymousProfile({
            name: profile.name,
            avatar: profile.avatar || ''
          });
          toast.success('Profile updated successfully!');
        } else {
          toast.error('Failed to update profile');
          return;
        }
      } else {
        setAnonymousProfile({
          name: profile.name,
          avatar: profile.avatar || ''
        });
      }

      setIsProfileSet(true);
      setShowProfileDialog(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  return {
    user,
    showProfileDialog,
    anonymousProfile,
    isProfileSet,
    username: anonymousProfile.name,
    avatar: anonymousProfile.avatar || anonymousProfile.name.charAt(0).toUpperCase(),
    handleSaveProfile
  };
}
