// src/screens/lesson/components/Coding.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function Coding({ problem, onSubmit, isSubmitting, colors }) {
  const [code, setCode] = useState(problem.initial_code || '');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Judge0 연동은 추후 구현 예정
  const handleRun = async () => {
    setIsRunning(true);
    // TODO: Judge0 API 연동
    // const results = await problemAPI.executeCode(problem.id, code);
    // setTestResults(results);

    // 임시 응답
    setTimeout(() => {
      setTestResults([
        { passed: true, input: '2000', expected_output: '24', actual_output: '24' },
      ]);
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (!code.trim() || isSubmitting) return;
    // 실제로는 Judge0 결과를 함께 제출
    onSubmit(code);
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.instruction}>
        요구사항에 맞는 프로그램을 작성하세요
      </Text>

      {/* 코드 에디터 */}
      <View style={styles.editorContainer}>
        <Text style={styles.editorLabel}>코드 입력</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          multiline
          numberOfLines={15}
          style={styles.codeInput}
          placeholder="코드를 작성하세요..."
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      {/* 테스트 케이스 */}
      {problem.test_cases && problem.test_cases.length > 0 && (
        <View style={styles.testCasesContainer}>
          <Text style={styles.testCasesLabel}>테스트 케이스</Text>
          {problem.test_cases
            .filter(tc => !tc.is_hidden)
            .map((testCase, index) => (
              <View key={index} style={styles.testCase}>
                <View style={styles.testCaseHeader}>
                  <Text style={styles.testCaseTitle}>테스트 {index + 1}</Text>
                </View>
                <View style={styles.testCaseBody}>
                  <View style={styles.testCaseRow}>
                    <Text style={styles.testCaseLabel}>입력</Text>
                    <Text style={styles.testCaseValue}>
                      {testCase.input_data || '없음'}
                    </Text>
                  </View>
                  <View style={styles.testCaseRow}>
                    <Text style={styles.testCaseLabel}>예상 출력</Text>
                    <Text style={styles.testCaseValue}>
                      {testCase.expected_output}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          {problem.test_cases.some(tc => tc.is_hidden) && (
            <Text style={styles.hiddenTestNote}>
              ⚠️ 숨겨진 테스트 케이스가 있습니다
            </Text>
          )}
        </View>
      )}

      {/* 실행 결과 */}
      {testResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsLabel}>실행 결과</Text>
          {testResults.map((result, index) => (
            <View
              key={index}
              style={[
                styles.resultItem,
                result.passed ? styles.resultPass : styles.resultFail
              ]}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultStatus}>
                  {result.passed ? '✓ 통과' : '✗ 실패'}
                </Text>
                <Text style={styles.resultIndex}>테스트 {index + 1}</Text>
              </View>
              {result.input && (
                <Text style={styles.resultDetailText}>
                  입력: {result.input}
                </Text>
              )}
              <View style={styles.resultOutputs}>
                <View style={styles.resultOutputItem}>
                  <Text style={styles.resultOutputLabel}>예상</Text>
                  <Text style={styles.resultOutputValue}>
                    {result.expected_output}
                  </Text>
                </View>
                <View style={styles.resultOutputItem}>
                  <Text style={styles.resultOutputLabel}>실제</Text>
                  <Text style={[
                    styles.resultOutputValue,
                    !result.passed && styles.resultOutputError
                  ]}>
                    {result.actual_output}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 버튼 */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.buttonDisabled]}
          onPress={handleRun}
          disabled={isRunning}
        >
          <Text style={styles.runButtonText}>
            {isRunning ? '실행 중...' : '▶ 실행'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!code.trim() || isSubmitting) && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!code.trim() || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
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
  editorContainer: {
    marginBottom: 20,
  },
  editorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  codeInput: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    fontSize: 14,
    fontFamily: 'monospace',
    color: colors.text,
    minHeight: 300,
    textAlignVertical: 'top',
  },
  testCasesContainer: {
    marginBottom: 20,
  },
  testCasesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  testCase: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  testCaseHeader: {
    backgroundColor: colors.surfaceVariant,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  testCaseTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  testCaseBody: {
    padding: 12,
  },
  testCaseRow: {
    marginBottom: 8,
  },
  testCaseLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  testCaseValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: colors.text,
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 6,
  },
  hiddenTestNote: {
    fontSize: 13,
    color: colors.warning,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resultItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  resultPass: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success,
  },
  resultFail: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  resultIndex: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  resultDetailText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resultOutputs: {
    flexDirection: 'row',
    gap: 12,
  },
  resultOutputItem: {
    flex: 1,
  },
  resultOutputLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultOutputValue: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: colors.text,
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 6,
  },
  resultOutputError: {
    color: colors.error,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  runButton: {
    flex: 1,
    backgroundColor: colors.info,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  runButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
