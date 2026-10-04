# Firebase setup for PayLoyal merchant demo storage

PayLoyal's merchant demo form writes to Firestore when Firebase is configured. Until then it falls back to local browser storage.

## 1. Create Firebase project

1. Go to https://console.firebase.google.com/
2. Create a project, e.g. `payloyal-demo`
3. Add a Web App
4. Copy the Firebase config object

## 2. Enable Firestore

1. Build → Firestore Database
2. Create database
3. Start in production mode
4. Choose a region near India if available

## 3. Add config

Edit `firebase-config.js`:

```js
window.PAYLOYAL_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...firebaseapp.com",
  projectId: "...",
  storageBucket: "...appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

## 4. Firestore collection

The demo writes merchant leads to:

```text
merchant_demo_setups
```

Fields:

- businessName
- upiId
- ownerName
- ownerPhoneLast4
- city
- businessType
- slug
- payUrl
- source
- createdAt

## 5. Suggested temporary Firestore rules

For a private demo, restrict writes later. Temporary demo rule for testing only:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /merchant_demo_setups/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'businessName', 'upiId', 'ownerName', 'ownerPhoneLast4',
        'city', 'businessType', 'slug', 'payUrl', 'source', 'createdAt'
      ]);
      allow read, update, delete: if false;
    }
  }
}
```

For production, add authentication, bot protection, and server-side validation.
