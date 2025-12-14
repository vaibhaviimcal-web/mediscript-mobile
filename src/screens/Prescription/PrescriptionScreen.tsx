import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {colors, typography, spacing, borderRadius, shadows} from '../../constants/theme';
import {useApp} from '../../context/AppContext';
import VoiceService from '../../services/voice/VoiceService';
import GroqService from '../../services/api/GroqService';
import {savePrescription, incrementVoiceCommands} from '../../services/database/DatabaseService';

const PrescriptionScreen = () => {
  const navigation = useNavigation();
  const {apiKey, isOnline} = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    symptoms: '',
  });

  const [prescription, setPrescription] = useState<any>(null);

  const handleVoiceInput = async (field: string, timeout: number = 5000) => {
    try {
      setIsListening(true);
      setActiveField(field);

      await VoiceService.startListening(
        async (text: string) => {
          console.log('Voice input:', text);

          if (field === 'symptoms') {
            // Extract patient data from natural language
            const extracted = VoiceService.extractPatientData(text);
            
            setFormData(prev => ({
              patientName: extracted.name || prev.patientName,
              patientAge: extracted.age?.toString() || prev.patientAge,
              patientGender: extracted.gender || prev.patientGender,
              symptoms: extracted.symptoms || text,
            }));
          } else {
            setFormData(prev => ({...prev, [field]: text}));
          }

          await incrementVoiceCommands();
          setIsListening(false);
          setActiveField(null);
        },
        (error: string) => {
          console.error('Voice error:', error);
          Alert.alert('Voice Error', error);
          setIsListening(false);
          setActiveField(null);
        },
        timeout
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setIsListening(false);
      setActiveField(null);
    }
  };

  const handleGeneratePrescription = async () => {
    // Validation
    if (!formData.patientName.trim()) {
      Alert.alert('Error', 'Please enter patient name');
      return;
    }
    if (!formData.patientAge.trim()) {
      Alert.alert('Error', 'Please enter patient age');
      return;
    }
    if (!formData.patientGender) {
      Alert.alert('Error', 'Please select gender');
      return;
    }
    if (!formData.symptoms.trim()) {
      Alert.alert('Error', 'Please enter symptoms');
      return;
    }

    if (!isOnline) {
      Alert.alert('Offline', 'Internet connection required for AI prescription generation');
      return;
    }

    if (!apiKey) {
      Alert.alert('Error', 'API key not configured. Please go to Settings.');
      return;
    }

    setIsGenerating(true);

    try {
      GroqService.setApiKey(apiKey);

      const result = await GroqService.generatePrescription({
        patientName: formData.patientName,
        patientAge: parseInt(formData.patientAge),
        patientGender: formData.patientGender,
        symptoms: formData.symptoms,
      });

      setPrescription(result);
      Alert.alert('Success', 'Prescription generated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate prescription');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePrescription = async () => {
    if (!prescription) return;

    try {
      const prescriptionId = await savePrescription({
        patient_name: formData.patientName,
        patient_age: parseInt(formData.patientAge),
        patient_gender: formData.patientGender,
        symptoms: formData.symptoms,
        diagnosis: prescription.diagnosis,
        medications: prescription.medications,
        advice: prescription.advice,
        follow_up: prescription.followUp,
      });

      Alert.alert('Success', 'Prescription saved successfully!', [
        {
          text: 'View',
          onPress: () => {
            navigation.navigate('PrescriptionDetail' as never, {
              prescriptionId,
            } as never);
          },
        },
        {text: 'OK'},
      ]);

      // Reset form
      setFormData({
        patientName: '',
        patientAge: '',
        patientGender: '',
        symptoms: '',
      });
      setPrescription(null);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save prescription');
    }
  };

  const VoiceButton = ({field, timeout = 5000}: {field: string; timeout?: number}) => (
    <TouchableOpacity
      style={[
        styles.voiceButton,
        isListening && activeField === field && styles.voiceButtonActive,
      ]}
      onPress={() => handleVoiceInput(field, timeout)}
      disabled={isListening}>
      <Icon
        name={isListening && activeField === field ? 'microphone' : 'microphone-outline'}
        size={20}
        color={isListening && activeField === field ? colors.error : colors.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>New Prescription</Text>
          <Text style={styles.subtitle}>Fill patient details or use voice input</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Patient Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patient Name *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter patient name"
                placeholderTextColor={colors.placeholder}
                value={formData.patientName}
                onChangeText={text => setFormData({...formData, patientName: text})}
              />
              <VoiceButton field="patientName" timeout={3000} />
            </View>
          </View>

          {/* Age & Gender */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>Age (Years) *</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor={colors.placeholder}
                  value={formData.patientAge}
                  onChangeText={text => setFormData({...formData, patientAge: text})}
                  keyboardType="numeric"
                />
                <VoiceButton field="patientAge" timeout={2000} />
              </View>
            </View>

            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.genderButtons}>
                {['Male', 'Female', 'Other'].map(gender => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      formData.patientGender === gender && styles.genderButtonActive,
                    ]}
                    onPress={() => setFormData({...formData, patientGender: gender})}>
                    <Text
                      style={[
                        styles.genderButtonText,
                        formData.patientGender === gender && styles.genderButtonTextActive,
                      ]}>
                      {gender[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Symptoms */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Symptoms & Complaints *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe symptoms..."
                placeholderTextColor={colors.placeholder}
                value={formData.symptoms}
                onChangeText={text => setFormData({...formData, symptoms: text})}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <VoiceButton field="symptoms" timeout={10000} />
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={handleGeneratePrescription}
            disabled={isGenerating}>
            {isGenerating ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <>
                <Icon name="magic-staff" size={20} color={colors.surface} />
                <Text style={styles.generateButtonText}>Generate AI Prescription</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Prescription Preview */}
        {prescription && (
          <View style={[styles.preview, shadows.medium]}>
            <Text style={styles.previewTitle}>Prescription Preview</Text>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Diagnosis:</Text>
              <Text style={styles.previewText}>{prescription.diagnosis}</Text>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Medications:</Text>
              {prescription.medications.map((med: any, index: number) => (
                <View key={index} style={styles.medicationItem}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDetails}>
                    {med.dosage} • {med.duration} • {med.timing}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Advice:</Text>
              <Text style={styles.previewText}>{prescription.advice}</Text>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Follow-up:</Text>
              <Text style={styles.previewText}>{prescription.followUp}</Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSavePrescription}>
              <Icon name="content-save" size={20} color={colors.surface} />
              <Text style={styles.saveButtonText}>Save Prescription</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
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
  form: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body1,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  voiceButton: {
    padding: spacing.md,
  },
  voiceButtonActive: {
    backgroundColor: colors.error + '20',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonText: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
  },
  genderButtonTextActive: {
    color: colors.surface,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    ...shadows.medium,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    ...typography.button,
    color: colors.surface,
  },
  preview: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  previewTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  previewSection: {
    marginBottom: spacing.lg,
  },
  previewLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  previewText: {
    ...typography.body1,
    color: colors.text,
  },
  medicationItem: {
    marginBottom: spacing.md,
    paddingLeft: spacing.md,
  },
  medicationName: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
  },
  medicationDetails: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.surface,
  },
});

export default PrescriptionScreen;
