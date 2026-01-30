import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export interface AuthUser {
  userId: string;
  email: string;
  wezeepId: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => Promise<void>;
  register: (accessToken: string, refreshToken: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredAuth = useCallback(async () => {
    try {
      const [storedToken, storedRefresh, storedUser] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);
      if (storedToken) setToken(storedToken);
      if (storedRefresh) setRefreshTokenState(storedRefresh);
      if (storedUser) {
        try {
          setUserState(JSON.parse(storedUser));
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const login = useCallback(async (accessToken: string, refresh: string, u: AuthUser) => {
    await Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_KEY, accessToken),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(u)),
    ]);
    setToken(accessToken);
    setRefreshTokenState(refresh);
    setUserState(u);
  }, []);

  const register = useCallback(async (accessToken: string, refresh: string, u: AuthUser) => {
    await login(accessToken, refresh, u);
  }, [login]);

  const logout = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    setToken(null);
    setRefreshTokenState(null);
    setUserState(null);
  }, []);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u) AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
  }, []);

  const value: AuthContextType = {
    token,
    refreshToken,
    user,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
