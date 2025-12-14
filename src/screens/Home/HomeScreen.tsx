import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {colors, typography, spacing, borderRadius, shadows} from '../../constants/theme';
import {useApp} from '../../context/AppContext';
import {getStatistics, getPrescriptions} from '../../services/database/DatabaseService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {clinicInfo, isOnline} = useApp();
  const [stats, setStats] = useState({
    total_prescriptions: 0,
    total_patients: 0,
    voice_commands: 0,
  });
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statistics = await getStatistics();
      setStats(statistics);

      const prescriptions = await getPrescriptions(5, 0);
      setRecentPrescriptions(prescriptions);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const StatCard = ({icon, title, value, color}: any) => (
    <View style={[styles.statCard, shadows.medium]}>
      <View style={[styles.statIconContainer, {backgroundColor: color + '20'}]}>
        <Icon name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const QuickAction = ({icon, title, onPress, color}: any) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <LinearGradient
        colors={[color, color + 'dd']}
        style={styles.quickActionGradient}>
        <Icon name={icon} size={32} color={colors.surface} />
        <Text style={styles.quickActionText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>{clinicInfo.name}</Text>
            <Text style={styles.headerSubtitle}>{clinicInfo.tagline}</Text>
          </View>
          {!isOnline && (
            <View style={styles.offlineBadge}>
              <Icon name="wifi-off" size={16} color={colors.surface} />
              <Text style={styles.offlineText}>Offline</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Statistics */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="file-document"
            title="Prescriptions"
            value={stats.total_prescriptions}
            color={colors.primary}
          />
          <StatCard
            icon="account-group"
            title="Patients"
            value={stats.total_patients}
            color={colors.success}
          />
          <StatCard
            icon="microphone"
            title="Voice Commands"
            value={stats.voice_commands}
            color={colors.accent}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="plus-circle"
              title="New Prescription"
              color={colors.primary}
              onPress={() => navigation.navigate('Prescription' as never)}
            />
            <QuickAction
              icon="file-document-multiple"
              title="Templates"
              color={colors.secondary}
              onPress={() => navigation.navigate('Templates' as never)}
            />
            <QuickAction
              icon="history"
              title="History"
              color={colors.info}
              onPress={() => navigation.navigate('History' as never)}
            />
            <QuickAction
              icon="cog"
              title="Settings"
              color={colors.warning}
              onPress={() => navigation.navigate('Settings' as never)}
            />
          </View>
        </View>

        {/* Recent Prescriptions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Prescriptions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('History' as never)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentPrescriptions.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="file-document-outline" size={64} color={colors.textLight} />
              <Text style={styles.emptyText}>No prescriptions yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first prescription to get started
              </Text>
            </View>
          ) : (
            recentPrescriptions.map((prescription: any) => (
              <TouchableOpacity
                key={prescription.id}
                style={[styles.prescriptionCard, shadows.small]}
                onPress={() =>
                  navigation.navigate('PrescriptionDetail' as never, {
                    prescriptionId: prescription.id,
                  } as never)
                }>
                <View style={styles.prescriptionHeader}>
                  <View>
                    <Text style={styles.prescriptionName}>
                      {prescription.patient_name}
                    </Text>
                    <Text style={styles.prescriptionMeta}>
                      {prescription.patient_age} years • {prescription.patient_gender}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={24} color={colors.textSecondary} />
                </View>
                <Text style={styles.prescriptionDiagnosis} numberOfLines={1}>
                  {prescription.diagnosis || 'Diagnosis pending'}
                </Text>
                <Text style={styles.prescriptionDate}>
                  {new Date(prescription.created_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.surface,
  },
  headerSubtitle: {
    ...typography.body2,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: spacing.xs,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  offlineText: {
    ...typography.caption,
    color: colors.surface,
    marginLeft: spacing.xs,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  seeAllText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickAction: {
    width: '48%',
    aspectRatio: 1.5,
  },
  quickActionGradient: {
    flex: 1,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  quickActionText: {
    ...typography.body2,
    color: colors.surface,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.body2,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  prescriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  prescriptionName: {
    ...typography.h4,
    color: colors.text,
  },
  prescriptionMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  prescriptionDiagnosis: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  prescriptionDate: {
    ...typography.caption,
    color: colors.textLight,
  },
});

export default HomeScreen;
