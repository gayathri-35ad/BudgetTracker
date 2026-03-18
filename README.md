# 💎 SmartBudget - Premium Personal Finance Tracker

SmartBudget is a sleek, modern, and powerful web application designed to give you total control over your financial life. Built with a "premium-first" mindset, it combines high-end aesthetics with robust analytical tools.

![Dashboard Preview](frontend/src/assets/dashboard_preview.png) *(Placeholder - replace with actual screenshot)*

## 🚀 Key Features

### 📊 Intelligent Dashboard
- **Dynamic Summaries**: Real-time tracking of Total Balance, Income, and Expenses.
- **AI Financial Coach**: Get personalized insights based on your spending habits (e.g., category overspending alerts, savings goal celebrations).
- **Recent Activity**: A clean, tabulated view of your latest 5 transactions.

### 🌓 Professional Dark Mode
- **Sleek Night Theme**: A fully persistent dark mode that updates backgrounds, cards, and typography for a premium night-time experience.
- **Theme Persistence**: Your preference is saved automatically across sessions.

### 📈 Dynamic Analytics & Reports
- **Visual Trends**: Beautifully rendered Chart.js graphs tracking Monthly Income vs. Expenses.
- **Spending Pie Charts**: Automatic categorization of your monthly spending.
- **Savings Momentum**: Line charts showing your net savings growth over time.

### 🚀 Savings & Subscription Management
- **Goal Tracking**: Set targets for specific life goals (Car, Travel, etc.) and track progress with dynamic milestones.
- **Expense Automation**: New funds added to goals or new subscriptions created automatically sync with your main balance.
- **Subscription Tracker**: Manage recurring bills with fields for renewal dates and one-click deletion.

### 👤 Premium Profile & Identity
- **Smart Header**: Clickable user profile in the header with dynamic name and initials.
- **Customizable Identity**: High-end profile page to manage your Biography, Names, and Financial Snapshot.

---

## 🛠️ Technical Stack

### **Frontend**
- **Framework**: React 18+ with Vite for lightning-fast development.
- **State Management**: React Hooks (useState/useEffect) and Context.
- **Visuals**: Chart.js & react-chartjs-2 for high-performance data visualization.
- **Styling**: Vanilla CSS with a Custom Design System (Glassmorphism, CSS Variables, Fluid Animations).

### **Backend**
- **Framework**: Django 4.2+ with Django REST Framework (DRF).
- **Authentication**: JWT (JSON Web Tokens) with `SimpleJWT` for secure, persistent login.
- **Database**: PostgreSQL (Production) / SQLite (Development).
- **Architecture**: Modular app-based structure (Users, Expenses, Income, Savings, Budgets, Analytics).

---

## 📦 Installation & Setup

### **1. Backend Setup**
Navigate to the `backend/` directory:
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

### **2. Frontend Setup**
Navigate to the `frontend/` directory:
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🎨 Design Philosophy
SmartBudget isn't just a tool; it's an experience. We prioritize:
- **Rich Aesthetics**: Vibrant gradients, subtle shadows, and modern typography (Inter/Roboto).
- **Visual Excellence**: Avoiding generic colors in favor of a curated, harmonious palette.
- **Dynamic Transitions**: Smooth micro-animations that make the interface feel alive.

---

## 📜 License
Internal Project - All Rights Reserved.
