import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, typography, spacing, borderRadius, shadows} from '../../constants/theme';
import {useApp} from '../../context/AppContext';

const SettingsScreen = () => {
  const {apiKey, setApiKey, clinicInfo, setClinicInfo} = useApp();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey || '');
  const [formData, setFormData] = useState(clinicInfo);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      Alert.alert('Error', 'Please enter API key');
      return;
    }

    try {
      await setApiKey(apiKeyInput.trim());
      Alert.alert('Success', 'API key saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSaveClinicInfo = async () => {
    try {
      await setClinicInfo(formData);
      Alert.alert('Success', 'Clinic information saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const SettingSection = ({title, children}: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({label, value, onChangeText, placeholder, secure = false}: any) => (
    <View style={styles.settingItem}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure && !showApiKey}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your app preferences</Text>
      </View>

      {/* API Configuration */}
      <SettingSection title="API Configuration">
        <View style={styles.settingItem}>
          <Text style={styles.label}>Groq API Key</Text>
          <View style={styles.apiKeyContainer}>
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Enter your Groq API key"
              placeholderTextColor={colors.placeholder}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              secureTextEntry={!showApiKey}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowApiKey(!showApiKey)}>
              <Icon
                name={showApiKey ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
            <Text style={styles.saveButtonText}>Save API Key</Text>
          </TouchableOpacity>
        </View>
      </SettingSection>

      {/* Clinic Branding */}
      <SettingSection title="Clinic Branding">
        <SettingItem
          label="Clinic Name"
          value={formData.name}
          onChangeText={(text: string) => setFormData({...formData, name: text})}
          placeholder="MediScript AI"
        />
        <SettingItem
          label="Tagline"
          value={formData.tagline}
          onChangeText={(text: string) => setFormData({...formData, tagline: text})}
          placeholder="Enterprise Medical Platform"
        />
        <SettingItem
          label="Doctor Name"
          value={formData.doctorName}
          onChangeText={(text: string) => setFormData({...formData, doctorName: text})}
          placeholder="Dr. John Doe"
        />
        <SettingItem
          label="Credentials"
          value={formData.credentials}
          onChangeText={(text: string) => setFormData({...formData, credentials: text})}
          placeholder="MBBS, MD"
        />
        <SettingItem
          label="Registration Number"
          value={formData.regNumber}
          onChangeText={(text: string) => setFormData({...formData, regNumber: text})}
          placeholder="MCI-12345"
        />
        <SettingItem
          label="Phone"
          value={formData.phone}
          onChangeText={(text: string) => setFormData({...formData, phone: text})}
          placeholder="+91 98765 43210"
        />
        <SettingItem
          label="Email"
          value={formData.email}
          onChangeText={(text: string) => setFormData({...formData, email: text})}
          placeholder="doctor@clinic.com"
        />
        <SettingItem
          label="Address"
          value={formData.address}
          onChangeText={(text: string) => setFormData({...formData, address: text})}
          placeholder="123 Medical Street"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveClinicInfo}>
          <Text style={styles.saveButtonText}>Save Clinic Info</Text>
        </TouchableOpacity>
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="Notifications">
        <View style={styles.switchItem}>
          <View>
            <Text style={styles.switchLabel}>Push Notifications</Text>
            <Text style={styles.switchSubtext}>
              Receive reminders and alerts
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{false: colors.border, true: colors.primary}}
            thumbColor={colors.surface}
          />
        </View>
      </SettingSection>

      {/* About */}
      <SettingSection title="About">
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Build</Text>
          <Text style={styles.aboutValue}>1</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Developer</Text>
          <Text style={styles.aboutValue}>Kumar Vaibhav</Text>
        </View>
      </SettingSection>

      <View style={{height: spacing.xxl}} />
    </ScrollView>
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
  section: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  settingItem: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body1,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  apiKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  eyeButton: {
    padding: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.small,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.surface,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
  },
  switchSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aboutLabel: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  aboutValue: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
  },
});

export default SettingsScreen;
