import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { UserProfile } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from './useAuth';
import { queryKeys } from '../utils/queryKeys';

/**
 * Local-first user profile hook.
 *
 * Read priority:
 *   1. Local AsyncStorage (`USER_PROFILE`)
 *   2. Remote API `/user-profile/me` (authenticated users only)
 *   3. Onboarding seed (`ONBOARDING_PROFILE` → copied to `USER_PROFILE` on first load)
 *
 * Write priority:
 *   1. Always persist to AsyncStorage
 *   2. If authenticated (non-guest), also push to remote API
 */
export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isGuest = !user || user.isGuest === true;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ── Load profile on mount ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Try local storage first
        let local = await storage.get<UserProfile>(storage.keys.USER_PROFILE);

        // 2. If nothing in USER_PROFILE, check ONBOARDING_PROFILE (seed)
        if (!local) {
          const onboarding = await storage.get<Record<string, unknown>>(
            storage.keys.ONBOARDING_PROFILE,
          );
          if (onboarding) {
            local = mapOnboardingToProfile(onboarding);
            // Persist the seed so future loads find it directly
            await storage.set(storage.keys.USER_PROFILE, local);
          }
        }

        // 3. For authenticated users, try remote API (may be more up-to-date)
        if (!isGuest) {
          try {
            const response = await api.get('/user-profile/me');
            const remote: UserProfile | null = response.data?.data ?? null;
            if (remote) {
              // Remote wins — persist locally for offline access
              await storage.set(storage.keys.USER_PROFILE, remote);
              local = remote;
            }
          } catch (apiErr: any) {
            // 404 = no remote profile yet, other errors = use local copy silently
            if (apiErr?.response?.status !== 404) {
              console.warn('useUserProfile: API fetch failed, using local copy', apiErr?.message);
            }
          }
        }

        if (!cancelled) setProfile(local);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [isGuest, user?.id]);

  // ── Update profile (local-first) ──────────────────────────────────────────
  const updateProfile = useCallback(
    (
      data: Partial<UserProfile>,
      callbacks?: { onSuccess?: () => void; onError?: (err: unknown) => void },
    ) => {
      const run = async () => {
        setIsUpdating(true);
        try {
          const merged: UserProfile = {
            id: profile?.id ?? (user?.id?.toString() ?? 'local'),
            birth_date: '',
            birth_time: '',
            birth_place: '',
            timezone: 'Asia/Kolkata',
            gender: 'other',
            ...profile,
            ...data,
          };

          // 1. Always persist locally
          await storage.set(storage.keys.USER_PROFILE, merged);
          setProfile(merged);

          // 2. If authenticated, also push to remote
          if (!isGuest) {
            try {
              const response = await api.put('/user-profile', data);
              const remote = response.data?.data;
              if (remote) {
                await storage.set(storage.keys.USER_PROFILE, remote);
                setProfile(remote);
              }
            } catch (apiErr) {
              console.warn('useUserProfile: API update failed, local copy saved', apiErr);
              // Local copy is already persisted — don't throw
            }
          }

          queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(user?.id?.toString()) });
          callbacks?.onSuccess?.();
        } catch (err) {
          setError(err);
          callbacks?.onError?.(err);
        } finally {
          setIsUpdating(false);
        }
      };

      run();
    },
    [profile, isGuest, user?.id, queryClient],
  );

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    isUpdating,
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Map the onboarding data shape to the UserProfile type. */
function mapOnboardingToProfile(onboarding: Record<string, unknown>): UserProfile {
  return {
    id: 'local',
    birth_date: (onboarding.birth_date as string) ?? '',
    birth_time: (onboarding.birth_time as string) ?? '',
    birth_place: (onboarding.birth_place as string) ?? '',
    timezone: (onboarding.timezone as string) ?? 'Asia/Kolkata',
    gender: (onboarding.gender as UserProfile['gender']) ?? 'other',
    latitude: (onboarding.latitude as number) ?? undefined,
    longitude: (onboarding.longitude as number) ?? undefined,
  };
}
