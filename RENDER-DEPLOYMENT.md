# Render Deployment - Environment Variables Setup

## 🚀 Backend Service Environment Variables

Go to your Render Dashboard → Backend Service → Environment

Add/Update these variables:

### Database
```
DATABASE_URL=postgresql://parkingdb_vq1r_user:Lnf5ARsAIneUVjFA2cByf6dpmx4Fo6JA@dpg-d4qp2kidbo4c73bvpqrg-a.singapore-postgres.render.com/parkingdb_vq1r
```

### JWT Secret
```
JWT_SECRET=92db50adfb768d0040fdfa75bf949d45ff39ebc1e2aa0b0425d55e1b3eb0509ae9a0dd10a38d80ce16dbd73259e1bc1281eb39c64e0450d0159cc1b6062af586
```

### Frontend URL (CORS)
```
FRONTEND_URL=https://car-parking-slot-booking-system-gold.vercel.app
```

### Firebase Configuration
```
FIREBASE_PROJECT_ID=project-c-4b503
FIREBASE_PRIVATE_KEY_ID=<from firebase-service-account.json>
FIREBASE_PRIVATE_KEY=<from firebase-service-account.json - entire private key with \n>
FIREBASE_CLIENT_EMAIL=<from firebase-service-account.json>
FIREBASE_CLIENT_ID=<from firebase-service-account.json>
FIREBASE_CERT_URL=<from firebase-service-account.json>
```

---

## 📝 Steps to Update on Render:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. Click on your **Backend Service** (car-parking-slot-booking-system)
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Add each variable one by one
6. Click **"Save Changes"** - this will trigger automatic redeploy

---

## 🔥 Firebase Private Key Format

The FIREBASE_PRIVATE_KEY must include the newlines as `\n`:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqh...\n-----END PRIVATE KEY-----\n
```

To get the correct format:
1. Open `firebase-service-account.json`
2. Copy the `private_key` value (it already has \n in it)
3. Paste it exactly as is in Render

---

## ✅ After Setting Variables:

1. Service will auto-redeploy (takes 2-3 minutes)
2. Check deployment logs for errors
3. Test these endpoints:
   - https://car-parking-slot-booking-system-z20m.onrender.com/health
   - https://car-parking-slot-booking-system-z20m.onrender.com/health/db

---

## 🐛 If Database Still Fails:

Run migration in Render Shell:
1. Go to Backend Service → **Shell** tab
2. Run: `node migrate-database.js`
3. Wait for confirmation
4. Test `/health/db` again

---

## 📱 Vercel Frontend Environment

Make sure Vercel also has:
```
REACT_APP_API_URL=https://car-parking-slot-booking-system-z20m.onrender.com
REACT_APP_FIREBASE_API_KEY=<from Firebase Console>
REACT_APP_FIREBASE_AUTH_DOMAIN=project-c-4b503.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=project-c-4b503
REACT_APP_FIREBASE_STORAGE_BUCKET=project-c-4b503.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<from Firebase Console>
REACT_APP_FIREBASE_APP_ID=<from Firebase Console>
```
