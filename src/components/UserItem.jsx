import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import useStore from '../state/store';

const UserItem = memo(({ user }) => {
  const { favorites, toggleFavorite } = useStore();

  const isFavorite = favorites.has(user.login.uuid);

  const handleFavoritePress = () => {
    toggleFavorite(user.login.uuid);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.picture.thumbnail }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>
          {`${user.name.first} ${user.name.last}`}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <TouchableOpacity onPress={handleFavoritePress} style={styles.heartButton}>
        <Text style={[styles.heart, isFavorite && styles.heartFilled]}>
          {isFavorite ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}, (prevProps, nextProps) => {
  
  return (
    prevProps.user.login.uuid === nextProps.user.login.uuid &&
    prevProps.user === nextProps.user
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  heartButton: {
    padding: 8,
  },
  heart: {
    fontSize: 20,
  },
  heartFilled: {
    color: 'red',
  },
});

export default UserItem;