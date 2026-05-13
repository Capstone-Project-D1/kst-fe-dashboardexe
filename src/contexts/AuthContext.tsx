import React, { createContext, useState, useCallback } from "react";
import type { User } from "@/data/mockUsers";
import {
  validateCredentials,
  addRegisteredUser,
  findUserByEmail,
} from "@/data/mockUsers";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulasi delay network
      await new Promise((resolve) => setTimeout(resolve, 500));

      const validatedUser = validateCredentials(email, password);

      if (!validatedUser) {
        throw new Error("Email atau password tidak sesuai");
      }

      setUser(validatedUser);
      localStorage.setItem("currentUser", JSON.stringify(validatedUser));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Validasi
        if (!email || !password || !name) {
          throw new Error("Semua field harus diisi");
        }

        if (password.length < 6) {
          throw new Error("Password minimal 6 karakter");
        }

        if (findUserByEmail(email)) {
          throw new Error("Email sudah terdaftar");
        }

        // Simulasi delay network
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newUser: User = {
          id: Date.now().toString(),
          email,
          password,
          name,
          createdAt: new Date(),
        };

        addRegisteredUser(newUser);
        setUser(newUser);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
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

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
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
