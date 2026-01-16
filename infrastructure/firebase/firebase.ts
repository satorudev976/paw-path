import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Platform } from "react-native";
import Constants from "expo-constants";

const firebaseExtra =
  Constants.expoConfig?.extra?.firebase;

const firebaseConfig = {
  apiKey: firebaseExtra.apiKey,
  projectId: firebaseExtra.projectId,
  storageBucket: firebaseExtra.storageBucket,
  appId:
    Platform.OS === "ios"
      ? firebaseExtra.appId.ios
      : firebaseExtra.appId.android,
};

export const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]

export const db = getFirestore(app);
