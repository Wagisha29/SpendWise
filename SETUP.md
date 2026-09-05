# Supabase + Google Login Setup

The code is already wired up for Supabase (Postgres) and Google sign-in. You just need to
create the accounts/credentials below and paste the resulting values into two `.env` files.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**.
2. Pick a name, database password (save it), and region → **Create project** (takes ~2 min).
3. Once ready, go to **Project Settings → API** and copy:
   - `Project URL` → used as `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `anon public` key → used as `VITE_SUPABASE_ANON_KEY`
4. Go to **Project Settings → API → JWT Settings** and copy the `JWT Secret` → used as
   `SUPABASE_JWT_SECRET`.
5. Go to **Project Settings → Database → Connection string → URI**, copy it, replace
   `[YOUR-PASSWORD]` with your DB password, and change the `postgresql://` prefix to
   `postgresql+psycopg://` → used as `DATABASE_URL`.

You don't need to create any tables manually — the FastAPI backend creates the `expenses`
table automatically on startup.

## 2. Create a Google OAuth Client

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) → create/select a project.
2. **APIs & Services → OAuth consent screen**: choose **External**, fill in app name and your
   email, save (you can leave it in "Testing" mode while developing).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
     (find `[YOUR-PROJECT-REF]` in your Supabase Project URL)
4. Copy the generated **Client ID** and **Client secret**.

## 3. Enable Google in Supabase Auth

1. In Supabase: **Authentication → Providers → Google** → toggle it on.
2. Paste the Google **Client ID** and **Client secret** → **Save**.
3. Go to **Authentication → URL Configuration**:
   - Site URL: keep production `https://spendwise-io.vercel.app` (or `http://localhost:5173` while testing local only)
   - Redirect URLs: add **all** origins you use (Supabase rejects unknown ones and falls back to Site URL):
     - `http://localhost:5173`
     - `http://localhost:5173/**`
     - `http://localhost:5174`
     - `http://localhost:5174/**`
     - `https://spendwise-io.vercel.app`
     - `https://spendwise-io.vercel.app/**`

If local sign-in still opens the Vercel URL, you signed in from a port that is **not** in Redirect URLs (common when Vite picks 5174 because 5173 is busy). Either add that port above, or free 5173 and use `http://localhost:5173`.

## 4. Fill in your `.env` files

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Edit both files with the values you collected above.

## 5. Install and run

```bash
npm install
cd apps/backend && source venv/bin/activate && pip install -r requirements.txt && cd ../..
npm run dev
```

Open `http://localhost:5173`, click **Sign in with Google**, and you should land on the
expense tracker scoped to your account.
