export default class WebAdapter {
  // ====== 보안 저장소 (async - 모바일 호환성 위해) ======
  async setSecure(key, data){
    localStorage.setItem(`secure_${key}`, JSON.stringify(data));
    // Promise로 반환해서 모바일과 호환
  }

  async getSecure(key){
    const data = localStorage.getItem(`secure_${key}`);
    return data ? JSON.parse(data) : null;
  }

  async removeSecure(key){
    localStorage.removeItem(`secure_${key}`);
  }

  // ====== 일반 저장소 (동기 처리 - 성능 최적화) ======
  setData(key, value) {
    const processedValue = typeof value === 'object' 
    ? JSON.stringify(value) 
    : value; 

    localStorage.setItem(key, processedValue);
  }

  getData(key, defaultValue = null ) {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;

    try {
      return JSON.parse(value); // 객체면 파싱
    } catch {
      return value; // 문자열이면 그대로 반환
    }
  }

  removeData(key) {
    localStorage.removeItem(key);
  }
};