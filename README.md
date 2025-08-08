# 🔧 CheckMate - Smart Maintenance Management System

[![Build Status](https://img.shields.io/github/actions/workflow/status/udayputtireddi/checkmate/main.yml?branch=main&style=for-the-badge)](https://github.com/udayputtireddi/checkmate/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/react-18-blue.svg?style=for-the-badge)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.2.2-3178C6.svg?style=for-the-badge)](https://www.typescriptlang.org/)

CheckMate is a production-ready maintenance management application designed to streamline operations in manufacturing and industrial environments. It replaces manual, paper-based checklists with a smart, digital solution featuring QR code integration, real-time tracking, and comprehensive reporting.

![CheckMate Application Screenshot Banner](https://user-images.githubusercontent.com/your-username/your-repo/screenshot_banner.png)  ---



## 🚀 Live Demo & Usage

Experience CheckMate in action.

**Admin Login:**
-   **Email:** `admin@company.com`
-   **Password:** (any password)

**Operator Login:**
-   **Email:** `operator@company.com`
-   **Password:** (any password)

### Core Workflows

**👤 For Operators:**
1.  **Login** with your assigned company email.
2.  **Scan a QR code** on a machine to view its maintenance checklist.
3.  **Complete** tasks, attaching photos where required.
4.  **Save progress** or mark the entire checklist as complete.

**👑 For Administrators:**
1.  **Login** with your admin credentials.
2.  **Manage Users** and departments from the dashboard.
3.  **Upload Schedules** via Excel/CSV import to define maintenance tasks.
4.  **Monitor Progress** in real-time across the facility.
5.  **Generate Reports** to analyze performance and ensure compliance.

### 🖼️ Screenshots

| Login Screen | Operator Task View | Admin Dashboard |
| :----------: | :----------------: | :-------------: |
| ![Login Screen](https://user-images.githubusercontent.com/your-username/your-repo/screenshot1.png) | ![Task View](https://user-images.githubusercontent.com/your-username/your-repo/screenshot2.png) | ![Admin Dashboard](https://user-images.githubusercontent.com/your-username/your-repo/screenshot3.png) |
| Photo Documentation | Report Generation | Mobile Responsive |
| ![Photo Upload](https://user-images.githubusercontent.com/your-username/your-repo/screenshot4.png) | ![Reports](https://user-images.githubusercontent.com/your-username/your-repo/screenshot5.png) | ![Mobile View](https://user-images.githubusercontent.com/your-username/your-repo/screenshot6.png) |

---

## 🛠️ Tech Stack

This project is built with a modern, scalable, and maintainable technology stack.

| Category                | Technology                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend** | [React 18](https://reactjs.org/) (with TypeScript), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/), [React Router](https://reactrouter.com/), [Lucide Icons](https://lucide.dev/) |
| **Backend & Data** | [Node.js](https://nodejs.org/) (conceptual), Client-Side Logic, [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), Base64 Encoding      |
| **Deployment & CI/CD** | [Firebase Hosting](https://firebase.google.com/docs/hosting), [GitHub Actions](https://github.com/features/actions)                                                     |
| **Development Tools** | [npm](https://www.npmjs.com/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)                                                                           |
---

## ⚙️ Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

-   Node.js v18.x or later
-   `npm` or `yarn` package manager

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/udayputtireddi/checkmate.git](https://github.com/udayputtireddi/checkmate.git)
    cd checkmate
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    # The name of your application
    VITE_APP_NAME=CheckMate

    # For local development, you may not need an API URL if fully client-side
    # VITE_API_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build:
```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

### 🏗️ Project Structure
```bash
checkmate/
├── client/                 # Frontend React application source
│   ├── components/         # Reusable UI components (Buttons, Modals, etc.)
│   ├── pages/              # Application pages/routes (Login, Dashboard, etc.)
│   ├── lib/                # Utility functions, services, and constants
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets (icons, images)
├── dist/                   # Production build output
├── .github/                # GitHub-specific files (e.g., CI/CD workflows)
├── firebase.json           # Firebase hosting configuration
├── package.json            # Project dependencies and scripts
└── README.md               # You are here!
