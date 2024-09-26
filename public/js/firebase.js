import { initializeApp } from 'firebase/app';

import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from 'firebase/auth';
  import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    setDoc,
    collection,
    writeBatch,
    query,
  } from 'firebase/firestore';


  const firebaseConfig = {
    apiKey: "AIzaSyBI_h3gQ1rbQafUGvm5pDXFLUu3I51kQ38",
    authDomain: "hackbattle-e99ce.firebaseapp.com",
    projectId: "hackbattle-e99ce",
    storageBucket: "hackbattle-e99ce.appspot.com",
    messagingSenderId: "112495791818",
    appId: "1:112495791818:web:6b52546d2e2960d2b72e33",
    measurementId: "G-XE6FRSDF1S"
  };

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
  
  export const auth = getAuth();
  export const signInWithGooglePopup = () =>
    signInWithPopup(auth, googleProvider);

  export const addCollectionAndDocuments = async (
    collectionKey,
    objectsToAdd
  ) => {
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionKey);
  
    objectsToAdd.forEach(async (object) => {
      const docRef = doc(collectionRef, object.title.toLowerCase());
      batch.set(docRef, object);
    });
  
    await batch.commit();
    console.log('done');
  };
  
  export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);
  
    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
      const { title, items } = docSnapshot.data();
      acc[title.toLowerCase()] = items;
      return acc;
    }, {});
  
    return categoryMap;
  };
  
  export const createUserDocumentFromAuth = async (
    userAuth,
    additionalInformation = {}
  ) => {
    if (!userAuth) return;
  
    const userDocRef = doc(db, 'users', userAuth.uid);
  
    const userSnapshot = await getDoc(userDocRef);
  
    if (!userSnapshot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
  
      try {
        await setDoc(userDocRef, {
          displayName,
          email,
          createdAt,
          ...additionalInformation,
        });
      } catch (error) {
        console.log('error creating the user', error.message);
      }
    }
  
    return userDocRef;
  };

