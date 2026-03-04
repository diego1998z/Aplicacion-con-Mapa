import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  getApiBaseUrl,
  getAuthToken,
  login,
  me,
  saveAuthToken,
} from "../lib/api";
import type { ReactNode } from "react";
import { AuthContext } from "./auth-context";
import type { AuthContextValue, AuthStatus } from "./auth-context";
import type { LoginPayload, SessionUser } from "../lib/api";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>(() => (getAuthToken() ? "loading" : "unauthenticated"));
  const [user, setUser] = useState<SessionUser | null>(null);

  const signOut = useCallback(() => {
    saveAuthToken("");
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refreshUser = useCallback(async () => {
    const current = await me();
    setUser(current);
    setStatus("authenticated");
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    const data = await login(payload);
    saveAuthToken(data.token);
    setUser(data.user);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    if (status !== "loading") return;

    let active = true;
    const token = getAuthToken();
    if (!token) {
      return () => {
        active = false;
      };
    }

    async function bootstrap() {
      try {
        const current = await me();
        if (!active) return;
        setUser(current);
        setStatus("authenticated");
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          signOut();
          return;
        }
        setUser(null);
        setStatus("unauthenticated");
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, [status, signOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      apiBaseUrl: getApiBaseUrl(),
      isAuthenticated: status === "authenticated" && !!user,
      signIn,
      signOut,
      refreshUser,
    }),
    [status, user, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
