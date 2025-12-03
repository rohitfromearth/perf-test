import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ErrorView = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error Loading Data</Text>
      <Text style={styles.message}>{error?.message || 'An unknown error occurred'}</Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
});

export default React.memo(ErrorView);