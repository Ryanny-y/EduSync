import { API_URL } from 'config/constant';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { CreateUserForm, IUser, UserRole } from 'types/user';

type AuthResponseType = {
  message: string;
  data: { userData: IUser; accessToken: string };
};

type AuthContextType = {
  user: IUser | null;
  authResponse: AuthResponseType | null;
  signup: (user: CreateUserForm) => Promise<boolean>;
  login: (username: string, password: string, role: UserRole) => Promise<IUser>;
  refreshToken: () => Promise<AuthResponseType | null>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [authResponse, setAuthResponse] = useState<AuthResponseType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const data = await refreshToken();

      if (data) {
        setAuthResponse(data);
        setUser(data.data.userData);
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signup = async (user: CreateUserForm): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      return true;
    } catch (error) {
      setAuthResponse(null);
      throw error;
    }
  };

  const login = async (email: string, password: string, role: UserRole): Promise<IUser> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data: AuthResponseType = await response.json();

      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      await SecureStore.setItemAsync('accessToken', data.data.accessToken!);

      setAuthResponse(data);
      setUser(data.data.userData);
      return data.data.userData;
    } catch (error) {
      setAuthResponse(null);
      throw error;
    }
  };

  const refreshToken = async (): Promise<AuthResponseType | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
      });

      const data: AuthResponseType = await response.json();

      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      setAuthResponse(data);
      setUser(data.data.userData);
      return data;
    } catch (error) {
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
      });
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      setUser(null);
      setAuthResponse(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authResponse,
        signup,
        login,
        refreshToken,
        logout,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
