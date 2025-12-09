# 🗄️ Supabase Database Setup Guide

## Step 1: Get Your Supabase Connection Details

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **mhsbgosushpbxndyakdz**
3. Go to **Settings** → **Database**
4. Under **Connection string**, you'll see:

### Connection String Format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.mhsbgosushpbxndyakdz.supabase.co:5432/postgres
```

**Your Supabase Details:**
- **Project URL**: `https://mhsbgosushpbxndyakdz.supabase.co`
- **Database Host**: `db.mhsbgosushpbxndyakdz.supabase.co`
- **Database Port**: `5432`
- **Database Name**: `postgres`
- **User**: `postgres`
- **Password**: You need to get this from Supabase Settings

## Step 2: Update Environment Variables

### Local Development (.env file):
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.mhsbgosushpbxndyakdz.supabase.co:5432/postgres
```

### Production (Render):
1. Go to Render Dashboard → Your backend service
2. Go to **Environment** tab
3. Update the `DATABASE_URL` variable:
```
postgresql://postgres:[YOUR-PASSWORD]@db.mhsbgosushpbxndyakdz.supabase.co:5432/postgres
```
4. Click **Save Changes** - this will trigger a redeploy

## Step 3: Run Database Migration

### Option A: Run locally first (Recommended)
```bash
cd backend
node migrate-database.js
```

This will create all tables in your Supabase database.

### Option B: Run on Render
1. Go to Render Dashboard → Backend service → **Shell** tab
2. Run:
```bash
node migrate-database.js
```

## Step 4: Verify Connection

Test the database connection:
```bash
node check-database.js
```

Or check via API:
```
https://your-backend-url.onrender.com/health/db
```

## Step 5: Add Sample Data (Optional)

After migration, you can add initial parking lot data through the admin panel or directly via SQL in Supabase:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run:
```sql
-- Add a sample parking lot
INSERT INTO parking_lots (id, name, address, description, total_slots, hourly_rate)
VALUES (
  gen_random_uuid(),
  'Downtown Parking Complex',
  '123 Main Street, City',
  'Secure parking in city center',
  20,
  50.00
);

-- Add sample slots for the parking lot (replace the parking_lot_id)
INSERT INTO slots (parking_lot_id, slot_code, slot_type, is_active)
SELECT 
  (SELECT id FROM parking_lots LIMIT 1),
  'A' || generate_series(1, 10),
  'regular',
  true;
```

## Troubleshooting

### Connection Issues:
- Make sure you're using the correct password
- Check if your IP is allowed (Supabase allows all IPs by default)
- Verify SSL is enabled in the connection

### Migration Errors:
- If tables already exist, drop them first or use the Supabase dashboard to reset the database
- Make sure you have the correct permissions

### Performance:
- Supabase free tier has connection pooling enabled
- Use connection pooler for production: `db.[PROJECT-REF].supabase.co:5432`

## Supabase Advantages Over Render PostgreSQL:

✅ **Free tier is more generous** - Better for development  
✅ **Built-in dashboard** - Easy to view and edit data  
✅ **Automatic backups** - Point-in-time recovery  
✅ **Real-time capabilities** - Can add subscriptions if needed  
✅ **Better performance** - Faster queries and responses  
✅ **Authentication integration** - Can use Supabase Auth if needed  

## Connection String Examples:

### Direct Connection (for migrations, CLI):
```
postgresql://postgres:[PASSWORD]@db.mhsbgosushpbxndyakdz.supabase.co:5432/postgres
```

### Pooler Connection (for production apps):
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Supabase Status: https://status.supabase.com/
