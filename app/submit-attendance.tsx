import { View, Text, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Submit = () => {
  Alert.alert('Caution', 'Make sure you scanned the first QR code and connected to the Sessions');
  return (
    <SafeAreaView>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-2xl font-bold">Attendance Submitted Successfully!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Submit;
