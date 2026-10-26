# 🚀 SAMVERO Lead Generation Portal - Deployment Guide

This guide details how to deploy the SAMVERO Lead Generation Portal with a **Supabase PostgreSQL backend** and **Vercel frontend/edge infrastructure**.

---

## 1. 🗄️ Supabase Backend Setup

1. Sign in to your Supabase Dashboard: **[https://supabase.com/dashboard](https://supabase.com/dashboard)** (or [https://database.new](https://database.new)) with your GitHub account (`Sam109345`).
2. Click **New Project** and configure:
   - **Name:** `samvero-leadgen`
   - **Database Password:** (Set a secure password)
   - **Region:** Select the region closest to you (e.g. Frankfurt, Singapore, or US East)
3. Once the database provisions (takes ~60 seconds), go to **SQL Editor** from the left navigation.
4. Copy the entire contents of [`supabase-schema.sql`](./supabase-schema.sql) and paste it into the SQL Editor.
5. Click **Run**.
   - This creates:
     - `leads` table (with UAE, Pakistan, US, UK columns & indexes)
     - `client_messages` table (with lead relationship & sentiment)
     - `outreach_logs` table (audit trail for email deliveries)
     - Row Level Security (RLS) policies allowing public read and authenticated management
     - Initial seed data (including flagship UAE leads like Dr. Noor Aesthetics & Al-Futtaim Yachts).
6. Go to **Project Settings** ➔ **API** and copy:
   - **Project URL** (`https://xxxxxxxx.supabase.co`)
   - **anon / public key** (`eyJhbGciOi...`)

---

## 2. ⚡ Vercel Production Deployment

Since your Vercel account (`vercel.com/sameercentric-9487`) is authenticated with your GitHub (`Sam109345`):

1. Open **[https://vercel.com/new](https://vercel.com/new)**.
2. Under **"Import Git Repository"**, you will see **`Sam109345/samvero-leadgen`**.
3. Click the blue **"Import"** button.
4. In the **"Environment Variables"** accordion section, add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | `SAMVERO` | Platform brand name |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Your Supabase public anon key |
| `SMTP_HOST` | `smtp.gmail.com` | Gmail SMTP server |
| `SMTP_PORT` | `587` | Standard TLS port |
| `SMTP_USER` | `sameer.centric@gmail.com` | Your outreach email address |
| `SMTP_PASS` | `Sameer12345!@#$%` | App Password or SMTP password |
| `SMTP_FROM` | `SAMVERO Outreach <sameer.centric@gmail.com>` | Sender display identity |
| `GEMINI_API_KEY` | *(Optional)* | Free key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

5. Click **Deploy**!
6. In ~60 seconds, Vercel will complete the build and assign you a global HTTPS production URL (e.g. `https://samvero-leadgen.vercel.app`).

---

## 3. 🔄 Continuous Deployment

Every time you commit and push to `main` (`git push origin main`), Vercel will automatically build and deploy the update globally without any manual intervention.
