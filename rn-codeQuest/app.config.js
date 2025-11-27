export default {
  expo: {
    name: "CodeQuest",
    slug: "rn-codeQuest",
    owner: "codequest-team",
    scheme: "rn-codequest",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: "com.codequest3.codequest",
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [`kakao${process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY}`]
          }
        ],
        LSApplicationQueriesSchemes: [
          "kakaokompassauth",
          "kakaolink",
          `kakao${process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY}`
        ],
        KAKAO_APP_KEY: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY
      }
    },
    android: {
      package: "com.codequest3.codequest",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "rn-codequest"
            }
          ],
          category: [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
    },
    plugins: [
      [
        "@react-native-seoul/kakao-login",
        {
          kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
          kotlinVersion: "2.0.0"
        }
      ]
    ],
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "d6e90256-0ba5-42cf-ba91-718be4c95f66"
      }
    }
  }
};
