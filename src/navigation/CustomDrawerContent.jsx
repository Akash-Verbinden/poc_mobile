import React from 'react';
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../redux/slices/authSlice';
import { persistor } from '../redux/store';
import COELogo from '../../assets/icons/COE_logo.png';

const MENU_ITEMS = [
  {
    name: 'Dashboard',
    icon: 'bar-chart-outline',
    route: 'dashboard',
    tab: 'dashboardTab',
  },
  {
    name: 'Programs',
    icon: 'book-outline',
    route: 'programs',
    tab: 'programs',
  },
  {
    name: 'Universities',
    icon: 'school-outline',
    route: 'universities',
    tab: 'dashboardTab',
  },
  {
    name: 'Students',
    icon: 'person-outline',
    route: 'students',
    tab: 'dashboardTab',
  },
  {
    name: 'Resources',
    icon: 'bookmark-outline',
    route: 'resources',
    tab: 'dashboardTab',
  },
  {
    name: 'Offers',
    icon: 'pricetag-outline',
    route: 'offers',
    tab: 'dashboardTab',
  },
  {
    name: 'Communication',
    icon: 'mail-outline',
    route: 'communication',
    tab: 'communication',
  },
];

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const { state, navigation } = props;

function getDeepActiveRouteName(route) {
  const childState = route.state;

  if (childState && typeof childState.index === 'number') {
    const activeChildRoute = childState.routes[childState.index];
    return getDeepActiveRouteName(activeChildRoute);
  }

  const nestedName = getFocusedRouteNameFromRoute(route);
  if (nestedName) {
    return nestedName;
  }

  return route.name;
}

const focusedRoute = state?.routes[state?.index];


const activeRouteName = focusedRoute 
  ? getDeepActiveRouteName(focusedRoute) 
  : 'dashboard';

  const handleLogout = () => {
    dispatch(reduxLogout());
    persistor.purge();

    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const handleCloseDrawer = () => {
    if (navigation && typeof navigation.closeDrawer === 'function') {
      navigation.closeDrawer();
    } else if (navigation && typeof navigation.toggleDrawer === 'function') {
      navigation.toggleDrawer();
    }
  };

  const handleNavigate = item => {
    if (item.tab === 'dashboardTab') {
      navigation.navigate('MainTabs', {
        screen: 'dashboardTab',
        params: { screen: item.route },
      });
    } else {
      navigation.navigate('MainTabs', { screen: item.route });
    }

    if (typeof navigation.closeDrawer === 'function') {
      navigation.closeDrawer();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Close Button */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={handleCloseDrawer}
          style={({ pressed, hovered }) => [
            styles.closeButton,
            (pressed || hovered) && styles.hoverState,
          ]}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image source={COELogo} style={styles.logoImage} />
        </View>

        {/* Dynamic Navigation Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map(item => {
            const isActive =
              activeRouteName.toLowerCase() === item.route.toLowerCase();

            return (
              <Pressable
                key={item.name}
                onPress={() => {
                  console.log(activeRouteName,"activeRouteName", item.route, "item.route")
                  handleNavigate(item);
                }}
                style={({ pressed, hovered }) => [
                  styles.drawerItem,
                  isActive && styles.activeDrawerItem,
                  !isActive && (hovered || pressed) && styles.hoverState,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isActive ? '#1d4ed8' : '#ffffff'}
                  style={styles.itemIcon}
                />
                <Text
                  style={[
                    styles.drawerLabel,
                    isActive && styles.activeDrawerLabel,
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <Pressable
          style={({ pressed, hovered }) => [
            styles.drawerItem,
            (hovered || pressed) && styles.hoverState,
          ]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#ffffff"
            style={styles.itemIcon}
          />
          <Text style={styles.drawerLabel}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d4ed8',
  },
  topHeader: {
    paddingTop: 45,
    paddingRight: 16,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
  },
  scrollContainer: {
    paddingTop: 0,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoImage: {
    width: 140,
    height: 100,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  menuContainer: {
    marginTop: 10,
    gap: 6,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  activeDrawerItem: {
    backgroundColor: '#ffffff',
  },
  hoverState: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemIcon: {
    marginRight: 16,
  },
  drawerLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  activeDrawerLabel: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 10,
  },
});
