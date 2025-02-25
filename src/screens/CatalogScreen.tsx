import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderComponent from '../HeaderComponent';

export const CatalogScreen = () => {
  const [artworks, setArtworks] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedArtworks, setSortedArtworks] = useState<any>([]);
  const [sortAscending, setSortAscending] = useState(true);

  // Стан для модального вікна додавання нової картки
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newStyle, setNewStyle] = useState('');

  useEffect(() => {
    const fetchArtworks = async () => {
      const data = [
        {
          id: '1',
          title: 'Starry Night',
          artist: 'Vincent van Gogh',
          year: 1889,
          description: 'A masterpiece of post-impressionism.',
          image:
            'https://www.diamondartclub.com/cdn/shop/files/the-starry-night-v1-diamond-art-painting-45185192820929.jpg?v=1726256407&width=3745',
        },
        {
          id: '2',
          title: 'The Night Watch',
          artist: 'Rembrandt',
          year: 1642,
          description: 'A famous group portrait with dramatic light.',
          image:
            'https://cdn.britannica.com/98/240498-138-7736B25A/Rembrandt-van-Rijn-The-Night-Watch.jpg?w=800&h=450&c=crop',
        },
        {
          id: '3',
          title: 'Girl with a Pearl Earring',
          artist: 'Johannes Vermeer',
          year: 1665,
          description: 'A delicate portrait of a girl.',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/270px-1665_Girl_with_a_Pearl_Earring.jpg',
        },
      ];

      console.log('Fetched Artworks:', data);
      setArtworks(data);
      setSortedArtworks(data);
      setLoading(false);
    };

    fetchArtworks();
    loadFavorites();
  }, []);

  const toggleFavorite = async (id: string) => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(item => item !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const loadFavorites = async () => {
    const savedFavorites = await AsyncStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const openModal = (artwork: any) => {
    setSelectedArtwork(artwork);
    setModalVisible(true);
  };

  const sortArtworks = () => {
    const sorted = [...sortedArtworks].sort((a, b) =>
      sortAscending ? a.year - b.year : b.year - a.year,
    );
    setSortedArtworks(sorted);
    setSortAscending(!sortAscending);
  };

  // Обробка додавання нової картки
  const handleAddArtwork = () => {
    if (!newTitle || !newArtist || !newYear || !newDescription || !newImage) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newArtwork = {
      id: Date.now().toString(),
      title: newTitle,
      artist: newArtist,
      year: parseInt(newYear),
      description: newDescription,
      image: newImage,
      style: newStyle || 'Unknown',
    };

    const updatedArtworks = [...artworks, newArtwork];
    // Оновлюємо обидва стани: основний список та відсортований
    setArtworks(updatedArtworks);
    const sorted = sortAscending
      ? updatedArtworks.sort((a, b) => a.year - b.year)
      : updatedArtworks.sort((a, b) => b.year - a.year);
    setSortedArtworks([...sorted]);

    // Очищаємо поля форми та закриваємо модальне вікно
    setNewTitle('');
    setNewArtist('');
    setNewYear('');
    setNewDescription('');
    setNewImage('');
    setNewStyle('');
    setAddModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  return (
    <>
      <HeaderComponent title="Holland" />
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search artworks..."
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.sortButton} onPress={sortArtworks}>
            <Text style={styles.sortButtonText}>
              {sortAscending ? 'Sort: Oldest' : 'Sort: Newest'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}>
            <Icon name="add-circle" size={28} color="#FFC107" />
            <Text style={styles.addButtonText}>Add Artwork</Text>
          </TouchableOpacity>
        </View>

        {sortedArtworks.filter((item: any) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ).length === 0 ? (
          <Text style={styles.noResults}>No artworks found.</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={sortedArtworks.filter((item: any) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()),
            )}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => openModal(item)}>
                <Image source={{uri: item.image}} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.artist}>{item.artist}</Text>
                </View>
                <TouchableOpacity
                  style={styles.favoriteIcon}
                  onPress={() => toggleFavorite(item.id)}>
                  <Icon
                    name={
                      favorites.includes(item.id) ? 'heart' : 'heart-outline'
                    }
                    size={24}
                    color={favorites.includes(item.id) ? '#E91E63' : 'white'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Модальне вікно для перегляду деталей картини */}
        {selectedArtwork && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={['#000', '#222']}
                style={styles.modalBackground}
              />
              <Image
                source={{uri: selectedArtwork.image}}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedArtwork.title}</Text>
              <Text style={styles.modalArtist}>
                {selectedArtwork.artist} ({selectedArtwork.year})
              </Text>
              {selectedArtwork.style && (
                <Text style={styles.modalStyle}>
                  Style: {selectedArtwork.style}
                </Text>
              )}
              <Text style={styles.modalDescription}>
                {selectedArtwork.description}
              </Text>

              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(selectedArtwork.id)}>
                <Icon
                  name={
                    favorites.includes(selectedArtwork.id)
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={24}
                  color="white"
                />
                <Text style={styles.favoriteButtonText}>
                  {' '}
                  {favorites.includes(selectedArtwork.id)
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}

        {/* Модальне вікно для додавання нової картини */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => setAddModalVisible(false)}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#000', '#222']}
              style={styles.modalBackground}
            />
            <Text style={styles.modalTitle}>Add New Artwork</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Title"
              placeholderTextColor="gray"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Artist"
              placeholderTextColor="gray"
              value={newArtist}
              onChangeText={setNewArtist}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Year"
              placeholderTextColor="gray"
              value={newYear}
              onChangeText={setNewYear}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Description"
              placeholderTextColor="gray"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />
            <TextInput
              style={styles.textInput}
              placeholder="Image URL"
              placeholderTextColor="gray"
              value={newImage}
              onChangeText={setNewImage}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Style (optional)"
              placeholderTextColor="gray"
              value={newStyle}
              onChangeText={setNewStyle}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddArtwork}>
              <Text style={styles.saveButtonText}>Save Artwork</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAddModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
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
    backgroundColor: 'black',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    color: 'white',
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.48,
  },
  sortButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
  },
  addButtonText: {
    color: '#FFC107',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  noResults: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    alignItems: 'center',
    elevation: 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  artist: {
    fontSize: 16,
    color: '#FFC107',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  modalImage: {
    width: '90%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalArtist: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalStyle: {
    fontSize: 16,
    color: '#FFA500',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  favoriteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
