/**
 * ============================================================================
 * 랭킹 시스템 API 서비스
 * ============================================================================
 */

import api from "../../apis/api";

const rankingService = {
  // 내 리그 랭킹 조회
  getMyLeagueRanking: async () => {
    try {
      const response = await api.get('rank/my-league/');
      return response;
    } catch (error) {
      console.error('내 리그 랭킹 조회 실패:', error);
      throw error;
    }
  },

  // 전체 랭킹 조회
  getGlobalRankings: async (limit = 100, offset = 0) => {
    try {
      const response = await api.get('rank/global/', {
        limit,
        offset,
      });
      return response;
    } catch (error) {
      console.error('전체 랭킹 조회 실패:', error);
      throw error;
    }
  },

  // 티어별 랭킹 조회
  getTierRankings: async (tier, limit = 50, offset = 0) => {
    try {
      const response = await api.get('rank/tier/${tier}/', {
        limit,
        offset,
      });
      return response;
    } catch (error) {
      console.error('티어별 랭킹 조회 실패:', error);
      throw error;
    }
  },

  // 내 랭킹 히스토리 조회
  getMyRankingHistory: async (limit = 10) => {
    try {
      const response = await api.get('rank/my-history/', {
        limit,
      });
      return response;
    } catch(error) {
      console.error('랭킹 히스토리 조회 실패:', error);
      throw error;
    }
  },

  // 내 순회 정보 조회 (간단)
  getMyRankInfo: async () => {
    try {
      const response = await api.get('rank/me/');
      return response;
    } catch (errpr) {
      console.error('내 순위 정보 조회 실패:', error);
      throw error;
    }
  },

  // EXP 추가 (문제 풀이 후)
  addExp: async (expAmount, expType = 'coding') => {
    try {
      const response = await api.post('rank/add-exp/', {
        exp_amount: expAmount,
        exp_type: expType,
      });
      return response;
    } catch (error) {
      console.error('EXP 추가 실패:', error);
      throw error;
    }
  },

  // 티어 설정 정보 조회
  getTierConfigs: async () => {
    try {
      const response = await api.get('rank/tiers/');
      return response;
    } catch (error) {
      console.error('티어 설정 조회 실패:', error);
      throw error;
    }
  },
};

export default rankingService;