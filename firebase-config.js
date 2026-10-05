// Optional Firebase web config for PayLoyal demo storage.
// Replace null with your Firebase project config after creating a Firestore database.
// Firebase web config is not a server secret, but keep Firestore rules restrictive.
window.PAYLOYAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAA-dRiu-fxHdDrLj4JrzsMAfPnAa2iyQ0",
  authDomain: "payloyal-demo.firebaseapp.com",
  projectId: "payloyal-demo",
  storageBucket: "payloyal-demo.firebasestorage.app",
  messagingSenderId: "576035048592",
  appId: "1:576035048592:web:af69a1625d7f79962c5c15",
  measurementId: "G-Y0HRP5NBBJ"
};

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /merchant_demo_setups/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'businessName',
        'upiId',
        'ownerName',
        'ownerPhoneLast4',
        'city',
        'businessType',
        'slug',
        'payUrl',
        'source',
        'createdAt'
      ]);

      allow read, update, delete: if false;
    }
  }
}
