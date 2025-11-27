// src/screens/lesson/components/WordBank.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as haptic from '../../../utils/haptic';

export default function WordBank({ problem, onSubmit, isSubmitting, colors }) {
  const [blanks, setBlanks] = useState([]);

  const handleSelectOption = (blankIndex, option) => {
    haptic.selectionFeedback();
    const newBlanks = [...blanks];
    newBlanks[blankIndex] = option;
    setBlanks(newBlanks);
  };

  const handleSubmit = () => {
    if (blanks.length !== problem.problem_data.blanks.length || isSubmitting) return;
    // JSON 문자열로 변환하여 제출
    onSubmit(JSON.stringify(blanks));
  };

  const renderTemplate = () => {
    const template = problem.problem_data.template;
    const parts = template.split('___');

    return (
      <View style={styles.templateContainer}>
        {parts.map((part, index) => (
          <View key={index} style={styles.templateRow}>
            <Text style={styles.templateText}>{part}</Text>
            {index < parts.length - 1 && (
              <View style={styles.blankContainer}>
                <Text style={styles.blankText}>
                  {blanks[index] || '_____'}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* 템플릿 표시 */}
      {renderTemplate()}

      {/* 빈칸 선택 영역 */}
      <ScrollView style={styles.blanksScroll} showsVerticalScrollIndicator={false}>
        {problem.problem_data.blanks.map((blank, blankIndex) => (
          <View key={blankIndex} style={styles.blankSection}>
            <Text style={styles.blankLabel}>빈칸 {blankIndex + 1}</Text>
            <View style={styles.optionsContainer}>
              {blank.options.map((option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    blanks[blankIndex] === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleSelectOption(blankIndex, option)}
                >
                  <Text style={[
                    styles.optionText,
                    blanks[blankIndex] === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (blanks.length !== problem.problem_data.blanks.length || isSubmitting) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={blanks.length !== problem.problem_data.blanks.length || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? '제출 중...' : '제출하기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    width: '100%',
  },
  templateContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  templateText: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: colors.text,
  },
  blankContainer: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  blankText: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: colors.primary,
    fontWeight: 'bold',
  },
  blanksScroll: {
    marginBottom: 20,
  },
  blankSection: {
    marginBottom: 20,
  },
  blankLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
