import React, { useEffect, useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context'; //? enabled if run to issues with aligning in android.
import { CameraView, Camera } from 'expo-camera';
import { Text, View, StyleSheet, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSearchParams } from 'expo-router/build/hooks';
import CameraMode from 'components/camera-mode';
import DiscoveryMode from 'components/discovery-mode';

interface Student {
  name: string;
  enrNo: string;
  section: string;
  semester: string;
}

const Qrcode = () => {
  const [hasPermission, setHasPermission] = useState(false); //? set to null if faced any issues
  const [scanned, setScanned] = useState(false);
  const [mode, setMode] = useState('camera');

  const searchParams = useSearchParams();

  // Parse the student object from search params
  const studentParam = searchParams.get('student');
  const student: Student | null = studentParam
    ? JSON.parse(decodeURIComponent(studentParam))
    : null;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loaderText}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No access to camera</Text>
        <Text style={styles.errorSubText}>Please enable camera permissions in settings</Text>
      </View>
    );
  }

  // const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
  const handleBarcodeScanned = () => {
    setScanned(true);

    // Here you can process the QR data with the student information
    // For example, record attendance with the student details
    if (student) {
      console.log(
        `Recording attendance for ${student.name} (${student.enrNo}) from ${student.section}, semester ${student.semester}`
      );
    }
  };

  //
  const handleModeSwitch = () => {
    setMode((prev) => (prev === 'camera' ? 'discovery' : 'camera'));
    console.log(mode);
  };

  //* add area view if needed.
  return (
    <View className="flex-1 bg-gray-300">
      <StatusBar hidden={true} translucent={true} />

      {/* scanner window */}
      <View className="mb-6 h-[555px] items-center justify-center overflow-hidden rounded-b-3xl  bg-gray-200 shadow-lg">
        {mode === 'camera' ? (
          <CameraMode
            handleBarcodeScanned={handleBarcodeScanned}
            scanned={scanned}
            setScanned={setScanned}
          />
        ) : (
          <DiscoveryMode />
        )}
      </View>

      {/* mode switcher */}
      <View className="h-32 w-32 items-center justify-center self-center rounded-full bg-blue-400 p-3">
        <TouchableOpacity onPress={handleModeSwitch}>
          <Text className="text-center font-extrabold text-white">
            {mode === 'camera' ? 'Switch to Discovery' : 'Switch to Camera'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Qrcode;
