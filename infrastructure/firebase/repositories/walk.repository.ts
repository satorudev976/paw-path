import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  writeBatch,
  where
} from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import { Walk, CreateWalk } from "@/domain/entities/walk"

export const walkRepository = {

  async addWalk(walk: CreateWalk): Promise<void> {
    const walksRef = collection(db, 'families', walk.familyId, 'walks');
    await addDoc(walksRef, {
      familyId: walk.familyId,
      recordedBy: walk.recordedBy,
      startTime: Timestamp.fromDate(walk.startTime),
      endTime: Timestamp.fromDate(walk.endTime),
      durationSec: walk.durationSec,
      distanceMeter: walk.distanceMeter,
      routePoints: walk.routePoints.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: point.timestamp.getTime(),
      })),
    });
  },

  async getWalksByDateRange(
    familyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Walk[]> {
    const walksRef = collection(db, 'families', familyId, 'walks');

    const q = query(
      walksRef,
      where('startTime', '>=', Timestamp.fromDate(startDate)),
      where('startTime', '<=', Timestamp.fromDate(endDate)),
      orderBy('startTime', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        walkId: doc.id,
        familyId: data.familyId,
        recordedBy: data.recordedBy,
        startTime: data.startTime.toDate(), 
        endTime: data.endTime.toDate(), 
        durationSec: data.durationSec,
        distanceMeter: data.distanceMeter,
        routePoints: data.routePoints.map((point: any) => ({
          latitude: point.latitude,
          longitude: point.longitude,
          timestamp: new Date(point.timestamp), 
        })),
      };
    });
  },

  async deleteWalk(familyId: string, walkId: string): Promise<void> {
    const walkRef = doc(db, 'families', familyId, 'walks', walkId);
    await deleteDoc(walkRef);
  },

  /**
   * 特定ユーザーの散歩記録を削除
   * @param userId ユーザーID
   * @param familyId 家族ID
   */
  async deleteWalksByUserId(userId: string, familyId: string): Promise<void> {
    const walksRef = collection(db, 'families', familyId, 'walks');
    const q = query(walksRef, where('recordedBy', '==', userId));
    const walksSnapshot = await getDocs(q);

    if (walksSnapshot.empty) {
      console.log('削除する散歩記録なし');
      return;
    }

    const batch = writeBatch(db);
    walksSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`散歩記録削除: ${walksSnapshot.size}件`);
  },
}