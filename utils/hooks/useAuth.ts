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
 * Helper to extract non-empty cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  if (!match) return null;
  const val = decodeURIComponent(match[1]).trim();
  return val.length > 0 ? val : null;
}

/**
 * Synchronously checks client-side storage & cookies for an existing authentication token or session.
 * This guarantees zero false-negative delay on initial render across all pages, while respecting logouts.
 */
export function getStoredAuth(): { isAuthenticated: boolean; user: any; token: string | null } {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    // If user has explicitly logged out, do not restore previous session
    if (localStorage.getItem('nomadica_logged_out') === 'true') {
      return { isAuthenticated: false, user: null, token: null };
    }

    const token =
      localStorage.getItem('nomadica_customer_token') ||
      localStorage.getItem('customer_access_token');
    const userRaw = localStorage.getItem('nomadica_auth_user');
    const isAuthFlag = localStorage.getItem('nomadica_is_authenticated') === 'true';

    const authCookie = getCookie('nomadica_auth');
    const emailCookie = getCookie('customer_email');
    const tokenCookie = getCookie('customer_access_token');

    let parsedUser = null;
    if (userRaw) {
      try {
        parsedUser = JSON.parse(userRaw);
      } catch {}
    }

    if (!parsedUser && emailCookie) {
      parsedUser = {
        email: emailCookie,
        firstName: emailCookie.split('@')[0],
        lastName: 'Traveler',
      };
    }

    const hasValidToken = !!(token && token.trim().length > 0) || !!(tokenCookie && tokenCookie.trim().length > 0);
    const hasValidSession = (isAuthFlag || authCookie === 'true') && !!parsedUser;

    if (hasValidToken || hasValidSession) {
      return {
        isAuthenticated: true,
        user: parsedUser || (emailCookie ? { email: emailCookie, firstName: emailCookie.split('@')[0], lastName: 'Traveler' } : null),
        token: token || tokenCookie || null,
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
 * Hook for managing authentication state with instant local token hydration and clean logout
 */
export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
    token: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('nomadica_logged_out') === 'true') {
        setStatus({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
          token: null,
        });
        return;
      }

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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nomadica_logged_out');
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
        }

        setStatus((prev) => ({
          ...prev,
          isAuthenticated: true,
          user: data.user || prev.user,
          loading: false,
          error: null,
          token: data.token || prev.token,
        }));
      } else {
        // Server confirmed user is not authenticated - clean up all local state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nomadica_customer_token');
          localStorage.removeItem('customer_access_token');
          localStorage.removeItem('nomadica_auth_user');
          localStorage.removeItem('nomadica_is_authenticated');
          localStorage.removeItem('nomadica_saved_address');
          document.cookie = 'nomadica_auth=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'customer_email=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'customer_access_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'mock_profile=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'shopify_wishlist=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        setStatus({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
          token: null,
        });
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
  }, []);

  useEffect(() => {
    // Immediately hydrate synchronously from local storage if available
    const stored = getStoredAuth();
    if (stored.isAuthenticated) {
      setStatus({
        isAuthenticated: true,
        user: stored.user,
        loading: false,
        error: null,
        token: stored.token,
      });
    }

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
      inFlightAuthRequest = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nomadica_logged_out', 'true');
        localStorage.removeItem('nomadica_customer_token');
        localStorage.removeItem('customer_access_token');
        localStorage.removeItem('nomadica_auth_user');
        localStorage.removeItem('nomadica_is_authenticated');
        localStorage.removeItem('nomadica_saved_address');
        try {
          sessionStorage.clear();
        } catch {}

        const cookieNames = [
          'nomadica_auth',
          'customer_email',
          'customer_access_token',
          'shopify_access_token',
          'shopify_shop',
          'mock_profile',
          'mock_orders',
          'shopify_wishlist'
        ];
        cookieNames.forEach((name) => {
          document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });

        window.dispatchEvent(
          new CustomEvent('auth-state-changed', {
            detail: { isAuthenticated: false, user: null, token: null },
          })
        );
      }

      try {
        await fetch('/api/auth/logout', { 
          method: 'POST',
          cache: 'no-store'
        });
      } catch (err) {
        console.error('Server logout call failed:', err);
      }

      setStatus({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        token: null,
      });

      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/') {
          window.location.reload();
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/') {
          window.location.reload();
        } else {
          window.location.href = '/';
        }
      }
    }
  };

  return {
    ...status,
    login,
    logout,
  };
}

