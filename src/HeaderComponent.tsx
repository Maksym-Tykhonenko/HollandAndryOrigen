import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
}) => {
  const navigation = useNavigation<any>();

  return (
    <LinearGradient colors={['#FF5722', '#FFC107']} style={styles.header}>
      <View style={styles.headerContent}>
        {/* Кнопка Назад */}
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {/* Заголовок */}
        <Text style={styles.headerTitle}>{title}</Text>

        {/* Кнопка Профілю */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileButton}>
          <Icon name="person-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  profileButton: {
    padding: 5,
  },
  placeholder: {
    width: 30, // Щоб вирівняти заголовок по центру
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
});

export default HeaderComponent;
