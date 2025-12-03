import React, { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import UserItem from '../components/UserItem';
import FilterBar from '../components/FilterBar';
import ErrorView from '../components/ErrorView';
import useStore from '../state/store';
import { useUsers } from '../hooks/useUsers';

export default function UserListScreen() {
  const { users, loading, error, refresh } = useUsers();
  const { filters, toggleFavorite, favorites, setFilters } = useStore();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.first
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
        user.name.last.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCountry =
        filters.country === 'all' ||
        user.location.country.toLowerCase() === filters.country.toLowerCase();

      const matchesGender =
        filters.gender === 'all' ||
        user.gender === filters.gender;

      return matchesSearch && matchesCountry && matchesGender;
    });
  }, [users, filters]);

  if (error) {
    return <ErrorView error={error} onRetry={refresh} />;
  }

  if (loading && !users.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterBar filters={filters} onFilterChange={setFilters} />
      <FlashList
        data={filteredUsers}
        keyExtractor={(item) => item.login.uuid}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            isFavorite={favorites.has(item.login.uuid)}
            onToggleFavorite={() => toggleFavorite(item.login.uuid)}
          />
        )}
        estimatedItemSize={100}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});