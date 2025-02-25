import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DrawingScreen = () => {
  const ref = useRef<any>(null);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Завантаження збережених малюнків із AsyncStorage
  useEffect(() => {
    const loadSavedImages = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('saved_drawings');
        if (jsonValue != null) {
          setSavedImages(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Error loading drawings:', e);
      }
    };

    loadSavedImages();
  }, []);

  // Обробка збереження малюнка
  const handleSave = async (signature: string) => {
    const newSavedImages = [...savedImages, signature];
    setSavedImages(newSavedImages);
    try {
      await AsyncStorage.setItem(
        'saved_drawings',
        JSON.stringify(newSavedImages),
      );
    } catch (e) {
      console.error('Error saving drawing:', e);
    }
    ref.current.clearSignature();
  };

  const handleModalOpen = () => {
    setModalVisible(true);
    ref.current.clearSignature();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Полотно для малювання */}
      <SignatureScreen
        ref={ref}
        onOK={handleSave}
        descriptionText="Draw here"
        clearText="Clear"
        confirmText="Save"
        webStyle={`
          .m-signature-pad { 
            box-shadow: none; 
            border: none; 
            height: ${Dimensions.get('window').height - 200}px; 
          } 
          .m-signature-pad--footer { 
            flex: 0; 
          }
          body,html {
            background-color: transparent;
          }
        `}
      />

      {/* Кнопка відкриття галереї */}
      <TouchableOpacity style={styles.button} onPress={handleModalOpen}>
        <LinearGradient
          colors={['#FF5722', '#FFC107']}
          style={styles.gradientButton}>
          <Text style={styles.buttonText}>Show Gallery</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Галерея збережених малюнків */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Saved Drawings</Text>
          <FlatList
            data={savedImages}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.galleryContainer}
            renderItem={({item}) => (
              <Image source={{uri: item}} style={styles.galleryImage} />
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close Gallery</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  button: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  gradientButton: {
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    paddingVertical: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#222',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 15,
  },
  galleryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
