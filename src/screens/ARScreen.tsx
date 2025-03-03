import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ALBUMS_STORAGE_KEY = 'albums';

export const ARScreen = () => {
  const [albums, setAlbums] = useState<{name: string; photos: string[]}[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<string | null>(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const storedAlbums = await AsyncStorage.getItem(ALBUMS_STORAGE_KEY);
        if (storedAlbums) {
          setAlbums(JSON.parse(storedAlbums));
        }
      } catch (error) {
        console.error('Error loading albums:', error);
      }
    };

    loadAlbums();
  }, []);

  const saveAlbums = async (updatedAlbums: typeof albums) => {
    try {
      await AsyncStorage.setItem(
        ALBUMS_STORAGE_KEY,
        JSON.stringify(updatedAlbums),
      );
    } catch (error) {
      console.error('Error saving albums:', error);
    }
  };

  const pickImage = async () => {
    try {
      ImagePicker.launchImageLibrary({mediaType: 'photo'}, async result => {
        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
          const selectedImage = result.assets[0].uri;
          if (currentAlbum) {
            const updatedAlbums = albums.map(album =>
              album.name === currentAlbum
                ? {...album, photos: [...album.photos, selectedImage]}
                : album,
            );
            setAlbums(updatedAlbums);
            await saveAlbums(updatedAlbums);
          }
        }
      });
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const createAlbum = async () => {
    if (newAlbumName.trim()) {
      const newAlbum = {name: newAlbumName.trim(), photos: []};
      const updatedAlbums = [...albums, newAlbum];
      setAlbums(updatedAlbums);
      await saveAlbums(updatedAlbums);
      setNewAlbumName('');
      setModalVisible(false);
    }
  };

  const renderAlbumItem = ({
    item,
  }: {
    item: {name: string; photos: string[]};
  }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => setCurrentAlbum(item.name)}>
      <Text style={styles.albumText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPhotoItem = ({item}: {item: string}) => (
    <Image source={{uri: item}} style={styles.photo} />
  );

  const currentAlbumData = albums.find(album => album.name === currentAlbum);

  return (
    <View style={styles.container}>
      {currentAlbum ? (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentAlbum(null)}>
            <Text style={styles.backButtonText}>← Back to Albums</Text>
          </TouchableOpacity>
          <Text style={styles.albumHeader}>{currentAlbum}</Text>
          <FlatList
            data={currentAlbumData?.photos || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPhotoItem}
            numColumns={3}
            contentContainerStyle={styles.photosContainer}
          />
          <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
            <Text style={styles.pickImageButtonText}>Add Photo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <FlatList
            data={albums}
            keyExtractor={item => item.name}
            renderItem={renderAlbumItem}
            contentContainerStyle={styles.albumList}
          />
          <TouchableOpacity
            style={styles.addAlbumButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.addAlbumButtonText}>+ Add Album</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Album Name"
            value={newAlbumName}
            onChangeText={setNewAlbumName}
          />
          <TouchableOpacity style={styles.createButton} onPress={createAlbum}>
            <Text style={styles.createButtonText}>Create Album</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 20,
    //marginTop:20
  },
  albumList: {
    paddingBottom: 20,
  },
  albumItem: {
    backgroundColor: '#444',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  albumText: {color: '#fff', fontSize: 16},
  addAlbumButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  addAlbumButtonText: {color: '#fff', fontSize: 16},
  pickImageButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  pickImageButtonText: {color: '#fff', fontSize: 16},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  createButtonText: {color: '#fff', fontSize: 16},
  cancelButton: {
    backgroundColor: '#777',
    padding: 15,
    borderRadius: 8,
  },
  cancelButtonText: {color: '#fff', fontSize: 16},
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#FF5722',
    fontSize: 16,
  },
  albumHeader: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  photosContainer: {
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default ARScreen;
