<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Firebase-11-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

# 👷 Labour Attendance Tracker

> A modern, mobile-first web application for contractors to manage labour attendance, track work sites, monitor team performance, and visualize financial insights — all in real-time.

<p align="center">
  <a href="https://attendance-of-labour-by-vibecoding.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_App-blue?style=for-the-badge" alt="Live Demo" />
  </a>
  &nbsp;
  <a href="https://github.com/SomnathBhunia-dev/Labour-attendance-by-VibeCoder" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
</p>

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Benefits](#-benefits)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Firestore Data Model](#-firestore-data-model)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Live Demo

🔗 **[https://labour-attendance-by-vibe-coder.vercel.app](https://attendance-of-labour-by-vibecoding.vercel.app/)**

---

## ✨ Features

### 🔐 Authentication
- **Phone OTP Sign-In** — Secure login via Firebase Phone Authentication with OTP verification
- **Auto-redirect** — Unauthenticated users are redirected to the sign-in page
- **Profile Setup** — First-time users are greeted with a profile setup modal to complete their contractor profile

### 📊 Dashboard
- **Real-time Overview** — Instant view of today's attendance stats (Labourers, Mistris, Total Team)
- **Financial Charts** — Interactive 7-day revenue & commission trend charts powered by Recharts
- **Site Overview** — At-a-glance count of active and workable sites
- **Smart Greeting** — Dynamic time-based greeting (Good Morning / Afternoon / Evening)

### 📅 Attendance Management
- **Date Selection** — Record attendance for today or any past date
- **Site-based Tracking** — Select a site, then assign/unassign team members
- **Conflict Detection** — Workers already assigned to another site on the same day are automatically disabled
- **Smart Sorting** — Assigned workers appear first for easy management
- **Save & Delete** — Save new attendance or delete existing records with confirmation modals

### 👥 Team Management
- **Add Workers** — Add labourers and mistris with name, role, and daily wage
- **Edit & Delete** — Full CRUD operations on team members
- **Progress Reports** — Individual team member progress page with:
  - Monthly attendance calendar (present days highlighted in green)
  - Estimated monthly earnings calculation
  - Day-click modal showing which site the worker was assigned to
  - Month-by-month navigation

### 🏗️ Site Management
- **Add Sites** — Register work sites (Maliks) with name, location, labour wage, and mistri wage
- **Edit & Delete** — Full CRUD operations on sites
- **Site Progress Reports** — Detailed site analytics with:
  - Monthly activity calendar (active days highlighted)
  - Estimated monthly site revenue
  - Day-click modal showing all workers assigned on that day
  - Month-by-month navigation

### 📱 Mobile-First Design
- **Responsive Layout** — Constrained to 425px max-width for an app-like mobile experience
- **Bottom Navigation Bar** — Quick access to Dashboard, Attendance, Team, and Site sections
- **Smooth Animations** — Hover effects, scale transitions, and gradient buttons
- **Glassmorphism UI** — Modern card-based interface with subtle shadows and backdrop blur effects

### 🔔 Notifications
- **Toast Notifications** — Success/error toasts for all CRUD operations (add, edit, delete, attendance)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **[Next.js](https://nextjs.org/)** | v16 | React framework with App Router, Turbopack dev server |
| **[React](https://react.dev/)** | v19 | UI library with hooks (useState, useEffect, useMemo, useReducer, useContext) |
| **[Firebase](https://firebase.google.com/)** | v11 | Authentication (Phone OTP), Firestore (real-time database), Security Rules |
| **[Tailwind CSS](https://tailwindcss.com/)** | v4 | Utility-first CSS framework for rapid UI development |
| **[Recharts](https://recharts.org/)** | v3 | Composable charting library for financial data visualization |
| **[Lucide React](https://lucide.dev/)** | v0.555 | Modern, customizable SVG icon library |
| **[date-fns](https://date-fns.org/)** | v4 | Lightweight date utility library for formatting, intervals, and comparisons |
| **[Material Icons](https://fonts.google.com/icons)** | CDN | Google Material Icons for navigation and action icons |
| **[Inter Font](https://rsms.me/inter/)** | via next/font | Clean, modern sans-serif typeface optimized for screens |

---

## 💡 Benefits

### For Contractors
- ⏱️ **Save Time** — Replace paper registers and manual logs with instant digital attendance
- 💰 **Financial Clarity** — Real-time revenue and commission tracking to know your earnings daily
- 📈 **Performance Insights** — Monthly progress reports for each worker and site
- 🚫 **No Double-Booking** — Automatic conflict detection prevents assigning a worker to two sites on the same day
- 📲 **Access Anywhere** — Mobile-optimized web app accessible from any smartphone browser

### For Teams
- 📋 **Transparent Records** — Clear attendance history with calendar views
- 💵 **Wage Tracking** — Estimated monthly earnings for each team member based on actual attendance
- 🔒 **Data Security** — Firebase Authentication ensures only authorized users access their own data

### Technical Benefits
- ⚡ **Real-time Sync** — Firestore's `onSnapshot` provides instant updates across devices
- 🚀 **Blazing Fast** — Next.js 16 with Turbopack for sub-second hot module replacement
- 🧩 **Modular Architecture** — Clean separation of concerns with Context API, Reducers, and database abstraction layers
- 🔄 **Optimistic UI** — Immediate feedback with toast notifications for every action
- 📦 **Zero Server Costs** — Fully serverless architecture on Firebase + Vercel
- 🛡️ **Secure by Design** — Firestore security rules ensure users can only access their own data

---

## 📁 Project Structure

```
Labour-attendance-by-VibeCoder/
├── public/                        # Static assets
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── layout.js              # Root layout with StateProvider & AuthWrapper
│   │   ├── page.js                # Root redirect → /dashboard
│   │   ├── globals.css            # Global styles & mobile viewport
│   │   ├── attendance/page.js     # Attendance recording page
│   │   ├── dashboard/page.js      # Dashboard overview page
│   │   ├── signin/page.js         # Phone OTP sign-in page
│   │   ├── team/page.js           # Team management page
│   │   ├── team-progress/[id]/    # Individual team member progress
│   │   ├── site/page.js           # Site management page
│   │   └── site-progress/[id]/    # Individual site progress
│   ├── component/                 # Reusable React components
│   │   ├── AppContent.js          # App shell with bottom nav
│   │   ├── AttendancePage.js      # Attendance UI with laborer cards
│   │   ├── AuthWrapper.js         # Auth guard & profile setup trigger
│   │   ├── BottomNavBar.js        # Bottom navigation with 4 tabs
│   │   ├── Dashboard.js           # Dashboard with stats & charts
│   │   ├── FinancialChart.js      # 7-day revenue/commission area chart
│   │   ├── PageLayout.js          # Shared page header with profile dropdown
│   │   ├── ProfileSetupModal.js   # First-time user profile creation
│   │   ├── TeamList.js            # Team member list view
│   │   ├── TeamMember.js          # Individual team member card
│   │   ├── TeamMemberProgress.js  # Team member attendance calendar
│   │   ├── SiteList.js            # Site list view
│   │   ├── SiteItem.js            # Individual site card
│   │   ├── SiteProgress.js        # Site activity calendar
│   │   ├── AddTeamForm.js         # Add team member modal form
│   │   ├── EditTeamForm.js        # Edit team member modal form
│   │   ├── AddSite.js             # Add site modal form
│   │   ├── EditSiteForm.js        # Edit site modal form
│   │   ├── Loader.js              # Loading spinner component
│   │   └── Notification.js        # Toast notification component
│   ├── context/                   # Global state management
│   │   ├── context.js             # React Context + Provider with all actions
│   │   └── reducer.js             # State reducer for dispatching updates
│   ├── database/                  # Firebase Firestore operations
│   │   ├── index.js               # CRUD: addWorker, addSite, addAttendance, etc.
│   │   ├── adding.js              # Additional add operations
│   │   ├── update.js              # Update operations
│   │   ├── delete.js              # Delete operations
│   │   └── getRealtime.js         # Real-time snapshot listeners
│   └── firebase.js                # Firebase app initialization & exports
├── firestore.rules                # Firestore security rules
├── next.config.mjs                # Next.js configuration
├── tailwind.config.mjs            # Tailwind CSS configuration
├── postcss.config.mjs             # PostCSS configuration
├── package.json                   # Dependencies & scripts
└── README.md                      # You are here!
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** or **yarn**
- **Firebase Project** with Firestore and Phone Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SomnathBhunia-dev/Labour-attendance-by-VibeCoder.git
   cd Labour-attendance-by-VibeCoder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

---

## 🗄️ Firestore Data Model

```
users/
└── {userId}/                      # Contractor profile
    ├── name, role, phoneNumber
    ├── workers/                   # Sub-collection
    │   └── {workerId}/
    │       ├── name, role, dailyWage, avatar, uid
    ├── sites/                     # Sub-collection
    │   └── {siteId}/
    │       ├── name, location, laborWage, mistriWage, avatar, uid
    └── dailyAttendance/           # Sub-collection
        └── {siteId_date}/
            ├── siteId, siteName, date
            ├── laborerCount
            ├── presentLaborerIds[]
            └── presentLaborers{}
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/SomnathBhunia-dev">Somnath Bhunia</a>
</p>
