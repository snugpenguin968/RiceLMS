// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState,ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};
 interface AuthProviderProps{
    children: ReactNode;
 }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedLoginStatus = await AsyncStorage.getItem('isLoggedIn');
      if (storedLoginStatus === 'true') {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async () => {
    setIsLoggedIn(true);
    await AsyncStorage.setItem('isLoggedIn', 'true');
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};