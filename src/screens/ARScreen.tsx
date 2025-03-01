import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  CameraPermissionStatus,
  PhotoFile,
} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhotoManipulator from 'react-native-photo-manipulator';
import HeaderComponent from '../HeaderComponent';

const PHOTO_STORAGE_KEY = 'captured_photo';

export const ARScreen = () => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>('not-determined');
  const [device, setDevice] = useState<any>(null);
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const devices: any = useCameraDevices();
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      setCameraPermission(permission);
      if (permission === 'granted' && devices.back) {
        setDevice(devices.back);
      }
    };

    requestPermission();
  }, [devices]);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const storedPhoto = await AsyncStorage.getItem(PHOTO_STORAGE_KEY);
        if (storedPhoto) {
          setSavedPhoto(storedPhoto);
        }
      } catch (error) {
        console.error('Error loading photo:', error);
      }
    };

    loadPhoto();
  }, []);

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo: PhotoFile = await cameraRef.current.takePhoto();
        console.log('Captured photo:', photo);
        // Save the photo path in AsyncStorage
        await AsyncStorage.setItem(PHOTO_STORAGE_KEY, photo.path);
        setSavedPhoto(photo.path);
        // Open the editor with the captured photo
        setEditingPhoto(photo.path);
      } catch (error) {
        console.log('Error capturing photo:', error);
      }
    }
  };

  const rotatePhoto = async () => {
    if (editingPhoto) {
      try {
        // Rotate the image by 90 degrees using react-native-photo-manipulator
        const resultUri = await PhotoManipulator.rotate(editingPhoto, 90);
        console.log('Edited photo:', resultUri);
        // Save the edited photo path in AsyncStorage
        await AsyncStorage.setItem(PHOTO_STORAGE_KEY, resultUri);
        setSavedPhoto(resultUri);
        // Close the editor modal after editing
        setEditingPhoto(null);
      } catch (error) {
        console.log('Error editing photo:', error);
      }
    }
  };

  return (
    <>
      <HeaderComponent title={'Holland'} />
      <View style={styles.container}>
        {cameraPermission === 'granted' && device ? (
          <>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={device}
              isActive={true}
              photo={true} // Enable photo mode
            />
            <TouchableOpacity
              style={styles.captureButton}
              onPress={capturePhoto}>
              <Text style={styles.captureButtonText}>Capture</Text>
            </TouchableOpacity>
            {savedPhoto && (
              <Image source={{uri: savedPhoto}} style={styles.savedPhoto} />
            )}
          </>
        ) : (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Enable Camera Permission</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Camera.requestCameraPermission()}>
              <Text style={styles.buttonText}>Open</Text>
            </TouchableOpacity>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
              }}
              style={styles.placeholderImage}
            />
          </View>
        )}

        {/* Modal for editing the captured photo */}
        <Modal visible={!!editingPhoto} animationType="slide">
          <View style={styles.modalContainer}>
            {editingPhoto && (
              <Image source={{uri: editingPhoto}} style={styles.editingImage} />
            )}
            <TouchableOpacity style={styles.editButton} onPress={rotatePhoto}>
              <Text style={styles.editButtonText}>Rotate 90°</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setEditingPhoto(null)}>
              <Text style={styles.closeButtonText}>Close Editor</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#FF5722',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  captureButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  savedPhoto: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#FF5722',
    borderRadius: 10,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editingImage: {
    width: '80%',
    height: '50%',
    borderRadius: 10,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ARScreen;
