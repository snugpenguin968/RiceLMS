import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  isLoggedIn: boolean;
  username: string | null;
  password: string | null;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const login = async (user: string, pass: string) => {
    // This is a placeholder for real login logic
    // Here you would typically check the username and password with a server
    setUsername(user);
    setPassword(pass);
    setIsLoggedIn(true);

    // Save the state to AsyncStorage
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('username', user);
    await AsyncStorage.setItem('password', pass);
  };

  const register = async (user: string, pass: string) => {
    // This is a placeholder for real registration logic
    // Here you would typically send the username and password to a server to create an account
    setUsername(user);
    setPassword(pass);
    setIsLoggedIn(true);

    // Save the state to AsyncStorage
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('username', user);
    await AsyncStorage.setItem('password', pass);
  };

  const logout = async () => {
    setUsername(null);
    setPassword(null);
    setIsLoggedIn(false);

    // Remove the state from AsyncStorage
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
  };

  const value = {
    isLoggedIn,
    username,
    password,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};