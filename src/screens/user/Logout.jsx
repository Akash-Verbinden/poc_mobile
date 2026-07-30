import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../../redux/slices/authSlice';
import { persistor } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';

const LogOut = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(reduxLogout());

    persistor.purge();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [dispatch, navigation]);

  return null;
};

export default LogOut;
