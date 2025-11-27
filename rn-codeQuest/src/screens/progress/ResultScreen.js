import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import api from '../../apis/api';

const ResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    worldName, stageNumber, lessonNumber,
    problemsSolved, expEarned, studyTimeMinutes,
    correctAnswers, totalAttempts
  } = route.params;

  useEffect(() => {
    // 레슨 완료 기록
    
  }, []);

  const recordLessonCompletion = async () => {
    try {
      const response = await api.post('/progress/complete-lesson/', {
        worldName,
        stageNumber,
        lessonNumber,
        problemsSolved,
        expEarned,
        studyTimeMinutes,
        correctAnswers,
        totalAttempts
      })

      const result = await response;

      if (result.success) {
        setStreakData(result.result.streak);
        setTotalExp(result.result.totalExp);

        // 추가 작업 수행 (예: 주간 리그 순위 변동 등)
      }
    } catch (error) {
      console.error('레슨 완료 기록 중 오류 발생:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>레슨 완료! 🎉</Text>
      <Text>획득 EXP: {expEarned}</Text>
      <Text>연속 학습: {streakData}일</Text>
      <Text>정답률: {((correctAnswers / totalAttempts) * 100).toFixed(1)}%</Text>
      
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text>다음 레슨으로</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ResultScreen

const styles = StyleSheet.create({})