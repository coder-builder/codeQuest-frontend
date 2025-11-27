// src/screens/lesson/components/CopyCode.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function CopyCode({ problem, onSubmit, isSubmitting, colors }) {
  const [input, setInput] = useState('');

  const referenceCode = problem.problem_data.code_to_copy;

  // 코드를 파싱하여 구조 분석
  const codeStructure = useMemo(() => {
    // print("Hello, World!") 같은 패턴 파싱
    // 함수명(특수문자내용특수문자) 형태
    const match = referenceCode.match(/^(\w+)\((["'])(.*?)\2\)$/);

    if (match) {
      const [, functionName, quote, content] = match;
      return {
        type: 'function_call',
        functionName,
        quote,
        content,
        prefix: `${functionName}(${quote}`,
        suffix: `${quote})`
      };
    }

    // 기본적으로 전체 입력 방식
    return {
      type: 'full',
      content: referenceCode
    };
  }, [referenceCode]);

  const handleSubmit = () => {
    if (!input.trim() || isSubmitting) return;

    // 구조화된 입력인 경우 전체 코드 재구성
    let finalCode = input;
    if (codeStructure.type === 'function_call') {
      finalCode = `${codeStructure.prefix}${input}${codeStructure.suffix}`;
    }

    onSubmit(finalCode);
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        아래 코드를 정확히 따라 작성하세요
      </Text>

      {/* 참조 코드 */}
      <View style={styles.referenceCodeContainer}>
        <Text style={styles.referenceCodeLabel}>참조 코드</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{referenceCode}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>여기에 입력하세요</Text>

        {codeStructure.type === 'function_call' ? (
          <View style={styles.structuredInputContainer}>
            <View style={styles.codeStructureRow}>
              <Text style={styles.prefilledText}>{codeStructure.prefix}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  style={styles.inlineInput}
                  placeholder={codeStructure.content}
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
              <Text style={styles.prefilledText}>{codeStructure.suffix}</Text>
            </View>
            <Text style={styles.helpText}>
              💡 특수문자는 자동으로 입력됩니다. 내용만 입력하세요!
            </Text>
          </View>
        ) : (
          <TextInput
            value={input}
            onChangeText={setInput}
            multiline
            numberOfLines={6}
            style={styles.codeInput}
            placeholder="코드를 입력하세요..."
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        )}
      </View>

      {/* 입력 진행도 표시 */}
      {input && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>입력 진행</Text>
          <Text style={styles.progressText}>
            {codeStructure.type === 'function_call'
              ? `${input.length} / ${codeStructure.content.length} 문자`
              : `${input.length} / ${referenceCode.length} 문자`
            }
          </Text>
        </View>
      )}

      {/* 안내 메시지 */}
      {(problem.problem_data.case_sensitive || problem.problem_data.whitespace_sensitive) && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {problem.problem_data.case_sensitive && '⚠️ 대소문자를 구분합니다\n'}
            {problem.problem_data.whitespace_sensitive && '⚠️ 공백도 정확히 입력해야 합니다'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!input.trim() || isSubmitting) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!input.trim() || isSubmitting}
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
  referenceCodeContainer: {
    marginBottom: 24,
  },
  referenceCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.text,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  // 전체 입력 스타일
  codeInput: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.text,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  // 구조화된 입력 스타일
  structuredInputContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  codeStructureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  prefilledText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.textSecondary,
    fontWeight: '600',
  },
  inputWrapper: {
    flex: 1,
    minWidth: 100,
  },
  inlineInput: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.primary,
    fontWeight: 'bold',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  helpText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  // 진행도 표시
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: colors.warning + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  infoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
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
