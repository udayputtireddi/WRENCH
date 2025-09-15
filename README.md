# 🔧 WRENCH - Professional Maintenance Management System

[![Build Status](https://img.shields.io/github/actions/workflow/status/udayputtireddi/CheckMate/main.yml?branch=main&style=for-the-badge)](https://github.com/udayputtireddi/CheckMate/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/react-18-blue.svg?style=for-the-badge)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.5.3-3178C6.svg?style=for-the-badge)](https://www.typescriptlang.org/)

WRENCH is a comprehensive, production-ready maintenance management system designed for manufacturing and industrial environments. Built with modern web technologies, it provides a complete solution for managing maintenance tasks, equipment, teams, and reporting. WRENCH is a comprehensive, production-ready maintenance management system designed for manufacturing and industrial environments. Built with modern web technologies, it provides a complete solution for managing maintenance tasks, equipment, teams, and reporting.


## ✨ Key Features

### 🔧 Maintenance Management
- **Task Scheduling**: Automated daily, weekly, monthly, and yearly maintenance schedules
- **Machine Management**: Complete equipment database with task assignments
- **Task Completion Tracking**: Progress tracking with photo documentation and completion history
- **QR Code Integration**: Quick machine access via scanning functionality

### 👥 User & Role Management
- **Role-Based Access Control**: Admin and Operator roles with appropriate permissions
- **User Management**: Complete user lifecycle management from admin dashboard
- **Team Organization**: Department-based user organization for streamlined operations

### 📊 Analytics & Reporting
- **Professional Reports**: Comprehensive reporting with customizable date ranges
- **Business Intelligence**: Task completion rates, performance metrics, and efficiency analytics
- **Export Capabilities**: CSV and JSON export options for all data
- **Photo Documentation**: Task completion with photo evidence

### 🎨 Professional UI/UX
- **Modern Design System**: Built with Radix UI and TailwindCSS
- **Mobile-First**: Optimized for tablets and mobile devices in industrial settings
- **Dark/Light Theme**: Professional theming with WRENCH brand colors
- **Responsive Layout**: Works seamlessly across all device sizes

---

## 🚀 Live Demo

Experience WRENCH in action with these demo credentials:

**Admin Access:**
- **Email:** `admin@company.com`
- **Password:** `admin123`

**Operator Access:**
- **Email:** `operator@company.com`  
- **Password:** `operator123`

### Core Workflows

**👤 For Operators:**
1. Login with company credentials
2. View assigned maintenance tasks
3. Complete tasks with photo documentation
4. Track progress and save work in real-time

**👑 For Administrators:**
1. Access comprehensive admin dashboard
2. Manage users, machines, and departments
3. Import maintenance schedules from Excel/CSV
4. Generate detailed reports and analytics
5. Export data for compliance and auditing

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **UI Components** | Radix UI, Lucide Icons, CVA (Class Variance Authority) |
| **Routing** | React Router 6 (SPA mode) |
| **Backend** | Express.js (integrated with Vite dev server) |
| **Data Management** | In-memory database with export/import capabilities |
| **Authentication** | Role-based access control |
| **Deployment** | Firebase Hosting |
| **Development** | ESLint, Prettier, Vitest |

---

## 🏗️ Project Structure

```
├── client/                    # React frontend application
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Design system components (40+ components)
│   │   ├── ProfessionalHeader.tsx
│   │   ├── RoleBasedRoute.tsx
│   │   └── WrenchLogo.tsx
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Core business logic
│   │   ├── auth.ts         # Authentication service
│   │   ├── database.ts     # Data management
│   │   ├── exportSystem.ts # Report generation
│   │   └── taskCompletionTracking.ts
│   ├── pages/              # Application pages
│   │   ├── Admin.tsx       # Admin dashboard
│   │   ├── Analytics.tsx   # Analytics dashboard
│   │   ├── Reports.tsx     # Report generation
│   │   ├── Tasks.tsx       # Task management
│   │   ├── Machine.tsx     # Equipment management
│   │   └── Scanner.tsx     # QR code scanning
│   └── App.tsx             # Main application & routing
├── server/                  # Express backend
│   ├── routes/             # API endpoints
│   └── index.ts            # Server configuration
├── shared/                  # Shared types & interfaces
└── public/                  # Static assets
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+ 
- npm package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/udayputtireddi/CheckMate.git
   cd CheckMate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:8080`

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

## 📱 Application Pages

### User Pages
- **Home Dashboard**: Analytics overview and quick actions
- **Tasks**: Task list with filtering and search capabilities  
- **Machine**: Equipment-specific task management
- **Scanner**: QR code scanning for quick machine access
- **Settings**: User preferences and security settings

### Admin Pages
- **Admin Dashboard**: System overview and user management
- **Database Management**: Data import/export and system administration
- **Analytics**: Comprehensive performance metrics
- **Reports**: Advanced reporting with export capabilities

---

## 🔐 Security & Access Control

- **Role-Based Access**: Admin and Operator roles with appropriate permissions
- **Route Protection**: Client-side route guards based on user roles
- **Data Isolation**: Users only see data relevant to their role and department

---

## 📊 Data Management

### Import/Export Features
- **Excel/CSV Import**: Import maintenance schedules from vendor spreadsheets
- **Data Export**: Export all data in CSV or JSON formats
- **Photo Documentation**: Include photo attachments in exports
- **Vendor Integration**: Support for specific equipment manufacturer formats (e.g., Trumpf)

### Analytics Capabilities
- Task completion rates and trends
- Average completion times
- Machine efficiency metrics
- User performance analytics
- Department-level reporting

---

## 🚀 Deployment

The application is configured for Firebase Hosting with automatic deployment via GitHub Actions.

**Manual Deployment:**
```bash
# Build and deploy to Firebase
npm run build
firebase deploy
```

---

## 🎯 Use Cases

**Perfect for:**
- Manufacturing facilities
- Industrial maintenance teams
- Equipment service companies
- Facility management
- Compliance tracking and auditing

**Key Benefits:**
- Eliminate paper-based checklists
- Ensure maintenance compliance
- Track performance metrics
- Generate audit-ready reports
- Streamline team workflows

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📞 Support

For questions, issues, or feature requests, please open an issue on GitHub or contact the development team.

---

**WRENCH Professional Services** - *Streamlining maintenance operations with modern technology*
