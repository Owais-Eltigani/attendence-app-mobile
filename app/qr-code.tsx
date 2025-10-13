import React, { useEffect, useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context'; //? enabled if run to issues with aligning in android.
import { CameraView, Camera } from 'expo-camera';
import { Text, View, StyleSheet, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSearchParams } from 'expo-router/build/hooks';

interface Student {
  name: string;
  enrNo: string;
  section: string;
  semester: string;
}

const Qrcode = () => {
  const [hasPermission, setHasPermission] = useState(false); //? set to null if faced any issues
  const [scanned, setScanned] = useState(false);

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
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    // Log the scanned data along with student info
    console.log('Scanned QR Code:', data);
    console.log('Student Info:', student);

    // Here you can process the QR data with the student information
    // For example, record attendance with the student details
    if (student) {
      console.log(
        `Recording attendance for ${student.name} (${student.enrNo}) from ${student.section}, semester ${student.semester}`
      );
      // recordAttendance(data, student);
    }
  };

  //* add area view if needed.
  return (
    <View className="flex-1 ">
      <StatusBar hidden={true} translucent={true} />

      {/* scanner window */}
      <View className="mb-6 h-[550px] items-center justify-center overflow-hidden rounded-lg bg-gray-200 shadow-lg">
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Custom Overlay with Rounded Corners */}
        <View style={styles.overlay}>
          {/* Top Left Corner */}
          <View style={[styles.corner, styles.topLeft]} />

          {/* Top Right Corner */}
          <View style={[styles.corner, styles.topRight]} />

          {/* Bottom Left Corner */}
          <View style={[styles.corner, styles.bottomLeft]} />

          {/* Bottom Right Corner */}
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </View>

      {/* mode switcher */}
      <View className="h-32 w-32 items-center justify-center self-center rounded-full bg-blue-300 p-3">
        <Text className="text-center font-extrabold text-white">Mode Switcher</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#007AFF', // Blue color
    borderWidth: 6, // Thicker border
  },
  topLeft: {
    top: '25%',
    left: '15%',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: '25%',
    right: '15%',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: '25%',
    left: '15%',
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: '25%',
    right: '15%',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Qrcode;
