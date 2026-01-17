import { createContext, useContext, useState } from 'react';

type WalkRecordingContextValue = {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
};

const WalkRecordingContext =
  createContext<WalkRecordingContextValue | undefined>(undefined);

export function WalkRecordingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <WalkRecordingContext.Provider
      value={{
        isRecording,
        startRecording,
        stopRecording,
      }}
    >
      {children}
    </WalkRecordingContext.Provider>
  );
}

export function useWalkRecording() {
  const ctx = useContext(WalkRecordingContext);
  if (!ctx)
    throw new Error(
      'useWalkRecording must be used inside WalkRecordingProvider',
    );
  return ctx;
}
