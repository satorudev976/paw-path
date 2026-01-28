import { 
  collection, 
  query,
  doc, 
  getDoc, 
  setDoc, 
  where, 
  getDocs,
  writeBatch,
  updateDoc,
  Transaction,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import { Invite } from '@/domain/entities/invite';

export const inviteRepository = {

  /**
   * 招待を作成
   */
  async create(invite: Invite): Promise<void> {
    const inviteRef = doc(db, 'invites', invite.token);
    await setDoc(inviteRef, {
      token: invite.token,
      familyId: invite.familyId,
      createdBy: invite.createdBy,
      createdAt: Timestamp.fromDate(invite.createdAt),
      expiresAt: Timestamp.fromDate(invite.expiresAt),
      isActive: invite.isActive,
    });
  },

  /**
   * 招待を取得
   */
  async get(token: string): Promise<Invite | null> {
    const inviteRef = doc(db, 'invites', token);
    const snapshot = await getDoc(inviteRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      token: data.token,
      familyId: data.familyId,
      createdBy: data.createdBy,
      createdAt: data.createdAt.toDate(),
      expiresAt: data.expiresAt.toDate(),
      isActive: data.isActive,
    };
  },

  /**
   * 招待のisActiveを更新
   */
  async updateIsActive(tx: Transaction, token: string, isActive: boolean): Promise<void> {
    const inviteRef = doc(db, 'invites', token);
    tx.update(inviteRef, { isActive });
  },

  /**
   * 招待を削除
   * @param familyId 家族ID
   */
  async deleteByFamilyId(familyId: string): Promise<void> {
    const invitesRef = collection(db, 'invites');
    const q = query(invitesRef, where('familyId', '==', familyId));
    const invitesSnapshot = await getDocs(q);

    if (invitesSnapshot.empty) {
      console.log('削除する招待なし');
      return;
    }

    const batch = writeBatch(db);
    invitesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`招待削除: ${invitesSnapshot.size}件`);
  },

};