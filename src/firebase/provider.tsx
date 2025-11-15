
'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  doc,
  DocumentData,
  onSnapshot,
  collection,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { initializeFirebase } from './index';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

type Prescription = {
  id: string;
  name: string;
  dosage: string;
  frequency: number;
  lastTaken?: Timestamp;
  userId: string;
};

type FirebaseInstances = {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

type FirebaseContextValue = {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  user: User | null;
  userData: DocumentData | null;
  loading: boolean;
  prescriptions: Prescription[];
};

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  auth: null,
  firestore: null,
  user: null,
  userData: null,
  loading: true,
  prescriptions: [],
});

export const useFirebase = () => useContext(FirebaseContext);
export const useUser = () => {
  const { user, userData, loading } = useContext(FirebaseContext);
  return { user, userData, loading };
};

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances>({ auth: null, firestore: null, firebaseApp: null });
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth, firestore, firebaseApp } = initializeFirebase();
    setInstances({ auth, firestore, firebaseApp });
  }, []);

  useEffect(() => {
    if (!instances.auth) return;

    setLoading(true);
    const unsubscribeAuth = onAuthStateChanged(instances.auth, (user) => {
      setUser(user);
      if (!user) {
        setUserData(null);
        setPrescriptions([]);
        setLoading(false);
      }
    });

    return () => {
        unsubscribeAuth();
    }
  }, [instances.auth]);

  useEffect(() => {
    if (user && instances.firestore) {
      // Fetch user data
      const userDocRef = doc(instances.firestore, 'users', user.uid);
      const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        } else {
          setUserData({ displayName: user.displayName, email: user.email });
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching user data:', error);
        setUserData(null);
        setLoading(false);
      });

      // Fetch prescriptions
      const prescriptionsQuery = query(collection(instances.firestore, 'prescriptions'), where('userId', '==', user.uid));
      const unsubscribePrescriptions = onSnapshot(prescriptionsQuery, (querySnapshot) => {
        const userPrescriptions: Prescription[] = [];
        querySnapshot.forEach((doc) => {
          userPrescriptions.push({ id: doc.id, ...(doc.data() as Omit<Prescription, 'id'>) });
        });
        setPrescriptions(userPrescriptions);
      }, (error) => {
        console.error("Error fetching prescriptions:", error);
        setPrescriptions([]);
      });

      return () => {
        unsubscribeUser();
        unsubscribePrescriptions();
      };
    }
  }, [user, instances.firestore]);

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp: instances.firebaseApp,
        auth: instances.auth,
        firestore: instances.firestore,
        user,
        userData,
        loading: loading,
        prescriptions,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
