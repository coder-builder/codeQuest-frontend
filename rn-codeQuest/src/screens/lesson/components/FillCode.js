// src/screens/lesson/components/FillCode.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function FillCode({ problem, onSubmit, isSubmitting, colors }) {
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
        { passed: true, input: '', expected_output: '8', actual_output: '8' },
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
        코드의 빈칸을 채워 문제를 해결하세요
      </Text>

      {/* 코드 에디터 */}
      <View style={styles.editorContainer}>
        <Text style={styles.editorLabel}>코드 입력</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          multiline
          numberOfLines={12}
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
                <Text style={styles.testCaseText}>
                  입력: {testCase.input_data || '없음'}
                </Text>
                <Text style={styles.testCaseText}>
                  예상 출력: {testCase.expected_output}
                </Text>
              </View>
            ))}
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
              <Text style={styles.resultText}>
                {result.passed ? '✓ 통과' : '✗ 실패'}
              </Text>
              {!result.passed && (
                <>
                  <Text style={styles.resultDetailText}>
                    예상: {result.expected_output}
                  </Text>
                  <Text style={styles.resultDetailText}>
                    실제: {result.actual_output}
                  </Text>
                </>
              )}
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
    minHeight: 250,
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  testCaseText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: colors.text,
    marginBottom: 4,
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  resultPass: {
    backgroundColor: colors.success + '20',
    borderLeftColor: colors.success,
  },
  resultFail: {
    backgroundColor: colors.error + '20',
    borderLeftColor: colors.error,
  },
  resultText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  resultDetailText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: colors.textSecondary,
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
