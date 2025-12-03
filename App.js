import 'react-native-gesture-handler';
import React, { useCallback, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  const [errorKey, setErrorKey] = useState(0);

  const handleRetry = useCallback(() => {
    setErrorKey(prevKey => prevKey + 1);
  }, []);

  return (
    <ErrorBoundary key={errorKey} onRetry={handleRetry}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}