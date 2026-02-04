import React, { createContext, useContext, useEffect, useState } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FONT_SIZE_KEY = 'features:settings:fontSize';

export type FontSizeOption = 'small' | 'medium' | 'large';

export const fontSizeToNumber = (opt: FontSizeOption) => {
  switch (opt) {
    case 'small': return 14;
    case 'large': return 20;
    default: return 16; // medium
  }
};

interface SettingsContextValue {
  fontSize: FontSizeOption;
  setFontSize: (v: FontSizeOption) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizeOption>('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(FONT_SIZE_KEY);
        if (v === 'small' || v === 'medium' || v === 'large') {
          setFontSizeState(v);
        }
      } catch (e) {
        // ignore, keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setFontSize = async (v: FontSizeOption) => {
    setFontSizeState(v);
    try {
      await AsyncStorage.setItem(FONT_SIZE_KEY, v);
    } catch (e) {
      // ignore
    }
  };

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};

// Small helper component that renders text using the user-selected font size
export const SText: React.FC<{ children: React.ReactNode; style?: any; className?: string } & any> = ({ children, style, className, ...rest }) => {
  const { fontSize } = useSettings();
  return <Text style={[{ fontSize: fontSizeToNumber(fontSize) }, style]} className={className} {...rest}>{children}</Text>;
};
