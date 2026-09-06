// Cloud Firestore Service Layer for EcoSort Ghana
// Synchronizes waste submissions, pickup logistics, verified collections, and MoMo earnings

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  orderBy, 
  limit, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  UserProfile, 
  WasteSubmission, 
  CollectionJob, 
  PointTransaction, 
  CashWithdrawalRecord, 
  RewardRedemption, 
  RewardItem,
  RobotSortingEvent, 
  RecyclerOrder, 
  LeaderboardEntry,
  AdminAuditLog 
} from '../types';

export const firestoreService = {
  /**
   * Save or update User Profile in Firestore
   */
  async saveUserProfile(user: UserProfile): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving user profile:', err);
    }
  },

  /**
   * Delete a user profile from Firestore
   */
  async deleteUserProfile(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (err) {
      console.warn('[Firestore] Error deleting user profile:', err);
    }
  },

  /**
   * Fetch a single user profile from Firestore
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
      return null;
    } catch (err) {
      console.warn('[Firestore] Error fetching user profile:', err);
      return null;
    }
  },

  /**
   * Look up user profile by email in Firestore
   */
  async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    try {
      if (!email) return null;
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as UserProfile;
      }
      return null;
    } catch (err) {
      console.warn('[Firestore] Error looking up user by email:', err);
      return null;
    }
  },

  /**
   * Subscribe to real-time Users
   */
  subscribeToUsers(
    onData: (users: UserProfile[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, limit(100));

      return onSnapshot(q, (snapshot) => {
        const items: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as UserProfile);
        });
        if (items.length > 0) {
          onData(items);
        }
      }, (err) => {
        console.warn('[Firestore] Users subscription error:', err);
        if (onError) onError(err);
      });
    } catch (err) {
      console.warn('[Firestore] Failed setting up users listener:', err);
      return () => {};
    }
  },

  /**
   * Save Admin Audit Log
   */
  async saveAuditLog(log: AdminAuditLog): Promise<void> {
    try {
      const logRef = doc(db, 'admin_audit_logs', log.id);
      await setDoc(logRef, log, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving audit log:', err);
    }
  },

  /**
   * Save or Update Reward item
   */
  async saveRewardItem(reward: RewardItem): Promise<void> {
    try {
      const rRef = doc(db, 'rewards', reward.id);
      await setDoc(rRef, reward, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving reward item:', err);
    }
  },

  /**
   * Delete Reward item
   */
  async deleteRewardItem(rewardId: string): Promise<void> {
    try {
      const rRef = doc(db, 'rewards', rewardId);
      await deleteDoc(rRef);
    } catch (err) {
      console.warn('[Firestore] Error deleting reward item:', err);
    }
  },

  /**
   * Subscribe to real-time Waste Submissions
   */
  subscribeToSubmissions(
    onData: (submissions: WasteSubmission[]) => void, 
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const submissionsRef = collection(db, 'submissions');
      const q = query(submissionsRef, orderBy('createdAt', 'desc'), limit(100));

      return onSnapshot(q, (snapshot) => {
        const items: WasteSubmission[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as WasteSubmission);
        });
        if (items.length > 0) {
          onData(items);
        }
      }, (err) => {
        console.warn('[Firestore] Submissions subscription error:', err);
        if (onError) onError(err);
      });
    } catch (err) {
      console.warn('[Firestore] Failed setting up submissions listener:', err);
      return () => {};
    }
  },

  /**
   * Save or Update Waste Submission
   */
  async saveSubmission(submission: WasteSubmission): Promise<void> {
    try {
      const subRef = doc(db, 'submissions', submission.id);
      await setDoc(subRef, submission, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving submission:', err);
    }
  },

  /**
   * Subscribe to real-time Collection Jobs
   */
  subscribeToCollectionJobs(
    onData: (jobs: CollectionJob[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const jobsRef = collection(db, 'collection_jobs');
      const q = query(jobsRef, orderBy('createdAt', 'desc'), limit(100));

      return onSnapshot(q, (snapshot) => {
        const items: CollectionJob[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as CollectionJob);
        });
        if (items.length > 0) {
          onData(items);
        }
      }, (err) => {
        console.warn('[Firestore] Collection jobs subscription error:', err);
        if (onError) onError(err);
      });
    } catch (err) {
      console.warn('[Firestore] Failed setting up collection jobs listener:', err);
      return () => {};
    }
  },

  /**
   * Save or Update Collection Job
   */
  async saveCollectionJob(job: CollectionJob): Promise<void> {
    try {
      const jobRef = doc(db, 'collection_jobs', job.id);
      await setDoc(jobRef, job, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving collection job:', err);
    }
  },

  /**
   * Record Point Transaction
   */
  async saveTransaction(tx: PointTransaction): Promise<void> {
    try {
      const txRef = doc(db, 'point_transactions', tx.id);
      await setDoc(txRef, tx, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving transaction:', err);
    }
  },

  /**
   * Record Cash / MoMo Withdrawal
   */
  async saveCashWithdrawal(record: CashWithdrawalRecord): Promise<void> {
    try {
      const wRef = doc(db, 'cash_withdrawals', record.id);
      await setDoc(wRef, record, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving cash withdrawal:', err);
    }
  },

  /**
   * Record Reward Redemption
   */
  async saveRedemption(redemption: RewardRedemption): Promise<void> {
    try {
      const redRef = doc(db, 'reward_redemptions', redemption.id);
      await setDoc(redRef, redemption, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving redemption:', err);
    }
  },

  /**
   * Record Robot Sorting Event Telemetry
   */
  async saveRobotEvent(event: RobotSortingEvent): Promise<void> {
    try {
      const eventRef = doc(db, 'robot_events', event.id);
      await setDoc(eventRef, event, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving robot event:', err);
    }
  },

  /**
   * Record Recycler Procurement Order
   */
  async saveRecyclerOrder(order: RecyclerOrder): Promise<void> {
    try {
      const orderRef = doc(db, 'recycler_orders', order.id);
      await setDoc(orderRef, order, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving recycler order:', err);
    }
  },

  /**
   * Batch seed initial seed data to Cloud Firestore if collections are empty
   */
  async seedInitialCloudData(
    initialSubmissions: WasteSubmission[], 
    initialJobs: CollectionJob[],
    initialUser: UserProfile
  ): Promise<void> {
    try {
      const subsSnap = await getDocs(query(collection(db, 'submissions'), limit(1)));
      if (subsSnap.empty) {
        for (const sub of initialSubmissions) {
          await this.saveSubmission(sub);
        }
      }

      const jobsSnap = await getDocs(query(collection(db, 'collection_jobs'), limit(1)));
      if (jobsSnap.empty) {
        for (const job of initialJobs) {
          await this.saveCollectionJob(job);
        }
      }

      const userSnap = await getDoc(doc(db, 'users', initialUser.id));
      if (!userSnap.exists()) {
        await this.saveUserProfile(initialUser);
      }
    } catch (err) {
      console.warn('[Firestore] Initial cloud seed note:', err);
    }
  }
};
