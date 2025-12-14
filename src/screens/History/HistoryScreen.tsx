import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {colors, typography, spacing, borderRadius, shadows} from '../../constants/theme';
import {
  getPrescriptions,
  searchPrescriptions,
  deletePrescription,
} from '../../services/database/DatabaseService';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadPrescriptions();
    }, [])
  );

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await getPrescriptions(100, 0);
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      Alert.alert('Error', 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      loadPrescriptions();
      return;
    }

    try {
      const results = await searchPrescriptions(query);
      setPrescriptions(results);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      'Delete Prescription',
      `Are you sure you want to delete prescription for ${name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePrescription(id);
              loadPrescriptions();
              Alert.alert('Success', 'Prescription deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete prescription');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrescriptions();
    setRefreshing(false);
  };

  const renderPrescription = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[styles.prescriptionCard, shadows.small]}
      onPress={() =>
        navigation.navigate('PrescriptionDetail' as never, {
          prescriptionId: item.id,
        } as never)
      }>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.patientName}>{item.patient_name}</Text>
          <Text style={styles.patientMeta}>
            {item.patient_age} years • {item.patient_gender}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.patient_name)}>
          <Icon name="delete-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.diagnosis} numberOfLines={1}>
          {item.diagnosis || 'Diagnosis pending'}
        </Text>
        <Text style={styles.symptoms} numberOfLines={2}>
          {item.symptoms}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={14} color={colors.textLight} />
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Icon name="file-document-outline" size={80} color={colors.textLight} />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No results found' : 'No prescriptions yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try a different search term'
          : 'Create your first prescription to get started'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Prescription History</Text>
        <Text style={styles.subtitle}>
          {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by patient name, symptoms..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={prescriptions}
        renderItem={renderPrescription}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    ...typography.body1,
    color: colors.text,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  prescriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  patientName: {
    ...typography.h4,
    color: colors.text,
  },
  patientMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  cardBody: {
    marginBottom: spacing.sm,
  },
  diagnosis: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  symptoms: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.textLight,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default HistoryScreen;
