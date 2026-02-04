import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSettings, FontSizeOption } from './SettingsContext';

const options: { key: FontSizeOption; label: string }[] = [
  { key: 'small', label: 'Small' },
  { key: 'medium', label: 'Medium' },
  { key: 'large', label: 'Large' },
];

export const FontSizeAdjuster: React.FC = () => {
  const { fontSize, setFontSize } = useSettings();

  return (
    <View className="flex-row items-center space-x-3">
      {options.map((o) => (
        <TouchableOpacity
          key={o.key}
          onPress={() => setFontSize(o.key)}
          className={`px-3 py-2 rounded-md ${fontSize === o.key ? 'bg-primary' : 'bg-muted'}`}
        >
          <Text className={`${fontSize === o.key ? 'text-white' : 'text-foreground'}`}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
