import { API_URL } from 'config/constant';
import { useAuth } from 'context/AuthContext';
import { useCallback } from 'react';

const useAuthFetch = () => {
  const { authResponse, refreshToken, logout } = useAuth();

  const authFetch = useCallback(
    async <T = any>(url: string, options: RequestInit & { raw?: boolean } = {}): Promise<T> => {
      let token = authResponse?.data.accessToken;
      const isFormData = options.body instanceof FormData;

      const buildHeaders = (accessToken?: string) => {
        const headers: Record<string, string> = {
          ...(options.headers as Record<string, string>),
        };

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        if (!isFormData && !options.raw) {
          headers['Content-Type'] = 'application/json';
        }

        return headers;
      };
      try {
        let response = await fetch(`${API_URL}/${url}`, {
          ...options,
          headers: buildHeaders(token),
        });

        if (response.status === 401) {
          try {
            const newTokens = await refreshToken();
            token = newTokens?.data.accessToken;

            response = await fetch(`${API_URL}/${url}`, {
              ...options,
              headers: buildHeaders(token),
            });
          } catch (refreshErr: any) {
            console.log(refreshErr);
            logout();
            throw refreshErr;
          }
        }

        if (options.raw) {
          return response as T;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || response.statusText);
        }

        return data;
      } catch (error: any) {
        throw error;
      }
    },
    [authResponse?.data.accessToken, refreshToken, logout]
  );

  return authFetch;
};

export default useAuthFetch;
