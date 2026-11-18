# CareerPath AI – Netlify & Real-World Production Deployment Guide

This guide walks you through deploying **CareerPath AI** to the real world on **Netlify** (for the global frontend) and **Render / Railway** (for the Python FastAPI + ML backend).

---

## 🌟 Instant 30-Second Netlify Deployment (No Git Required)

The fastest way to get a live, public HTTPS URL for real-world users to access:

1. Open **[https://app.netlify.com/drop](https://app.netlify.com/drop)** in your web browser.
2. Sign in or create a free Netlify account.
3. Open Windows File Explorer and navigate to:
   📂 **`C:\Users\DELL\Desktop\AI Project\frontend\dist`**
4. Drag and drop the **`dist`** folder into the Netlify Drop box on the page.
5. In 5 seconds, Netlify will publish your site with a live, global HTTPS link:
   👉 **`https://your-custom-name.netlify.app`**
6. In Netlify Site Settings, you can click **"Change site name"** to give it a custom name (e.g., `https://careerpath-ai.netlify.app`).

> **Note:** The `dist` folder already contains the compiled React 18 production bundle, Indian Rupee localization, and the `_redirects` rule (`/* /index.html 200`) so all 17 page routes reload cleanly without 404 errors.

---

## 🚀 Method 2: Netlify Continuous Deployment with GitHub

If you store your code on GitHub:

1. Initialize git and push your project to a GitHub repository:
   ```powershell
   cd "C:\Users\DELL\Desktop\AI Project"
   git init
   git add .
   git commit -m "CareerPath AI Full-Stack Release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/careerpath-ai.git
   git push -u origin main
   ```
2. In [Netlify Dashboard](https://app.netlify.com):
   - Click **"Add new site"** $\rightarrow$ **"Import an existing project"**.
   - Choose **GitHub** and select your repository.
   - Netlify will automatically read our `netlify.toml`:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
3. Click **"Deploy Site"**. Any future `git push` will automatically re-deploy your site!

---

## 💻 Method 3: Deploy via Netlify CLI

From your PowerShell terminal:
```powershell
cd "C:\Users\DELL\Desktop\AI Project"
npx netlify-cli deploy --prod --dir=frontend/dist
```
- It will prompt you to log into Netlify in your browser.
- Select **"Create & configure a new site"**.
- Your live production URL will be generated immediately in the terminal!

---

## 🌐 Deploying the FastAPI + ML Backend to the Cloud (Free)

While Netlify hosts your React frontend globally, your Python backend with the official O*NET 31.0 database and Scikit-learn models can be hosted on a free Python cloud provider.

### Option A: Render.com (Recommended - 100% Free)
We have already created `backend/render.yaml`, `backend/Procfile`, and `backend/Dockerfile`.

1. Go to **[Render.com](https://render.com/)** and sign in.
2. Click **"New +"** $\rightarrow$ **"Web Service"**.
3. Connect your GitHub repository.
4. Render will auto-detect the configuration:
   - **Root Directory:** `backend`
   - **Runtime:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Click **"Deploy Web Service"**.
6. Render will provide your public backend URL, e.g.:
   `https://careerpath-ai-api.onrender.com`

---

## 🔗 Connecting Netlify Frontend to Cloud Backend

Once your backend is running:
1. In your **Netlify Dashboard**, go to **Site configuration** $\rightarrow$ **Environment variables**.
2. Add a new variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://careerpath-ai-api.onrender.com/api/v1`
3. Click **Trigger deploy** $\rightarrow$ **Deploy site**.
4. Now, every recommendation, skill assessment, and search algorithm query executed by real-world users on your Netlify website will talk live to your deployed cloud backend!
