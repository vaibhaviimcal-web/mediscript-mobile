import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {colors, typography, spacing, borderRadius} from '../../constants/theme';
import {useApp} from '../../context/AppContext';
import GroqService from '../../services/api/GroqService';

const LoginScreen = () => {
  const navigation = useNavigation();
  const {setApiKey} = useApp();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      Alert.alert('Error', 'Please enter your Groq API key');
      return;
    }

    setIsLoading(true);

    try {
      // Set API key in service
      GroqService.setApiKey(apiKeyInput.trim());

      // Save to context
      await setApiKey(apiKeyInput.trim());

      Alert.alert('Success', 'API key saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{name: 'Main' as never}],
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  const openGroqConsole = () => {
    Alert.alert(
      'Get API Key',
      'Visit console.groq.com to get your free API key.\n\n1. Sign up/Login\n2. Go to API Keys\n3. Create new key\n4. Copy and paste here',
      [{text: 'OK'}]
    );
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🩺</Text>
            </View>
            <Text style={styles.title}>Welcome to MediScript</Text>
            <Text style={styles.subtitle}>
              Configure your Groq API key to get started
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Groq API Key</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Groq API key"
                  placeholderTextColor={colors.textLight}
                  value={apiKeyInput}
                  onChangeText={setApiKeyInput}
                  secureTextEntry={!showKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowKey(!showKey)}>
                  <Icon
                    name={showKey ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.helpButton}
              onPress={openGroqConsole}>
              <Icon name="help-circle" size={20} color={colors.surface} />
              <Text style={styles.helpText}>How to get API key?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSaveApiKey}
              disabled={isLoading}>
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save & Continue'}
              </Text>
              <Icon name="arrow-right" size={20} color={colors.surface} />
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Icon name="information" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.infoText}>
              Your API key is stored securely on your device and never shared
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    ...typography.h2,
    color: colors.surface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.surface,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  input: {
    flex: 1,
    ...typography.body1,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  eyeButton: {
    padding: spacing.md,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  helpText: {
    ...typography.body2,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: spacing.sm,
    flex: 1,
  },
});

export default LoginScreen;
