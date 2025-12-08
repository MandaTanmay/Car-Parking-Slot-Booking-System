# Deployment Checklist

## ✅ Backend (Render)

### Environment Variables to Set:
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://parkingdb_vq1r_user:Lnf5ARsAIneUVjFA2cByf6dpmx4Fo6JA@dpg-d4qp2kidbo4c73bvpqrg-a/parkingdb_vq1r
FRONTEND_URL=https://car-parking-slot-booking-system-gold.vercel.app
JWT_SECRET=92db50adfb768d0040fdfa75bf949d45ff39ebc1e2aa0b0425d55e1b3eb0509ae9a0dd10a38d80ce16dbd73259e1bc1281eb39c64e0450d0159cc1b6062af586

FIREBASE_PROJECT_ID=project-c-4b503
FIREBASE_PRIVATE_KEY_ID=25407943b21cbfe7707c1bdd7796d29af4960f71
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@project-c-4b503.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=116974664217063660786
FIREBASE_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40project-c-4b503.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCTsWIMBY9GfZtn
RjnrExveElNCez1GhVHFGMb3QrXNPHAknGTWJBHKv7+Tbs7b/tGS37VF1hBtvudL
NSi9ECVFulrrmPOhmt7JNmEHETsmDJ7lyx2q9kU+X7fo5I6G07lIz0Xm8OJJe+Wd
BszNX2fgcJlUD7hsfegXuJsf65ovYlE0Q1g28KiXUoRGX9FQJpxEW9M8d9q9e86e
sHoai1UYZz2LOKzodYNG09lCUxJsewLArCD3VRk2zia8WQuHWv1oPuNVfbFQgpBb
pKkalj1/ojY7caCzjg5IqYSZYgXJKdW2Du+2Dbz2pAaaWdVs7qLm7ZzXr0uwWVPD
qgauwm1zAgMBAAECggEAIk+OII7WFyEtDhPxdpwM2E1XjFVHCfAE7A3ygxS7WX+V
6dtvTZQ5kelz3xNZ+R+8nitcWGn/jQ9RelZSLYHntsgxQRRaXQu2f/YjGlo1bIR4
EZhbPxFRSsk/11nphob/P1vvuFPzrfCbihw/TeLBJhHifPXd+U5SsdgQKZ05R5Js
QHbqMsnRSmOLmpYSWe59PC3xpL0+0yeNQAd1qRWx4qBgEz2H5GH8PjyojO81u2lZ
Tw1lbf5xWxunYivjmh6d+IromRXBNqH45Kq+0w2bf2N17oXmAllQ+m+o5/HP3RAO
kRhh74oi8koXO4O+2spSZIDw/LCZ0vwW3xx0l+Hn4QKBgQDGH3LMrcu9XakXW+qW
LujbBq0i60wmiOY8RZwuh5zOrij3kB2jMJz8UzxgyXz/ocrNIArIAm0Ss+EgPtZu
HPPRFPF68rZg+m+yVUD1m2BtiCAMlrlSWidW9OLlQ1WY7t0xqpc9oI4v9THLamf2
2u423JvyaPFYPCxhtzKHrDQQcQKBgQC+1oxEamPr2Ao1pQC91BlmMj7b2uIHxDlJ
g8r4/TFuJXfACx6eAZiWjTXMjRW4wbmQIgW9C+khGkXH02TS0XSBZ2F/qDuufZny
G4O1JesQGOLF6s4whCeoDA0v2J4TQCmjrB0ZTydeHqtKaTcWmpdC6kPaU4sLhbKb
IaXB9Z4OIwKBgQCrHiZtGf7Kw8Zz4nOu2z1LT2ziqA/RiJQyonzOw1pwOIQxrkuq
0yYD2XBguCY6NGeQ24f0UAQdDzf2Pc++s0ry3v/ijRdwk109zdyZRWX3tIbZ2KSf
uDYaKNB/67RWrphleU2/cJjeWwxzAKhi0ZzFzazzpigtaWt7ylreS6F8QQKBgCyn
eUTc/CqIb8Mjq+u/QH44TZsWOYOFt73q98iRPkq+u6mVMIHab8Dyo98MOEP2GJyQ
SXV13wQe6KscXOAzoKZS8W50iBqJS0dqhsQRblJi8FVNXxfdJIZe44sJjduFTPj+
YgS1D8onNP+BZSGF5NUEigIBQGzeyO8hzW54MZavAoGAbDntkEVYvWSo0Zlr6bag
NLtH4ofKLLBF+TRGmmO8zlSiLLYGQJY/0ZjpvQX2Lx/+t/MSWBCOWXIgitFS12ES
YHXDZ1NzZdTPqegaN8C8FtrdEGQqgldzEDkAAgovybo1gBRetXDBKXK/D/mcNtlR
pXL6wbEeZ7k7h6gPJMDsg0w=
-----END PRIVATE KEY-----
"
```

### Render Settings:
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Test Backend:
Visit: https://car-parking-slot-booking-system-z20m.onrender.com/health

Should return: `{"status":"OK","timestamp":"..."}`

---

## ✅ Frontend (Vercel)

### Environment Variables to Set:
```
REACT_APP_API_URL=https://car-parking-slot-booking-system-z20m.onrender.com
REACT_APP_SOCKET_URL=https://car-parking-slot-booking-system-z20m.onrender.com
```

### After Setting Variables:
- **Must redeploy** for changes to take effect
- Go to Deployments → Click three dots → Redeploy

### Test Frontend:
Visit: https://car-parking-slot-booking-system-gold.vercel.app

---

## ✅ Firebase Configuration

### Add Authorized Domains:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **project-c-4b503**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add these domains:
   - `car-parking-slot-booking-system-gold.vercel.app`
   - `localhost` (should already be there)

---

## ✅ Database Migration

### Run Schema on Render PostgreSQL:

**Option 1: Using Render Shell**
1. Go to your Render PostgreSQL service
2. Click "Connect" → Copy external connection string
3. Run locally:
```bash
psql postgresql://parkingdb_vq1r_user:Lnf5ARsAIneUVjFA2cByf6dpmx4Fo6JA@dpg-d4qp2kidbo4c73bvpqrg-a/parkingdb_vq1r -f backend/schema.sql
```

**Option 2: Using Render Dashboard**
1. Go to Render PostgreSQL Dashboard
2. Click "Connect" → "psql"
3. Copy/paste contents of `backend/schema.sql`

---

## 🔍 Debugging Steps

### If Getting Network Errors:

1. **Check Backend Health:**
   ```
   https://car-parking-slot-booking-system-z20m.onrender.com/health
   ```

2. **Check Browser Console (F12):**
   - Look for actual error messages
   - Check Network tab for failed requests
   - Look for CORS errors

3. **Check Render Logs:**
   - Go to Render Dashboard → Your service → Logs
   - Look for errors or crashes

4. **Verify Environment Variables:**
   - Render: Check all Firebase vars are set
   - Vercel: Check REACT_APP_API_URL is set
   - Both must be redeployed after adding variables

### Common Issues:

- ❌ Forgot to redeploy after adding env variables
- ❌ Typo in environment variable names (must be exact)
- ❌ FRONTEND_URL in Render doesn't match Vercel domain
- ❌ Database schema not run on Render PostgreSQL
- ❌ Firebase domain not authorized

---

## 📝 Final Verification

### All These Should Work:

- ✅ Backend root: https://car-parking-slot-booking-system-z20m.onrender.com/
- ✅ Backend health: https://car-parking-slot-booking-system-z20m.onrender.com/health
- ✅ Frontend: https://car-parking-slot-booking-system-gold.vercel.app
- ✅ Can login with Google
- ✅ Can view parking lots
- ✅ Can create bookings

---

## 🚀 Deployment URLs

- **Frontend (Vercel):** https://car-parking-slot-booking-system-gold.vercel.app
- **Backend (Render):** https://car-parking-slot-booking-system-z20m.onrender.com
- **Database (Render):** postgresql://parkingdb_vq1r_user:...@dpg-d4qp2kidbo4c73bvpqrg-a/parkingdb_vq1r
