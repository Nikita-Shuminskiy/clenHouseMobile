import { useState, useEffect } from 'react';
import { getToken, getRefreshToken } from '../utils/token';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          getToken(),
          getRefreshToken()
        ]);
        
        setIsAuthenticated(!!(accessToken && refreshToken));
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading
  };
};
