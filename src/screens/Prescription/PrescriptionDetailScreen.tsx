import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';
import {colors, typography, spacing, borderRadius, shadows} from '../../constants/theme';
import {useApp} from '../../context/AppContext';
import {getPrescriptionById} from '../../services/database/DatabaseService';
import VoiceService from '../../services/voice/VoiceService';

const PrescriptionDetailScreen = () => {
  const route = useRoute();
  const {clinicInfo} = useApp();
  const {prescriptionId} = route.params as {prescriptionId: number};
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescription();
  }, [prescriptionId]);

  const loadPrescription = async () => {
    try {
      const data = await getPrescriptionById(prescriptionId);
      setPrescription(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!prescription) return;

    const text = `
PRESCRIPTION

Patient: ${prescription.patient_name}
Age: ${prescription.patient_age} years
Gender: ${prescription.patient_gender}

Diagnosis: ${prescription.diagnosis}

Medications:
${prescription.medications.map((med: any, i: number) => 
  `${i + 1}. ${med.name}\n   ${med.dosage} • ${med.duration} • ${med.timing}`
).join('\n')}

Advice: ${prescription.advice}

Follow-up: ${prescription.followUp}

---
${clinicInfo.doctorName}, ${clinicInfo.credentials}
${clinicInfo.name}
${clinicInfo.phone}
    `.trim();

    try {
      await Share.share({message: text});
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleReadAloud = async () => {
    if (!prescription) return;

    const text = `Prescription for ${prescription.patient_name}, ${prescription.patient_age} years old ${prescription.patient_gender}. 
    Diagnosis: ${prescription.diagnosis}. 
    Medications: ${prescription.medications.map((med: any) => med.name).join(', ')}. 
    Advice: ${prescription.advice}. 
    Follow-up: ${prescription.followUp}`;

    try {
      await VoiceService.speak(text);
    } catch (error) {
      Alert.alert('Error', 'Failed to read prescription');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!prescription) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Prescription not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={[styles.header, shadows.small]}>
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>{clinicInfo.name}</Text>
            <Text style={styles.doctorName}>
              {clinicInfo.doctorName}, {clinicInfo.credentials}
            </Text>
            <Text style={styles.regNumber}>Reg. No: {clinicInfo.regNumber}</Text>
            <Text style={styles.contact}>
              {clinicInfo.phone} • {clinicInfo.email}
            </Text>
            <Text style={styles.address}>{clinicInfo.address}</Text>
          </View>
        </View>

        {/* Patient Info */}
        <View style={[styles.section, shadows.small]}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{prescription.patient_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{prescription.patient_age} years</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{prescription.patient_gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {new Date(prescription.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Symptoms */}
        <View style={[styles.section, shadows.small]}>
          <Text style={styles.sectionTitle}>Symptoms & Complaints</Text>
          <Text style={styles.bodyText}>{prescription.symptoms}</Text>
        </View>

        {/* Diagnosis */}
        <View style={[styles.section, shadows.small]}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Text style={styles.bodyText}>{prescription.diagnosis}</Text>
        </View>

        {/* Medications */}
        <View style={[styles.section, shadows.small]}>
          <Text style={styles.sectionTitle}>Medications</Text>
          {prescription.medications.map((med: any, index: number) => (
            <View key={index} style={styles.medicationItem}>
              <View style={styles.medicationNumber}>
                <Text style={styles.medicationNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.medicationDetails}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <Text style={styles.medicationDosage}>
                  {med.dosage} • {med.duration}
                </Text>
                <Text style={styles.medicationTiming}>{med.timing}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Advice */}
        <View style={[styles.section, shadows.small]}>
          <Text style={styles.sectionTitle}>General Advice</Text>
          <Text style={styles.bodyText}>{prescription.advice}</Text>
        </View>

        {/* Follow-up */}
        <View style={[styles.section, shadows.small]}>
          <Text style={styles.sectionTitle}>Follow-up</Text>
          <Text style={styles.bodyText}>{prescription.follow_up}</Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={styles.signatureText}>
            {clinicInfo.doctorName}, {clinicInfo.credentials}
          </Text>
          <Text style={styles.signatureSubtext}>Reg. No: {clinicInfo.regNumber}</Text>
        </View>

        <View style={{height: spacing.xxl}} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Icon name="share-variant" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleReadAloud}>
          <Icon name="volume-high" size={20} color={colors.success} />
          <Text style={styles.actionText}>Read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="file-pdf-box" size={20} color={colors.error} />
          <Text style={styles.actionText}>PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  clinicInfo: {
    alignItems: 'center',
  },
  clinicName: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  doctorName: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  regNumber: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  contact: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  address: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    marginBottom: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.primary,
    marginBottom: spacing.md,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    width: 80,
  },
  infoValue: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  bodyText: {
    ...typography.body1,
    color: colors.text,
    lineHeight: 24,
  },
  medicationItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  medicationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  medicationNumberText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '700',
  },
  medicationDetails: {
    flex: 1,
  },
  medicationName: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
  },
  medicationDosage: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  medicationTiming: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  signature: {
    alignItems: 'flex-end',
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  signatureText: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
  },
  signatureSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.large,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  actionText: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
});

export default PrescriptionDetailScreen;
