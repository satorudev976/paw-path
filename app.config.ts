import { ConfigContext, ExpoConfig } from "expo/config";

const env = process.env.APP_ENV ?? "development";
const isProd = env === "production";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,

    name: isProd ? "PawPath" : "PawPath Dev",
    slug: "paw-path",
    version: "1.0.0",

    orientation: "portrait",
    icon: "./assets/images/icon.png",

    scheme: "pawpath",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      locales: {
        ja: {
          CFBundleDisplayName: "ぱうぱす",
        },
      },
      supportsTablet: true,
      bundleIdentifier: "com.jp.pripri.pawpath",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "散歩ルートを正確に記録するため、アプリ使用中の位置情報へのアクセスを許可してください。",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "散歩中に継続的にルートを記録するため、バックグラウンドでの位置情報へのアクセスを許可してください。これにより、画面をオフにしても正確な散歩記録が可能になります。位置情報は散歩記録中のみ使用され、記録終了後は即座に停止します。",
        UIBackgroundModes: ["location"],
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              "pawpath",
              "1079866305602-vsc5ecoo9rglrgh1e3d5ha5sj44uu1gj.apps.googleusercontent.com",
            ],
          },
        ],
        ITSAppUsesNonExemptEncryption: false,
      },
    } as any,

    android: {
      package: "com.jp.pripri.pawpath",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
      ],
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [{ scheme: "pawpath" }],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "散歩ルートを正確に記録するため、アプリ使用中の位置情報へのアクセスを許可してください。",
          locationAlwaysAndWhenInUsePermission:
            "散歩中に継続的にルートを記録するため、バックグラウンドでの位置情報へのアクセスを許可してください。これにより、画面をオフにしても正確な散歩記録が可能になります。位置情報は散歩記録中のみ使用され、記録終了後は即座に停止します。",
          isAndroidBackgroundLocationEnabled: true,
          isIosBackgroundLocationEnabled: true,
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      router: {},
      env,

      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        appId: {
            ios: process.env.EXPO_PUBLIC_FIREBASE_APP_ID_IOS,
            android:
              process.env
                .EXPO_PUBLIC_FIREBASE_APP_ID_ANDROID,
          },
      },

      googleAuth: {
        iosClientId:
          process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId:
          process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      },

      revenuCat: {
        entitlement: process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT,
        iosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      },

      eas: {
        projectId: "d8217194-1634-43f6-9fa9-1be90cb3530f",
      },

    },
  };
};
