// src/screens/lesson/components/ArrangeBlocks.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as haptic from '../../../utils/haptic';

export default function ArrangeBlocks({ problem, onSubmit, isSubmitting, colors }) {
  const blocks = problem.problem_data.blocks;
  const [order, setOrder] = useState(blocks.map((_, index) => index));

  const moveBlock = (fromIndex, toIndex) => {
    haptic.selectionFeedback();
    const newOrder = [...order];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setOrder(newOrder);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    // JSON 문자열로 변환하여 제출
    onSubmit(JSON.stringify(order));
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        블록을 올바른 순서로 배열하세요
      </Text>

      <View style={styles.blocksContainer}>
        {order.map((blockIndex, position) => (
          <View key={`${blockIndex}-${position}`} style={styles.blockWrapper}>
            <View style={styles.block}>
              <Text style={styles.blockNumber}>{position + 1}</Text>
              <Text style={styles.blockText}>{blocks[blockIndex]}</Text>
            </View>

            {/* 위로 이동 버튼 */}
            {position > 0 && (
              <TouchableOpacity
                style={styles.moveButton}
                onPress={() => moveBlock(position, position - 1)}
              >
                <Text style={styles.moveButtonText}>↑</Text>
              </TouchableOpacity>
            )}

            {/* 아래로 이동 버튼 */}
            {position < order.length - 1 && (
              <TouchableOpacity
                style={[styles.moveButton, styles.moveButtonDown]}
                onPress={() => moveBlock(position, position + 1)}
              >
                <Text style={styles.moveButtonText}>↓</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
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
  blocksContainer: {
    marginBottom: 24,
  },
  blockWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  block: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  blockNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  blockText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.text,
  },
  moveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  moveButtonDown: {
    marginLeft: 4,
  },
  moveButtonText: {
    color: '#fff',
    fontSize: 20,
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
