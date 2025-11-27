// src/screens/lesson/components/MultipleChoice.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as haptic from '../../../utils/haptic';

export default function MultipleChoice({ problem, onSubmit, isSubmitting, colors }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (choice) => {
    haptic.selectionFeedback();
    setSelected(choice);
  };

  const handleSubmit = () => {
    if (!selected || isSubmitting) return;
    onSubmit(selected);
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{problem.problem_data.question}</Text>

      <View style={styles.choicesContainer}>
        {problem.problem_data.choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              selected === choice && styles.choiceButtonSelected
            ]}
            onPress={() => handleSelect(choice)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.choiceRadio,
              selected === choice && styles.choiceRadioSelected
            ]}>
              {selected === choice && <View style={styles.choiceRadioDot} />}
            </View>
            <Text style={[
              styles.choiceText,
              selected === choice && styles.choiceTextSelected
            ]}>
              {choice}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!selected || isSubmitting) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!selected || isSubmitting}
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
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
    lineHeight: 28,
  },
  choicesContainer: {
    marginBottom: 24,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  choiceButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  choiceRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceRadioSelected: {
    borderColor: colors.primary,
  },
  choiceRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  choiceTextSelected: {
    color: colors.primary,
    fontWeight: '600',
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
