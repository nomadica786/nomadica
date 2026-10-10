// utils/hooks/useAuth.ts

'use client';

import { useEffect, useState, useCallback } from 'react';

export interface AuthStatus {
  isAuthenticated: boolean;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    [key: string]: any;
  } | null;
  loading: boolean;
  error: string | null;
  token?: string | null;
}

/**
 * Synchronously checks client-side storage & cookies for an existing authentication token or session.
 * This guarantees zero false-negative delay on initial render across all pages.
 */
export function getStoredAuth(): { isAuthenticated: boolean; user: any; token: string | null } {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    const token =
      localStorage.getItem('nomadica_customer_token') ||
      localStorage.getItem('customer_access_token');
    const userRaw = localStorage.getItem('nomadica_auth_user');
    const isAuthFlag = localStorage.getItem('nomadica_is_authenticated') === 'true';

    const cookieStr = typeof document !== 'undefined' ? document.cookie : '';
    const hasAuthCookie =
      cookieStr.includes('nomadica_auth=true') ||
      cookieStr.includes('customer_access_token=') ||
      cookieStr.includes('customer_email=') ||
      cookieStr.includes('shopify_access_token=') ||
      cookieStr.includes('mock_profile=');

    let parsedUser = null;
    if (userRaw) {
      try {
        parsedUser = JSON.parse(userRaw);
      } catch {}
    }

    if (!parsedUser && cookieStr.includes('customer_email=')) {
      const match = cookieStr.match(/customer_email=([^;]+)/);
      if (match && match[1]) {
        const email = decodeURIComponent(match[1].trim());
        parsedUser = {
          email,
          firstName: email.split('@')[0],
          lastName: 'Traveler',
        };
      }
    }

    if (token || isAuthFlag || hasAuthCookie || parsedUser) {
      return {
        isAuthenticated: true,
        user: parsedUser || { email: 'customer@nomadica.com', firstName: 'Nomad', lastName: 'Traveler' },
        token: token || null,
      };
    }
  } catch (err) {
    console.error('Error reading stored auth:', err);
  }

  return { isAuthenticated: false, user: null, token: null };
}

// Module-level cached promise to prevent duplicate concurrent network requests across components
let inFlightAuthRequest: Promise<any> | null = null;

/**
 * Hook for managing authentication state with instant local token hydration
 */
export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>(() => {
    const stored = getStoredAuth();
    if (stored.isAuthenticated) {
      return {
        isAuthenticated: true,
        user: stored.user,
        loading: false,
        error: null,
        token: stored.token,
      };
    }
    return {
      isAuthenticated: false,
      user: null,
      loading: true,
      error: null,
      token: null,
    };
  });

  const checkAuth = useCallback(async () => {
    try {
      if (!inFlightAuthRequest) {
        const stored = getStoredAuth();
        const headers: Record<string, string> = {};
        if (stored.token) {
          headers['Authorization'] = `Bearer ${stored.token}`;
          headers['x-customer-token'] = stored.token;
        }

        inFlightAuthRequest = fetch('/api/auth/status', {
          headers,
          cache: 'no-store'
        })
          .then(async (res) => {
            if (res.ok) return await res.json();
            return { isAuthenticated: false, user: null };
          })
          .catch((err) => {
            console.error('Auth status check error:', err);
            // Return stored status if network fails so user is not logged out falsely
            return { isAuthenticated: stored.isAuthenticated, user: stored.user, token: stored.token };
          })
          .finally(() => {
            inFlightAuthRequest = null;
          });
      }

      const data = await inFlightAuthRequest;
      const isAuthed = !!data?.isAuthenticated;

      if (isAuthed) {
        const tokenToSave = data.token || localStorage.getItem('nomadica_customer_token');
        if (tokenToSave) {
          localStorage.setItem('nomadica_customer_token', tokenToSave);
        }
        if (data.user) {
          localStorage.setItem('nomadica_auth_user', JSON.stringify(data.user));
        }
        localStorage.setItem('nomadica_is_authenticated', 'true');
        if (typeof document !== 'undefined') {
          document.cookie = 'nomadica_auth=true; path=/; max-age=2592000; SameSite=Lax';
        }

        setStatus({
          isAuthenticated: true,
          user: data.user || status.user,
          loading: false,
          error: null,
          token: tokenToSave,
        });
      } else {
        // Only clear if no stored auth token exists
        const stored = getStoredAuth();
        if (!stored.isAuthenticated) {
          setStatus({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
            token: null,
          });
        }
      }
    } catch (error) {
      const stored = getStoredAuth();
      setStatus({
        isAuthenticated: stored.isAuthenticated,
        user: stored.user,
        loading: false,
        error: error instanceof Error ? error.message : null,
        token: stored.token,
      });
    }
  }, [status.user]);

  useEffect(() => {
    checkAuth();

    // Listen for auth state changes across components/tabs
    const handleAuthEvent = (e: any) => {
      const detail = e.detail;
      if (detail) {
        setStatus((prev) => ({
          ...prev,
          isAuthenticated: !!detail.isAuthenticated,
          user: detail.user !== undefined ? detail.user : prev.user,
          token: detail.token !== undefined ? detail.token : prev.token,
          loading: false,
        }));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-state-changed', handleAuthEvent);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-state-changed', handleAuthEvent);
      }
    };
  }, [checkAuth]);

  const login = () => {
    window.location.href = '/account/login';
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nomadica_customer_token');
        localStorage.removeItem('customer_access_token');
        localStorage.removeItem('nomadica_auth_user');
        localStorage.removeItem('nomadica_is_authenticated');
        localStorage.removeItem('nomadica_saved_address');
        document.cookie = 'nomadica_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'customer_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.dispatchEvent(
          new CustomEvent('auth-state-changed', {
            detail: { isAuthenticated: false, user: null, token: null },
          })
        );
      }
      await fetch('/api/auth/logout', { method: 'POST' });
      setStatus({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        token: null,
      });
      window.location.href = '/';
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

