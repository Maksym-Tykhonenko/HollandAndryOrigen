import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from '../HeaderComponent';

export const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  // Завантаження збережених даних
  const loadProfile = async () => {
    try {
      const storedName = await AsyncStorage.getItem('profile_name');
      const storedBio = await AsyncStorage.getItem('profile_bio');
      const storedContact = await AsyncStorage.getItem('profile_contact');
      const storedImage = await AsyncStorage.getItem('profile_image');

      if (storedName) setName(storedName);
      if (storedBio) setBio(storedBio);
      if (storedContact) setContact(storedContact);
      if (storedImage) setProfileImage(storedImage);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Вибір фото профілю
  const pickImage = () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 300,
      maxHeight: 300,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('Image Picker Error:', response.errorMessage);
        Alert.alert('Error', 'Failed to pick an image.');
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setProfileImage(imageUri);
      }
    });
  };

  // Збереження профілю
  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      await AsyncStorage.setItem('profile_name', name);
      await AsyncStorage.setItem('profile_bio', bio);
      await AsyncStorage.setItem('profile_contact', contact);
      if (profileImage)
        await AsyncStorage.setItem('profile_image', profileImage);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  // Очистка полів профілю
  const clearFields = async () => {
    try {
      await AsyncStorage.removeItem('profile_name');
      await AsyncStorage.removeItem('profile_bio');
      await AsyncStorage.removeItem('profile_contact');
      await AsyncStorage.removeItem('profile_image');

      setName('');
      setBio('');
      setContact('');
      setProfileImage(null);

      Alert.alert('Success', 'Profile cleared');
    } catch (error) {
      console.error('Error clearing profile:', error);
      Alert.alert('Error', 'Failed to clear profile');
    }
  };

  return (
    <>
      <HeaderComponent title="Holland" />
      <View style={styles.container}>
        {/* Аватар */}
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          <Avatar
            rounded
            size="large"
            source={
              profileImage
                ? {uri: profileImage}
                : {uri: 'https://cdn-icons-png.flaticon.com/512/747/747376.png'}
            }
            containerStyle={styles.avatar}
          />
        </TouchableOpacity>

        {/* Поля вводу */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          placeholderTextColor="gray"
          value={bio}
          onChangeText={setBio}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Contact"
          placeholderTextColor="gray"
          value={contact}
          onChangeText={setContact}
        />

        {/* Кнопка "Save" */}
        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <LinearGradient
            colors={['#FFC107', '#FF5722', '#E91E63']}
            style={styles.gradientButton}>
            <Text style={styles.buttonText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Кнопка "Clear" */}
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearFields}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  avatar: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#FFC107',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
  },
  gradientButton: {
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 10,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    alignItems: 'center',
  },
});
