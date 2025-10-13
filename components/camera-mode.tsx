import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { CameraView } from 'expo-camera';

export default function CameraMode({
  handleBarcodeScanned,
  scanned,
  setScanned,
}: {
  handleBarcodeScanned: () => void;
  scanned: boolean;
  setScanned: (scan: boolean) => void;
}) {
  return (
    <View className="h-full w-full flex-1">
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

      {/* Dimming overlay when scanned */}
      {scanned && (
        <View style={styles.dimOverlay}>
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

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
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark dimming overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
