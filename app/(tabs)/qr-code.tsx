import React, { useEffect, useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context'; //? enabled if run to issues with aligning in android.
import { CameraView, Camera } from 'expo-camera';
import { Text, View, StyleSheet, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Qrcode = () => {
  const [hasPermission, setHasPermission] = useState(false); //? set to null if faced any issues
  const [scanned, setScanned] = useState(false);

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

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with  data ${data} has been scanned!`);
    console.log(data);
  };

  //* add area view if needed.
  return (
    <View className="flex-1 ">
      <StatusBar hidden={true} translucent={true} />
      {/* scanner window */}
      <View className="mb-6 h-[550px] items-center justify-center overflow-hidden rounded-lg bg-gray-200 shadow-lg">
        {/* <CameraView style={styles.camera} facing={'back'}></CameraView>  */}

        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
            isGuidanceEnabled: true, // Shows guidance overlays on iOS
          }}
          style={StyleSheet.absoluteFillObject}
        />
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
    // minHeight: 300, // Ensure minimum height for camera
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
