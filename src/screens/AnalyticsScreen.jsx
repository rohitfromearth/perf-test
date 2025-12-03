import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  InteractionManager, 
  RefreshControl,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import useStore from '../state/store';
import { calculateAnalytics } from '../utils/analytics';
import AnalyticsCard from '../components/AnalyticsCard';

const CountryItem = React.memo(({ country, count }) => (
  <View style={styles.countryRow}>
    <Text style={styles.countryName} numberOfLines={1} ellipsizeMode="tail">{country}</Text>
    <Text>{count}</Text>
  </View>
));

const GenderItem = React.memo(({ icon, label, value }) => (
  <View style={styles.genderItem}>
    <Text>{icon} {label}</Text>
    <Text>{value}%</Text>
  </View>
));

const AnalyticsScreen = () => {
  const { users, lastUpdated } = useStore();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return 'Never';
    return new Date(lastUpdated).toLocaleTimeString();
  }, [lastUpdated]);

  const calculateAnalyticsAsync = useCallback(async (isRefresh = false) => {
    if (!isRefresh) {
      setIsLoading(true);
    }
    setIsRefreshing(true);
    setError(null);

    try {
      await new Promise(resolve => InteractionManager.runAfterInteractions(resolve));
      
      const result = await new Promise((resolve) => {
        if (window.requestIdleCallback) {
          requestIdleCallback(
            () => resolve(calculateAnalytics(users)),
            { timeout: 1000 }
          );
        } else {
          setImmediate(() => resolve(calculateAnalytics(users)));
        }
      });

      setAnalytics(result);
    } catch (err) {
      console.error('Error calculating analytics:', err);
      setError('Failed to calculate analytics. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [users]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      calculateAnalyticsAsync();
    }
    return () => {
      mounted = false;
    };
  }, [calculateAnalyticsAsync]);

  const handleRefresh = useCallback(() => {
    calculateAnalyticsAsync(true);
  }, [calculateAnalyticsAsync]);

  const handleRetry = useCallback(() => {
    calculateAnalyticsAsync();
  }, [calculateAnalyticsAsync]);

  const countryList = useMemo(() => 
    analytics?.usersByCountry 
      ? Object.entries(analytics.usersByCountry).map(([country, count]) => (
          <CountryItem key={country} country={country} count={count} />
        ))
      : [],
    [analytics?.usersByCountry]
  );

  if (isLoading || !analytics) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Crunching numbers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={handleRetry}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Last updated: {formattedLastUpdated}</Text>
      </View>
      <View style={styles.grid}>
        <AnalyticsCard
          title="Total Users"
          value={analytics.totalUsers}
          icon="👥"
        />
        <AnalyticsCard
          title="Average Age"
          value={analytics.averageAge.toFixed(1)}
          icon="📊"
        />
        <AnalyticsCard
          title="Median Age"
          value={analytics.medianAge}
          icon="📈"
        />
        <AnalyticsCard
          title="Oldest User"
          value={`${analytics.oldestUser.name} (${analytics.oldestUser.age})`}
          icon="👴"
        />
        <AnalyticsCard
          title="Youngest User"
          value={`${analytics.youngestUser.name} (${analytics.youngestUser.age})`}
          icon="👶"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users by Country</Text>
        {countryList}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender Distribution</Text>
        <View style={styles.genderContainer}>
          <GenderItem 
            icon="👨" 
            label="Male" 
            value={analytics.genderDistribution.male} 
          />
          <GenderItem 
            icon="👩" 
            label="Female" 
            value={analytics.genderDistribution.female} 
          />
        </View>
      </View>
    </ScrollView>
  );
};

CountryItem.propTypes = {
  country: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired
};

GenderItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  subtitle: {
    color: '#8e8e93',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  lastUpdated: {
    marginTop: 8,
    color: '#8e8e93',
    fontSize: 12,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  countryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryName: {
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  genderItem: {
    alignItems: 'center',
  },
});

export default React.memo(AnalyticsScreen);