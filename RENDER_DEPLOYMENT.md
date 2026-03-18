# 💎 SmartBudget - Manual "Free Tier" Deployment Guide

If the Blueprint feature asks for money, follow these **Manual Steps** to deploy your unified app for **FREE ($0)**.

## �️ Step 1: Create a Free PostgreSQL Database
1.  Go to your [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** and select **PostgreSQL**.
3.  **Name**: `smartbudget-db`.
4.  Scroll down to **Instance Type** and select **Free**.
5.  Click **Create Database**.
6.  Once created, copy the **Internal Database URL**.

---

## 🐍 Step 2: Create a Free Web Service (The Unified App)
1.  Click **New +** and select **Web Service**.
2.  Connect your GitHub repository.
3.  **Name**: `smartbudget-unified`.
4.  **Root Directory**: (Leave it empty).
5.  **Environment**: `Python`.
6.  **Build Command**: `./build.sh`
7.  **Start Command**: `gunicorn --pythonpath backend core.wsgi:application`
8.  **Instance Type**: Select **Free** ($0/month).
9.  Click **Advanced** and add these **Environment Variables**:
    *   `DATABASE_URL`: (Paste your Internal Database URL from Step 1).
    *   `SECRET_KEY`: (Any random string).
    *   `DEBUG`: `False`.
    *   `ALLOWED_HOSTS`: `smartbudget-unified.onrender.com` (replace with your actual URL).
10. Click **Create Web Service**.

---

## ✅ Why this works?
- By using `./build.sh`, Render builds your **React frontend** and your **Django backend** together.
- Because I configured Django to serve your `dist` folder, you only need **one** service.
- By selecting the **Free** instance type, you pay nothing.

---

## 🛡️ Post-Deployment
Once live, update the `ALLOWED_HOSTS` in your Render environment settings to match your live URL.

**Your SmartBudget is now live and 100% Free!** 🏆🕺

---

## ✅ Step 4: Final Link
1.  Once your frontend is active, copy its URL (e.g., `https://smartbudget.onrender.com`).
2.  Go back to your **Backend Service** settings and update `CORS_ALLOWED_ORIGINS` to include your frontend URL.
3.  Update `ALLOWED_HOSTS` to include the backend's own hostname.

**Congratulations! Your SmartBudget is now live and accessible from anywhere in the world.** 🌍✨
