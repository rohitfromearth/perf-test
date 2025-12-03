import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      users: [],
      favorites: new Set(),
      filters: {
        search: '',
        country: 'all',
        gender: 'all',
      },
      setUsers: (users) => set({ users }),
      toggleFavorite: (userId) =>
        set((state) => {
          const favorites = new Set(state.favorites);
          if (favorites.has(userId)) {
            favorites.delete(userId);
          } else {
            favorites.add(userId);
          }
          return { favorites };
        }),
      setFilters: (filters) => set({ filters }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: Array.from(state.favorites),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        favorites: new Set(persistedState.favorites || []),
      }),
    }
  )
);

export default useStore;