import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

import UserStacks from './stacks/UserStacks';
import Programs from '../screens/user/Programs/Programs';
// import Communication from '../screens/user/Communication/Communication';
import CommunicationStack from './stacks/CommunicationStack';
import ProgramsStack from './stacks/ProgramsStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#1d4ed8',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: 'transparent',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 4,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          if (route.name === 'dashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'programs') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'communication') {
            iconName = focused ? 'mail' : 'mail-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="dashboardTab"
        component={UserStacks}
        options={{ tabBarLabel: 'Home' }}
      />

      {/* 2nd Tab */}
      <Tab.Screen
        name="programs"
        component={ProgramsStack}
        options={{ tabBarLabel: 'Programs' }}
      />

      {/* 3rd Tab */}
      <Tab.Screen
        name="communication"
        component={CommunicationStack}
        options={{ tabBarLabel: 'Communication' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
