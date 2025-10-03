interface FeatureFlags {
  enableVoiceChat: boolean;
  enableSpectatorMode: boolean;
  enableReplaySystem: boolean;
  enableAdvancedStats: boolean;
  enableTypingIndicator: boolean;
  enableConnectionQuality: boolean;
}

const defaultFlags: FeatureFlags = {
  enableVoiceChat: false,
  enableSpectatorMode: true,
  enableReplaySystem: false,
  enableAdvancedStats: false,
  enableTypingIndicator: true,
  enableConnectionQuality: true
};

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  // Can fetch from API, localStorage, or environment variables
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`feature_${flag}`);
    if (stored !== null) {
      return stored === 'true';
    }
  }

  return defaultFlags[flag];
}

export function useFeatureFlags(): FeatureFlags {
  return defaultFlags;
}

export function setFeatureFlag(flag: keyof FeatureFlags, enabled: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`feature_${flag}`, String(enabled));
  }
}
