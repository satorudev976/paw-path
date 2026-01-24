import { useContext } from 'react'
import { WalkRecordingContext } from '@/contexts/walk-recording.context'

export function useWalkRecording() {
  const ctx = useContext(WalkRecordingContext);
  if (!ctx)
    throw new Error(
      'useWalkRecording must be used inside WalkRecordingProvider',
    );
  return ctx;
}