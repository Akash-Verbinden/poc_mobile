// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import 'react-native-gesture-handler';
// import React, { useState, createContext, useContext } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

// // --- Auth Context ---
// const AuthContext = createContext<{ isAuthenticated: boolean; login: () => void; logout: () => void }>({
//   isAuthenticated: false,
//   login: () => {},
//   logout: () => {},
// });

// // --- Dummy Screens ---
// function LoginScreen() {
//   const { login } = useContext(AuthContext);
//   return (
//     <View style={styles.center}>
//       <Text style={styles.title}>Login Screen</Text>
//       <Button title="Log In" onPress={login} />
//     </View>
//   );
// }

// function HomeScreen({ navigation }: any) {
//   return (
//     <View style={styles.center}>
//       <Text style={styles.title}>Home Screen (Bottom Tab)</Text>
//       <Button title="Go to Details" onPress={() => navigation.navigate('HomeDetails')} />
//     </View>
//   );
// }

// function HomeDetailsScreen() {
//   return (
//     <View style={styles.center}>
//       <Text style={styles.title}>Home Details (Stack Screen)</Text>
//     </View>
//   );
// }

// function ProfileScreen() {
//   return (
//     <View style={styles.center}>
//       <Text style={styles.title}>Profile Screen (Bottom Tab)</Text>
//     </View>
//   );
// }

// function SettingsScreen() {
//   return (
//     <View style={styles.center}>
//       <Text style={styles.title}>Settings Screen (Drawer Item)</Text>
//     </View>
//   );
// }

// // --- Navigators ---
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// // 1. Stack inside Home Tab
// function HomeStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
//       <Stack.Screen name="HomeDetails" component={HomeDetailsScreen} options={{ title: 'Details' }} />
//     </Stack.Navigator>
//   );
// }

// // 2. Bottom Tab Navigator
// function BottomTabs() {
//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false }}>
//       <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
//       <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
//     </Tab.Navigator>
//   );
// }

// // 3. Custom Sidebar Content
// function CustomDrawerContent(props: any) {
//   const { logout } = useContext(AuthContext);
//   return (
//     <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//       <DrawerItem label="Logout" onPress={logout} />
//     </DrawerContentScrollView>
//   );
// }

// // 4. Drawer Navigator (Wraps Bottom Tabs)
// function MainDrawer() {
//   return (
//     <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
//       <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: 'Dashboard' }} />
//       <Drawer.Screen name="Settings" component={SettingsScreen} />
//     </Drawer.Navigator>
//   );
// }

// // 5. Root Entry Point
// export default function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         login: () => setIsAuthenticated(true),
//         logout: () => setIsAuthenticated(false),
//       }}>
//       <NavigationContainer>
//         {isAuthenticated ? <MainDrawer /> : <LoginScreen />}
//       </NavigationContainer>
//     </AuthContext.Provider>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// App.js
import React from 'react';
import AppNavigator from './AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast } from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store, { persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from 'react-native';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      text2NumberOfLines={0}
      style={{ borderLeftColor: 'green', height: 'auto' }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        flexWrap: 'wrap',
        padding: 10,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
      }}
      text2Style={{
        fontSize: 14,
        color: '#000',
        flexWrap: 'wrap',
      }}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      text2NumberOfLines={0}
      style={{ borderLeftColor: 'red', height: 'auto' }}
      text1Style={{ fontSize: 12, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14, color: 'red', flexWrap: 'wrap' }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        padding: 10,
        flexWrap: 'wrap',
      }}
    />
  ),
};

export default function App() {
  LogBox.ignoreAllLogs(true);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppNavigator />
            <Toast config={toastConfig} />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
