import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AppProvider } from './context/AppContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" />
      <RootNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
