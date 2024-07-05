import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export interface Machine {
  MachineID: string;
  UserID: string|null;
  StartTime: string;
  EndTime: string;
}

export const fetchActiveMachines = async (): Promise<Machine[]> => {
  try {
    const token = await SecureStore.getItemAsync('refreshToken');
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    const response = await axios.get('https://mongrel-allowing-neatly.ngrok-free.app/retrieveData', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch active machines:', error);
    throw error;
  }
};

export const computeRemainingTime = (endTime: string): number => {
  const end = new Date(endTime);
  const now = new Date();
  const diffInMs = end.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffInMs / 1000)); // Convert milliseconds to seconds
};