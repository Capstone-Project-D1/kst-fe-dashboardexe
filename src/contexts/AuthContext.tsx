import React, { createContext, useCallback, useEffect, useState } from "react";
import { apiClient } from "@/api/config";

export type Role = "super_admin" | "manajemen" | "operator";
export type KstIdentifier = "ngijo" | "cangar" | "jatikerto";

export interface User {
  userid: string;
  username: string;
  email: string;
  name: string;
  activeRole: Role;
  kstAccess: KstIdentifier[];
  permissions: string[];
  pictureUri: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (usernameOrEmail: string, password: string, activeRole?: Role) => Promise<void>;
  register: (payload: {
    username: string;
    email: string;
    password: string;
    name: string;
    requestedRole: Exclude<Role, "super_admin">;
    requestedKstIdentifier?: KstIdentifier | null;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const stored = localStorage.getItem("currentUser");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    if (!token) {
      setIsLoading(false);
      return;
    }

    apiClient
      .get<{ user: User }>("/auth/me")
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("access_token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (usernameOrEmail: string, password: string, activeRole?: Role) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        accessToken: string | null;
        requiresRoleSelection: boolean;
        availableRoles: Array<{ role: Role; kstIdentifier: KstIdentifier | null }>;
        user: User | null;
      }>("/auth/login", { usernameOrEmail, password, activeRole });

      if (response.requiresRoleSelection) {
        throw new Error(
          `Pilih role aktif: ${response.availableRoles
            .map((item) => item.role)
            .join(", ")}`,
        );
      }

      if (!response.accessToken || !response.user) {
        throw new Error("Response login tidak lengkap");
      }

      localStorage.setItem("access_token", response.accessToken);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (payload: {
      username: string;
      email: string;
      password: string;
      name: string;
      requestedRole: Exclude<Role, "super_admin">;
      requestedKstIdentifier?: KstIdentifier | null;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!payload.email || !payload.password || !payload.name || !payload.username) {
          throw new Error("Semua field harus diisi");
        }

        if (payload.password.length < 8) {
          throw new Error("Password minimal 8 karakter");
        }

        await apiClient.post("/auth/register", payload);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registrasi gagal";
        setError(message);
        throw new Error(message, { cause: err });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await apiClient.post("/auth/logout").catch(() => undefined);
    setUser(null);
    setError(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUser");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
