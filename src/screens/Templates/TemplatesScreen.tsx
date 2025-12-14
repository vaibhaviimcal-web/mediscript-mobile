import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {colors, typography, spacing, borderRadius, shadows} from '../../constants/theme';

const TEMPLATES = [
  {
    id: 1,
    name: 'Common Cold & Flu',
    category: 'Respiratory',
    symptoms: 'Runny nose, sneezing, mild fever, body ache for 2 days',
    diagnosis: 'Viral Upper Respiratory Tract Infection',
  },
  {
    id: 2,
    name: 'Fever (Viral)',
    category: 'General',
    symptoms: 'High fever 102°F, headache, weakness since yesterday',
    diagnosis: 'Acute Viral Fever',
  },
  {
    id: 3,
    name: 'Acute Gastroenteritis',
    category: 'Gastrointestinal',
    symptoms: 'Vomiting 4-5 times, loose stools, abdominal pain',
    diagnosis: 'Acute Gastroenteritis',
  },
  {
    id: 4,
    name: 'UTI',
    category: 'Urinary',
    symptoms: 'Burning urination, frequent urge, lower abdominal pain',
    diagnosis: 'Urinary Tract Infection',
  },
  {
    id: 5,
    name: 'Hypertension',
    category: 'Cardiovascular',
    symptoms: 'BP 150/95, headache, no chest pain',
    diagnosis: 'Essential Hypertension (New)',
  },
  {
    id: 6,
    name: 'Diabetes',
    category: 'Endocrine',
    symptoms: 'Fasting sugar 180 mg/dL, increased thirst, frequent urination',
    diagnosis: 'Type 2 Diabetes Mellitus (New)',
  },
  {
    id: 7,
    name: 'Acute Bronchitis',
    category: 'Respiratory',
    symptoms: 'Persistent cough with phlegm, chest congestion, mild fever',
    diagnosis: 'Acute Bronchitis',
  },
  {
    id: 8,
    name: 'Allergic Rhinitis',
    category: 'Respiratory',
    symptoms: 'Sneezing, watery eyes, nasal congestion, itchy nose',
    diagnosis: 'Allergic Rhinitis',
  },
  {
    id: 9,
    name: 'Migraine',
    category: 'Neurological',
    symptoms: 'Severe one-sided headache, nausea, light sensitivity',
    diagnosis: 'Migraine Headache',
  },
  {
    id: 10,
    name: 'Acid Reflux (GERD)',
    category: 'Gastrointestinal',
    symptoms: 'Heartburn, chest burning, sour taste in mouth',
    diagnosis: 'Gastroesophageal Reflux Disease',
  },
];

const TemplatesScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState(TEMPLATES);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredTemplates(TEMPLATES);
      return;
    }

    const filtered = TEMPLATES.filter(
      template =>
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.category.toLowerCase().includes(query.toLowerCase()) ||
        template.symptoms.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = (template: any) => {
    Alert.alert(
      'Apply Template',
      `Apply "${template.name}" template to prescription form?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Apply',
          onPress: () => {
            // Navigate to Prescription screen with template data
            navigation.navigate('Prescription' as never, {
              template: template.symptoms,
            } as never);
          },
        },
      ]
    );
  };

  const renderTemplate = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[styles.templateCard, shadows.small]}
      onPress={() => handleSelectTemplate(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.textSecondary} />
      </View>
      <Text style={styles.templateName}>{item.name}</Text>
      <Text style={styles.diagnosis}>{item.diagnosis}</Text>
      <Text style={styles.symptoms} numberOfLines={2}>
        {item.symptoms}
      </Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Icon name="file-document-outline" size={80} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No templates found</Text>
      <Text style={styles.emptySubtitle}>Try a different search term</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates..."
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

      {/* Templates List */}
      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplate}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  templateCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  templateName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  diagnosis: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  symptoms: {
    ...typography.body2,
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
  },
});

export default TemplatesScreen;
