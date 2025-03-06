import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Image,
  Animated,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {CatalogScreen} from './src/screens/CatalogScreen';
import {DrawingScreen} from './src/screens/DrawingScreen';
import {ARScreen} from './src/screens/ARScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';
import LinearGradient from 'react-native-linear-gradient';
import {QuestsScreen} from './src/screens/QuestsScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({state, descriptors, navigation}: any) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'black',
        paddingVertical: 10,
      }}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        let iconName = '';

        if (route.name === 'Catalog') {
          iconName = 'image';
        } else if (route.name === 'Drawing') {
          iconName = 'brush';
        } else if (route.name === 'Quiz') {
          iconName = 'help-circle';
        } else if (route.name === 'AR') {
          iconName = 'cube';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }

        return (
          <View key={route.key} style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate(route.name)}>
              <Icon
                name={iconName}
                size={30}
                color={isFocused ? '#FFC107' : 'white'}
              />
            </TouchableOpacity>
            {isFocused && (
              <LinearGradient
                colors={['#FFC107', '#FF5722', '#E91E63']}
                style={{
                  height: 3,
                  width: 30,
                  borderRadius: 2,
                  marginTop: 5,
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export const App = () => {
  ///////// Louder
  const [louderIsEnded, setLouderIsEnded] = useState(false);
  const appearingAnim = useRef(new Animated.Value(0)).current;
  const appearingSecondAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appearingAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(appearingSecondAnim, {
        toValue: 1,
        duration: 7500,
        useNativeDriver: true,
      }).start();
      //setLouderIsEnded(true);
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLouderIsEnded(true);
    }, 8000);
  }, []);
  // FontAwesome5
  return (
    <NavigationContainer>
      {!louderIsEnded ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
          }}>
          <Animated.Image
            source={require('./src/img/crown.png')}
            style={{opacity: appearingSecondAnim, height: 200, width: 200}}
          />
          <Animated.Text
            style={{
              opacity: appearingSecondAnim,
              color: 'gold',
              textAlign: 'center',
              fontSize: 60,
              fontWeight: 'bold',
            }}>
            Crown Art & Design
          </Animated.Text>
        </View>
      ) : (
        <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{headerShown: false}}>
          <Tab.Screen name="Catalog" component={CatalogScreen} />
          <Tab.Screen name="Drawing" component={DrawingScreen} />
          <Tab.Screen name="Quiz" component={QuestsScreen} />
          <Tab.Screen name="AR" component={ARScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};
