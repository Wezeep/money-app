import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontSizeAdjuster } from './FontSizeAdjuster';
import { SText } from './SettingsContext';

export const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-foreground text-lg font-bold mb-4">Settings</Text>

        <Text className="text-muted-foreground text-sm mb-2">Font size for chat & message text</Text>
        <FontSizeAdjuster />

        <View className="mt-6">
          <Text className="text-foreground font-semibold mb-2">Preview</Text>
          <View className="bg-card rounded-lg p-4">
            <SText className="text-foreground">
              This is a preview of message text. Adjust the font size above and the change will persist across app restarts.
            </SText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
