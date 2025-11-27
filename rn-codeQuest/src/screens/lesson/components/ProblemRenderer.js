// src/screens/lesson/components/ProblemRenderer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultipleChoice from './MultipleChoice';
import WordBank from './WordBank';
import ArrangeBlocks from './ArrangeBlocks';
import Matching from './Matching';
import CopyCode from './CopyCode';
import FillCode from './FillCode';
import Coding from './Coding';

export default function ProblemRenderer({ problem, onSubmit, isSubmitting, colors }) {
  if (!problem) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>문제를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const props = { problem, onSubmit, isSubmitting, colors };

  switch (problem.problem_type) {
    case 'multiple_choice':
      return <MultipleChoice {...props} />;

    case 'word_bank':
      return <WordBank {...props} />;

    case 'arrange_blocks':
      return <ArrangeBlocks {...props} />;

    case 'matching':
      return <Matching {...props} />;

    case 'copy_code':
      return <CopyCode {...props} />;

    case 'fill_code':
      return <FillCode {...props} />;

    case 'coding':
      return <Coding {...props} />;

    default:
      return (
        <View style={styles.container}>
          <Text style={{ color: colors.error }}>
            지원하지 않는 문제 유형입니다: {problem.problem_type}
          </Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
});
