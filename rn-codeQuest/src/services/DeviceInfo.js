// import DeviceInfo from "react-native-device-info";

import { Platform } from 'react-native';
import Storage from '../services/storages'; // storages/index.js

// 네이티브 환경에서만 DeviceInfo 모듈 로드
let DeviceInfo = null;
if (Platform.OS !== 'web') {
  try {
    DeviceInfo = require('react-native-device-info');
  } catch (error) {
    console.warn('DeviceInfo 모듈 없음');
  }
}

export class DeviceInfoService {

  // 플랫폼별 디바이스 정보 가져오기
  static async getDeviceInfo() {
    if (Platform.OS === 'web') {
      return await this.getWebDeviceInfo();
    } else {
      return await this.getNativeDeviceInfo();
    }
  }

  // 웹 환경 디바이스 정보
  static async getWebDeviceInfo() {
    try {
      // 웹에서 고유 ID 가져오기/생성
      const deviceId = await this.getOrCreateWebDeviceId();

      // 웹에서 디바이스 이름 생성
      const deviceName = this.getWebDeviceName();

      const deviceInfo = {
        deviceId,
        deviceName,
        model: this.getWebModel(),
        brand: this.getWebBrand(),
        systemName: this.getWebSystemName(),
        systemVersion: this.getWebSystemVersion(),
        appVersion: 'WebApp v1.0.0',
        isTablet: this.isWebTablet(),
        isEmulator: false,
        platform: 'web',
      };

      return deviceInfo;

    } catch (error) {
      console.error('웹 디바이스 정보 조회 실패:', error);
      return null;
    }
  }

  // 네이티브 환경용 디바이스 정보
  static async getNativeDeviceInfo() {
    try {
      const [deviceId, deviceName] = await Promise.all([
        DeviceInfo.getUniqueId(),
        DeviceInfo.getDeviceName()
      ]);

      return {
        deviceId,
        deviceName,
        model: DeviceInfo.getModel(),
        brand: DeviceInfo.getBrand(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
        appVersion: DeviceInfo.getVersion(),
        isTablet: DeviceInfo.isTablet(),
        isEmulator: await DeviceInfo.isEmulator(),
        platform: Platform.OS,
      };
    } catch (error) {
      console.error('디바이스 정보 조회 실패:', error);
      return null;
    }
  }

  // 웹용 고유 디바이스 ID 생성/조회
  static async getOrCreateWebDeviceId() {
    try {
      let deviceId = await Storage.getData('WEB_DEVICE_ID');
      if (!deviceId) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        deviceId = `web_${timestamp}_${random}`;

        await Storage.setData('WEB_DEVICE_ID', deviceId);

      }
      return deviceId;
      
    } catch (error) {
      console.error('웹 디바이스 ID 생성/조회 실패:', error);
      return null;
    }
  }

  // 웹용 디바이스 이름 가져오기
  static getWebDeviceName() {
    try {
      const userAgent = navigator.userAgent;

      if (userAgent.includes('Chrome')) return 'Chrome Browser';
      if (userAgent.includes('Firefox')) return 'Firefox Browser';
      if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari Browser';
      if (userAgent.includes('Edge')) return 'Edge Browser';

      return 'Web Browser';
    } catch (error) {
      console.error('웹 디바이스 이름 조회 실패:', error);
      return null;
    }
  }

  // 웹용 모델명
  static getWebModel() {
    try {
      const userAgent = navigator.userAgent;
      
      if (userAgent.includes('Windows')) return 'Windows PC';
      if (userAgent.includes('Macintosh')) return 'Mac';
      if (userAgent.includes('Linux')) return 'Linux PC';
      if (userAgent.includes('Android')) return 'Android Device';
      if (userAgent.includes('iPhone')) return 'iPhone';
      if (userAgent.includes('iPad')) return 'iPad';
      
      return 'Web Device';
    } catch (error) {
      return 'Unknown';
    }
  }
  
  // 웹용 브랜드
  static getWebBrand() {
    try {
      const userAgent = navigator.userAgent;
      
      if (userAgent.includes('Windows')) return 'Microsoft';
      if (userAgent.includes('Macintosh') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'Apple';
      if (userAgent.includes('Android')) return 'Google';
      if (userAgent.includes('Linux')) return 'Linux';
      
      return 'Browser';
    } catch (error) {
      return 'Unknown';
    }
  }

  // 웹용 운영체제
  static getWebSystemName() {
    try {
      const userAgent = navigator.userAgent;
      
      if (userAgent.includes('Windows')) return 'Windows';
      if (userAgent.includes('Macintosh')) return 'macOS';
      if (userAgent.includes('Linux')) return 'Linux';
      if (userAgent.includes('Android')) return 'Android';
      if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
      
      return 'Web';
    } catch (error) {
      return 'Web';
    }
  }

  static getWebSystemVersion() {
    return 'Unknown';
  }
  
  static isWebTablet() {
    try {
      const userAgent = navigator.userAgent;
      return userAgent.includes('iPad') || 
             (userAgent.includes('Android') && !userAgent.includes('Mobile'));
    } catch (error) {
      return false;
    }
  }
}

