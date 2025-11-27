// src/screens/lesson/components/Matching.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as haptic from '../../../utils/haptic';

export default function Matching({ problem, onSubmit, isSubmitting, colors }) {
  const [pairs, setPairs] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);

  const handleLeftSelect = (item) => {
    haptic.selectionFeedback();
    setSelectedLeft(item);
  };

  const handleRightSelect = (item) => {
    if (!selectedLeft) return;

    haptic.selectionFeedback();
    const newPairs = { ...pairs };
    newPairs[selectedLeft] = item;
    setPairs(newPairs);
    setSelectedLeft(null);
  };

  const handleRemovePair = (leftItem) => {
    haptic.selectionFeedback();
    const newPairs = { ...pairs };
    delete newPairs[leftItem];
    setPairs(newPairs);
  };

  const handleSubmit = () => {
    if (Object.keys(pairs).length !== problem.problem_data.left_items.length || isSubmitting) return;
    // JSON 문자열로 변환하여 제출
    onSubmit(JSON.stringify(pairs));
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        왼쪽과 오른쪽 항목을 연결하세요
      </Text>

      <View style={styles.matchingContainer}>
        {/* 왼쪽 항목 */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>항목</Text>
          {problem.problem_data.left_items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                styles.leftItem,
                selectedLeft === item && styles.itemSelected,
                pairs[item] && styles.itemMatched
              ]}
              onPress={() => pairs[item] ? handleRemovePair(item) : handleLeftSelect(item)}
            >
              <Text style={[
                styles.itemText,
                (selectedLeft === item || pairs[item]) && styles.itemTextSelected
              ]}>
                {item}
              </Text>
              {pairs[item] && (
                <View style={styles.matchedIndicator}>
                  <Text style={styles.matchedText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 연결선 영역 */}
        <View style={styles.connectionArea}>
          {Object.keys(pairs).length > 0 && (
            <Text style={styles.connectionCount}>
              {Object.keys(pairs).length}/{problem.problem_data.left_items.length}
            </Text>
          )}
        </View>

        {/* 오른쪽 항목 */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>답</Text>
          {problem.problem_data.right_items.map((item, index) => {
            const isUsed = Object.values(pairs).includes(item);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.item,
                  styles.rightItem,
                  isUsed && styles.itemMatched
                ]}
                onPress={() => !isUsed && handleRightSelect(item)}
                disabled={!selectedLeft || isUsed}
              >
                <Text style={[
                  styles.itemText,
                  isUsed && styles.itemTextSelected
                ]}>
                  {item}
                </Text>
                {isUsed && (
                  <View style={styles.matchedIndicator}>
                    <Text style={styles.matchedText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (Object.keys(pairs).length !== problem.problem_data.left_items.length || isSubmitting) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={Object.keys(pairs).length !== problem.problem_data.left_items.length || isSubmitting}
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
  instruction: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  matchingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  connectionArea: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionCount: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  item: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftItem: {
    marginRight: 4,
  },
  rightItem: {
    marginLeft: 4,
  },
  itemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  itemMatched: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  itemTextSelected: {
    fontWeight: 'bold',
  },
  matchedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchedText: {
    color: '#fff',
    fontSize: 16,
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
