import { useState, useEffect, createContext, useContext } from "react";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

export type UserRole = "admin" | "clinic";

interface User {
  _id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isClinic: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    userRole: user?.role || null,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isClinic: user?.role === 'clinic',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useMongoAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useMongoAuth must be used within an AuthProvider');
  }
  return context;
};