import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import TabNavigator from './TabNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import UserStack from '../navigation/stacks/UserStacks';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
        },
        sceneStyle: {
          backgroundColor: '#f5f5f5',
        },
        drawerStyle: {
          backgroundColor: '#1d4ed8',
          width: 280,
        },
        
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        ),
        headerTitleAlign: 'center',
        headerStyle:{
          backgroundColor: '#1d4ed8',
        }
      })}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ title: '' }}
      />
      <Drawer.Screen
        name="dashboardTab"
        component={UserStack}
        options={{ title: '' }}
      />
    </Drawer.Navigator>
  );
}
