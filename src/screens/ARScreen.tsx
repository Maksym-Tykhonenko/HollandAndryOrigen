import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  Camera,
  useCameraDevices,
  CameraPermissionStatus,
} from 'react-native-vision-camera';
import HeaderComponent from '../HeaderComponent';

export const ARScreen = () => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>('not-determined');
  const [device, setDevice] = useState<any>(null);
  const devices: any = useCameraDevices();

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      setCameraPermission(permission);
      if (permission === 'granted') {
        if (devices.back) {
          setDevice(devices.back);
        }
      }
    };

    requestPermission();
  }, [devices]);

  return (
    <>
      <HeaderComponent title={'Holland'} />
      <View style={styles.container}>
        {cameraPermission === 'granted' && device ? (
          <Camera style={styles.camera} device={device} isActive={true} />
        ) : (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Enable Camera for AR Features</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Camera.requestCameraPermission()}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
              }}
              style={styles.placeholderImage}
            />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  infoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    marginTop: 10,
    tintColor: '#fff',
  },
});
