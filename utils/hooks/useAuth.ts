// utils/hooks/useAuth.ts

'use client';

import { useEffect, useState } from 'react';

export interface AuthStatus {
  isAuthenticated: boolean;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing authentication state
 */
export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const data = await response.json();
          setStatus({
            isAuthenticated: true,
            user: data.user,
            loading: false,
            error: null,
          });
        } else {
          setStatus({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setStatus({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    window.location.href = '/api/auth/login';
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setStatus({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    ...status,
    login,
    logout,
  };
}
