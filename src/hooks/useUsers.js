import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import useStore from '../state/store';
import { fetchUsers } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@users_cache';

export const useUsers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const store = useStore();
  const { users, setUsers } = store;

  const loadCachedUsers = useCallback(async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setUsers(parsedData);
      }
    } catch (err) {
      console.error('Error loading cached users:', err);
    }
  }, [setUsers]);

  const fetchAndCacheUsers = useCallback(async () => {
    try {
      setLoading(true);
      const freshUsers = await fetchUsers();
      
      
      const uniqueUsers = Array.from(
        new Map([...users, ...freshUsers].map(user => [user.login.uuid, user])).values()
      );

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(uniqueUsers));
      setUsers(uniqueUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please check your connection and try again.');
      if (!users.length) {
        
        Alert.alert('Error', 'Failed to load users. Using cached data if available.');
      }
    } finally {
      setLoading(false);
    }
  }, [users, setUsers]);

  useEffect(() => {
    const initialize = async () => {
      await loadCachedUsers();
      await fetchAndCacheUsers();
    };
    initialize();
  }, []);

  const refresh = useCallback(async () => {
    await fetchAndCacheUsers();
  }, [fetchAndCacheUsers]);

  return { users, loading, error, refresh };
};