import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface AppContextType {
  isOnline: boolean;
  apiKey: string | null;
  setApiKey: (key: string) => Promise<void>;
  clinicInfo: ClinicInfo;
  setClinicInfo: (info: ClinicInfo) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface ClinicInfo {
  name: string;
  tagline: string;
  doctorName: string;
  credentials: string;
  regNumber: string;
  phone: string;
  email: string;
  address: string;
  logo: string | null;
}

const defaultClinicInfo: ClinicInfo = {
  name: 'MediScript AI',
  tagline: 'Enterprise Medical Platform',
  doctorName: 'Dr. John Doe',
  credentials: 'MBBS, MD',
  regNumber: 'MCI-12345',
  phone: '+91 98765 43210',
  email: 'doctor@mediscript.com',
  address: '123 Medical Street, City',
  logo: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({children}: {children: ReactNode}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [clinicInfo, setClinicInfoState] = useState<ClinicInfo>(defaultClinicInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
    
    // Monitor network status
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  const loadSavedData = async () => {
    try {
      setIsLoading(true);
      
      // Load API key
      const savedApiKey = await AsyncStorage.getItem('groq_api_key');
      if (savedApiKey) {
        setApiKeyState(savedApiKey);
      }

      // Load clinic info
      const savedClinicInfo = await AsyncStorage.getItem('clinic_info');
      if (savedClinicInfo) {
        setClinicInfoState(JSON.parse(savedClinicInfo));
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
      setError('Failed to load saved data');
    } finally {
      setIsLoading(false);
    }
  };

  const setApiKey = async (key: string) => {
    try {
      await AsyncStorage.setItem('groq_api_key', key);
      setApiKeyState(key);
    } catch (err) {
      console.error('Error saving API key:', err);
      throw new Error('Failed to save API key');
    }
  };

  const setClinicInfo = async (info: ClinicInfo) => {
    try {
      await AsyncStorage.setItem('clinic_info', JSON.stringify(info));
      setClinicInfoState(info);
    } catch (err) {
      console.error('Error saving clinic info:', err);
      throw new Error('Failed to save clinic info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        isOnline,
        apiKey,
        setApiKey,
        clinicInfo,
        setClinicInfo,
        isLoading,
        error,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
