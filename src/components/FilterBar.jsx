import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useStore from '../state/store';
import { useDebounce } from '../hooks/useDebounce';

const GENDERS = ['', 'male', 'female'];

const FilterBar = () => {
  const { filters, setFilters } = useStore();

  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  const handleCountryChange = (country) => {
    setFilters({ ...filters, country });
  };

  const handleGenderChange = (gender) => {
    setFilters({ ...filters, gender });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or email..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={styles.filterRow}>
        <Picker
          selectedValue={filters.country}
          style={styles.picker}
          onValueChange={handleCountryChange}
        >
          <Picker.Item label="All Countries" value="all" />
          <Picker.Item label="United States" value="United States" />
          <Picker.Item label="United Kingdom" value="United Kingdom" />
          <Picker.Item label="Canada" value="Canada" />
          <Picker.Item label="Australia" value="Australia" />
        </Picker>
        <Picker
          selectedValue={filters.gender}
          style={styles.picker}
          onValueChange={handleGenderChange}
        >
          <Picker.Item label="All Genders" value="all" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    height: Platform.OS === 'ios' ? 120 : 50,
  },
});

export default React.memo(FilterBar);