import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Alert } from 'react-native';

interface AuthContextProps {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password:string) => Promise<void>;
  register: (username: string, password:string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setIsLoggedIn(true);
        const user = await SecureStore.getItemAsync('username');
        setUsername(user);
      }
    };

    checkLoginStatus();
  }, []);

  const saveToken = async(token:string, refreshToken: string, user:string)=>{
    await SecureStore.setItemAsync('token',token);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('username',user);
  };

  const clearToken = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('username');
  };

  const refreshToken=async()=>{
    const refreshToken=await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) return;

    try{
      const response=await axios.post('https://7add-12-47-18-60.ngrok-free.app/refresh', { token: refreshToken });
      const {token, newRefreshToken}=response.data;
      await saveToken(token, newRefreshToken, username as string);
    }
    catch(error){
      console.error('Token refresh failed',error);
      logout();
    }
  }


  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('https://7add-12-47-18-60.ngrok-free.app/login', { username, password },{
        headers: {
          'Content-Type': 'application/json'
        }});
      const { token, refreshToken } = response.data;
      await saveToken(token, refreshToken, username);
      setUsername(username);
      setIsLoggedIn(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          Alert.alert('Login Failed', 'Invalid username or password');
        } else {
          Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
        }
      } else {
        console.error('Login failed:', error);
        Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await axios.post('https://7add-12-47-18-60.ngrok-free.app/register', { username, password },{
        headers: {
          'Content-Type': 'application/json'
        }});
      const { token, refreshToken } = response.data;
      await saveToken(token, refreshToken, username);
      setUsername(username);
      setIsLoggedIn(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          Alert.alert('Login Failed', 'Invalid username or password');
        } else {
          Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
        }
      } else {
        console.error('Login failed:', error);
        Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const logout = async () => {
    await clearToken();
    setUsername(null);
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    username,
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

// Axios interceptor to handle token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('${NGROK_URL}/refresh', { token: refreshToken });
          const { token, newRefreshToken } = response.data;
          await SecureStore.setItemAsync('token', token);
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        } catch (err) {
          console.error('Token refresh failed:', err);
          // Call the logout function from AuthContext to clear the token and reset state
          const { logout } = useAuth();
          await logout();
        }
      }
    }

    return Promise.reject(error);
  }
);