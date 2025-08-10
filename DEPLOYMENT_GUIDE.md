# 🚀 Deployment Guide: Socio App to Vercel + Supabase

## **Prerequisites Completed ✅**
- ✅ Server restructured for Vercel serverless functions
- ✅ Environment variables configured
- ✅ Vercel configuration files created
- ✅ Next.js configuration updated for production

---

## **Phase 2: Manual Deployment Steps**

### **Step 1: Deploy the Server (API)**

1. **Create a new Vercel project for the server:**
   ```bash
   cd server
   npx vercel
   ```

2. **Follow the Vercel CLI prompts:**
   - Set up and deploy: `Y`
   - Which scope: Choose your account
   - Link to existing project: `N`
   - Project name: `socio-api` (or your preferred name)
   - Directory: `./` (current directory)
   - Want to modify settings: `N`

3. **Set environment variables in Vercel dashboard:**
   - Go to your project dashboard on vercel.com
   - Navigate to Settings → Environment Variables
   - Add these variables:
     ```
     SUPABASE_URL=https://vkappuaapscvteexogtp.supabase.co
     SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYXBwdWFhcHNjdnRlZXhvZ3RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjI1NDA5MiwiZXhwIjoyMDYxODMwMDkyfQ.3zP1PGCCCtb9cGI4u_TGaU95YuKx1aCrRpBCMOd4bng
     DATABASE_URL=postgresql://postgres:Christ@2025@db.vkappuaapscvteexogtp.supabase.co:5432/postgres
     NODE_ENV=production
     CRON_SECRET=your-secure-random-string-here
     ```

4. **Note your API URL:** `https://your-api-name.vercel.app`

### **Step 2: Deploy the Client (Frontend)**

1. **Update client environment for production:**
   - Copy the `.env.local` file to `.env.production`
   - Update the API URL:
     ```bash
     NEXT_PUBLIC_API_URL=https://your-api-name.vercel.app
     NEXT_PUBLIC_APP_URL=https://your-client-name.vercel.app
     ```

2. **Deploy the client:**
   ```bash
   cd ../client
   npx vercel
   ```

3. **Follow the Vercel CLI prompts:**
   - Set up and deploy: `Y`
   - Which scope: Choose your account
   - Link to existing project: `N`
   - Project name: `socio-app` (or your preferred name)
   - Directory: `./` (current directory)
   - Want to modify settings: `N`

4. **Set environment variables in Vercel dashboard:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://vkappuaapscvteexogtp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYXBwdWFhcHNjdnRlZXhvZ3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNTQwOTIsImV4cCI6MjA2MTgzMDA5Mn0.ILq6Aho_0xGW3JtbhXWpB-0AkJAN70-3q2abplZ3fbA
   NEXT_PUBLIC_API_URL=https://your-api-name.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-client-name.vercel.app
   ```

### **Step 3: Configure Supabase Authentication**

1. **Update Supabase Auth Settings:**
   - Go to your Supabase dashboard
   - Navigate to Authentication → Settings
   - Under "Site URL", add your production client URL: `https://your-client-name.vercel.app`

2. **Configure Redirect URLs:**
   - Add these URLs to "Redirect URLs":
     ```
     https://your-client-name.vercel.app/auth/callback
     http://localhost:3000/auth/callback (for development)
     ```

3. **Google OAuth Configuration:**
   - In Authentication → Providers → Google
   - Add your domain restriction for @christuniversity.in
   - Update "Authorized redirect URIs" in Google Cloud Console:
     ```
     https://vkappuaapscvteexogtp.supabase.co/auth/v1/callback
     ```

### **Step 4: Set up Automated Cleanup (Optional)**

1. **Create a cron job service (like cron-job.org):**
   - URL: `https://your-api-name.vercel.app/cleanup`
   - Method: POST
   - Headers: `Authorization: Bearer your-secure-random-string-here`
   - Schedule: Daily at midnight

### **Step 5: Domain Configuration (Optional)**

1. **Add custom domain in Vercel:**
   - Go to your project settings
   - Navigate to Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Update environment variables with custom domain:**
   - Replace Vercel URLs with your custom domain
   - Update Supabase auth settings with new domain

---

## **Phase 3: Testing Checklist**

### **Frontend Testing:**
- [ ] Site loads correctly
- [ ] Google authentication works
- [ ] @christuniversity.in domain restriction works
- [ ] Navigation between pages works
- [ ] Images load from Supabase storage

### **Backend Testing:**
- [ ] API endpoints respond correctly
- [ ] Database operations work
- [ ] File uploads to Supabase storage work
- [ ] Authentication middleware works

### **Integration Testing:**
- [ ] User registration/login flow
- [ ] Event creation and management
- [ ] Fest creation and management
- [ ] File upload functionality
- [ ] User profile management

---

## **Phase 4: Production Environment Variables Summary**

### **Client (.env.production):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://vkappuaapscvteexogtp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYXBwdWFhcHNjdnRlZXhvZ3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNTQwOTIsImV4cCI6MjA2MTgzMDA5Mn0.ILq6Aho_0xGW3JtbhXWpB-0AkJAN70-3q2abplZ3fbA
NEXT_PUBLIC_API_URL=https://your-api-name.vercel.app
NEXT_PUBLIC_APP_URL=https://your-client-name.vercel.app
```

### **Server (Vercel Environment Variables):**
```env
SUPABASE_URL=https://vkappuaapscvteexogtp.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYXBwdWFhcHNjdnRlZXhvZ3RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjI1NDA5MiwiZXhwIjoyMDYxODMwMDkyfQ.3zP1PGCCCtb9cGI4u_TGaU95YuKx1aCrRpBCMOd4bng
DATABASE_URL=postgresql://postgres:Christ@2025@db.vkappuaapscvteexogtp.supabase.co:5432/postgres
NODE_ENV=production
CRON_SECRET=your-secure-random-string-here
```

---

## **🎯 You're Ready to Deploy!**

The codebase has been completely prepared for deployment. Follow the manual steps above to get your application live on Vercel with Supabase integration.
