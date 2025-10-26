import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

// BLE Configuration - MUST match your Electron app
const BLE_CONFIG = {
  SERVICE_UUID: '123e4567-e89b-12d3-a456-426614174000',
  SSID_CHARACTERISTIC_UUID: '123e4567-e89b-12d3-a456-426614174001',
  PASSWORD_CHARACTERISTIC_UUID: '123e4567-e89b-12d3-a456-426614174002',
  DEVICE_NAME_PREFIX: 'AttendanceApp',
};

interface WiFiCredentials {
  ssid: string;
  password: string;
}

const BLEDiscoveryScreen = () => {
  const [bleManager] = useState(() => new BleManager());
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevice, setFoundDevice] = useState<Device | null>(null);
  const [wifiCredentials, setWifiCredentials] = useState<WiFiCredentials | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Request permissions on mount
    requestPermissions();

    // Cleanup on unmount
    return () => {
      bleManager.destroy();
    };
  }, []);

  // Request Bluetooth permissions (Android 12+)
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert(
            'Permissions Required',
            'Please enable Bluetooth and Location permissions to scan for the attendance server.'
          );
          return false;
        }
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required',
            'Location permission is required to scan for Bluetooth devices.'
          );
          return false;
        }
      }
    }
    return true;
  };

  // Start scanning for BLE devices
  const startScanning = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setIsScanning(true);
    setFoundDevice(null);
    setWifiCredentials(null);

    console.log('🔍 Starting BLE scan for AttendanceApp...');

    // Scan for devices with our service UUID
    bleManager.startDeviceScan([BLE_CONFIG.SERVICE_UUID], null, (error, device) => {
      if (error) {
        console.error('❌ Scan error:', error);
        setIsScanning(false);
        Alert.alert('Scan Error', error.message);
        return;
      }

      if (device && device.name?.includes(BLE_CONFIG.DEVICE_NAME_PREFIX)) {
        console.log('✅ Found device:', device.name, device.id);
        setFoundDevice(device);
        bleManager.stopDeviceScan();
        setIsScanning(false);

        // Auto-connect to read credentials
        connectAndReadCredentials(device);
      }
    });

    // Stop scanning after 10 seconds if nothing found
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
      if (!foundDevice) {
        Alert.alert(
          'No Server Found',
          'Could not find the Attendance Server. Make sure:\n\n' +
            '1. The server is running\n' +
            '2. Bluetooth is enabled\n' +
            '3. You are near the server'
        );
      }
    }, 10000);
  };

  // Connect and read WiFi credentials
  const connectAndReadCredentials = async (device: Device) => {
    setIsConnecting(true);

    try {
      console.log('🔗 Connecting to device...');

      // Connect to device
      const connectedDevice = await device.connect();
      console.log('✅ Connected');

      // Discover services and characteristics
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('✅ Services discovered');

      // Read SSID
      console.log('📖 Reading SSID...');
      const ssidCharacteristic = await connectedDevice.readCharacteristicForService(
        BLE_CONFIG.SERVICE_UUID,
        BLE_CONFIG.SSID_CHARACTERISTIC_UUID
      );

      const ssid = base64ToString(ssidCharacteristic.value || '');
      console.log('✅ SSID:', ssid);

      // Read Password
      console.log('📖 Reading Password...');
      const passwordCharacteristic = await connectedDevice.readCharacteristicForService(
        BLE_CONFIG.SERVICE_UUID,
        BLE_CONFIG.PASSWORD_CHARACTERISTIC_UUID
      );

      const password = base64ToString(passwordCharacteristic.value || '');
      console.log('✅ Password:', password);

      // Store credentials
      setWifiCredentials({ ssid, password });

      // Disconnect
      await connectedDevice.cancelConnection();
      console.log('🔌 Disconnected');

      // Show success
      Alert.alert(
        '✅ WiFi Credentials Retrieved',
        `SSID: ${ssid}\nPassword: ${password}\n\n` +
          'Please connect to this WiFi network to submit attendance.',
        [
          {
            text: 'Copy SSID',
            onPress: () => {
              // TODO: Copy to clipboard
              console.log('Copy SSID:', ssid);
            },
          },
          {
            text: 'Copy Password',
            onPress: () => {
              // TODO: Copy to clipboard
              console.log('Copy Password:', password);
            },
          },
          { text: 'OK', style: 'default' },
        ]
      );
    } catch (error) {
      console.error('❌ Connection error:', error);
      Alert.alert(
        'Connection Failed',
        error instanceof Error ? error.message : 'Could not read WiFi credentials'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // Convert base64 to string
  const base64ToString = (base64: string): string => {
    try {
      return Buffer.from(base64, 'base64').toString('utf-8');
    } catch {
      return atob(base64); // Fallback for browsers
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance App</Text>
      <Text style={styles.subtitle}>BLE Server Discovery</Text>

      {/* Status */}
      <View style={styles.statusContainer}>
        {isScanning && (
          <>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.statusText}>Scanning for server...</Text>
          </>
        )}

        {isConnecting && (
          <>
            <ActivityIndicator size="large" color="#34C759" />
            <Text style={styles.statusText}>Connecting and reading credentials...</Text>
          </>
        )}

        {foundDevice && !isConnecting && (
          <View style={styles.deviceCard}>
            <Text style={styles.deviceTitle}>✅ Server Found</Text>
            <Text style={styles.deviceInfo}>Name: {foundDevice.name}</Text>
            <Text style={styles.deviceInfo}>ID: {foundDevice.id}</Text>
          </View>
        )}

        {wifiCredentials && (
          <View style={styles.credentialsCard}>
            <Text style={styles.credentialsTitle}>📶 WiFi Credentials</Text>
            <View style={styles.credentialRow}>
              <Text style={styles.label}>SSID:</Text>
              <Text style={styles.value}>{wifiCredentials.ssid}</Text>
            </View>
            <View style={styles.credentialRow}>
              <Text style={styles.label}>Password:</Text>
              <Text style={styles.value}>{wifiCredentials.password}</Text>
            </View>
            <Text style={styles.instructionText}>
              💡 Connect to this WiFi network to submit your attendance
            </Text>
          </View>
        )}
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={[styles.button, (isScanning || isConnecting) && styles.buttonDisabled]}
        onPress={startScanning}
        disabled={isScanning || isConnecting}>
        <Text style={styles.buttonText}>
          {isScanning ? 'Scanning...' : isConnecting ? 'Connecting...' : 'Scan for Server'}
        </Text>
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>How to use:</Text>
        <Text style={styles.instructionStep}>1. Tap Scan for Server</Text>
        <Text style={styles.instructionStep}>2. App will find the attendance server</Text>
        <Text style={styles.instructionStep}>
          3. WiFi credentials will be retrieved automatically
        </Text>
        <Text style={styles.instructionStep}>4. Connect to the WiFi network</Text>
        <Text style={styles.instructionStep}>5. Submit your attendance</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  deviceCard: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  deviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  deviceInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  credentialsCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  credentialsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 15,
  },
  credentialRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 100,
  },
  value: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  instructionText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionStep: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default BLEDiscoveryScreen;
