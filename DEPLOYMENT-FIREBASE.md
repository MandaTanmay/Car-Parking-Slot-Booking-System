# Firebase Configuration Guide

## For Development (Local)

Your current setup works fine - just use the `firebase-service-account.json` file locally.

The `.env` file is already configured:
```
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_PROJECT_ID=project-c-4b503
```

## For Production Deployment

When deploying to hosting platforms (Render, Railway, Vercel, Heroku, etc.), you have **3 options**:

---

### ✅ Option 1: Environment Variables (Most Secure)

Open your `firebase-service-account.json` file and copy the values to your hosting platform's environment variables:

**Set these in your hosting platform dashboard:**

```env
FIREBASE_PROJECT_ID=project-c-4b503
FIREBASE_PRIVATE_KEY_ID=<copy from json: private_key_id>
FIREBASE_PRIVATE_KEY=<copy from json: private_key>
FIREBASE_CLIENT_EMAIL=<copy from json: client_email>
FIREBASE_CLIENT_ID=<copy from json: client_id>
FIREBASE_CERT_URL=<copy from json: client_x509_cert_url>
```

**⚠️ Important:** 
- For `FIREBASE_PRIVATE_KEY`, copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the `\n` characters in the key - they will be handled automatically

---

### ✅ Option 2: Base64 Encoding (Simpler)

Encode your entire JSON file as a single environment variable:

**Step 1:** Run this command locally:
```bash
# Windows PowerShell
$base64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes("backend\firebase-service-account.json"))
echo $base64

# Or manually: https://www.base64encode.org/
```

**Step 2:** In your hosting platform, set:
```env
FIREBASE_SERVICE_ACCOUNT_BASE64=<paste the base64 string here>
```

---

### ✅ Option 3: Secret Files (Platform-Specific)

Some platforms like **Render** and **Railway** allow you to upload secret files directly:

1. Go to your service settings
2. Find "Secret Files" or "Environment Files" section
3. Upload `firebase-service-account.json`
4. Keep `FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json` in environment variables

---

## Testing Locally

The code automatically detects which method to use:

1. ✅ Checks for environment variables first (production)
2. ✅ Falls back to base64 if available
3. ✅ Falls back to local file (development)

You don't need to change anything for local development!

---

## Quick Start for Popular Platforms

### Render
1. Use **Option 1** or **Option 3** (Secret Files)
2. Go to Environment → Secret Files → Upload `firebase-service-account.json`

### Railway
1. Use **Option 1** or **Option 3**
2. Settings → Variables → Upload File → Select `firebase-service-account.json`

### Vercel (Backend API)
1. Use **Option 2** (Base64) - easiest for Vercel
2. Project Settings → Environment Variables → Add `FIREBASE_SERVICE_ACCOUNT_BASE64`

### Heroku
1. Use **Option 1** (Environment Variables)
2. Settings → Config Vars → Add each variable

---

## Security Checklist

- ✅ `firebase-service-account.json` is in `.gitignore`
- ✅ Never commit credentials to GitHub
- ✅ Use environment variables in production
- ✅ Rotate keys if they were exposed

