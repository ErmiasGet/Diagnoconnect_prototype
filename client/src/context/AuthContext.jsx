import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'dc_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setAuthToken(parsed.accessToken);
          try {
            const me = await api.get('/auth/me');
            if (!cancelled) {
              setUser(me.data.user);
              setProfile(me.data.profile);
              setAccessToken(parsed.accessToken);
              setRefreshToken(parsed.refreshToken);
            }
          } catch {
            try {
              const { data } = await api.post('/auth/refresh', { refreshToken: parsed.refreshToken });
              setAuthToken(data.accessToken);
              const me = await api.get('/auth/me');
              if (!cancelled) {
                setUser(me.data.user);
                setProfile(me.data.profile);
                setAccessToken(data.accessToken);
                setRefreshToken(parsed.refreshToken);
                localStorage.setItem(
                  STORAGE_KEY,
                  JSON.stringify({ ...parsed, accessToken: data.accessToken })
                );
              }
            } catch {
              localStorage.removeItem(STORAGE_KEY);
              setAuthToken(null);
            }
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = (tokens, u) => {
    const payload = { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: u };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setUser(u);
    setAuthToken(tokens.accessToken);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
    const me = await api.get('/auth/me');
    setUser(me.data.user);
    setProfile(me.data.profile);
  };

  const register = async (body) => {
    const { data } = await api.post('/auth/register', body);
    persist({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
    const me = await api.get('/auth/me');
    setUser(me.data.user);
    setProfile(me.data.profile);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setProfile(null);
    setAccessToken(null);
    setRefreshToken(null);
    setAuthToken(null);
  };

  const refreshMe = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    setProfile(data.profile);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      login,
      register,
      logout,
      refreshMe,
      accessToken,
      refreshToken,
    }),
    [user, profile, loading, accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside provider');
  return ctx;
}
