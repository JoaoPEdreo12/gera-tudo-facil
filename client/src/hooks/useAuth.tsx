import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  session: { token: string } | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      setSession({ token });
      // Optionally verify token with server and get user data
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      // You could add a verify endpoint to check if token is still valid
      // For now, we'll just assume it's valid if it exists
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setSession(null);
      setUser(null);
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
      });

      // Store auth data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setSession({ token: response.token });
      setUser(response.user);

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store auth data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setSession({ token: response.token });
      setUser(response.user);

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};