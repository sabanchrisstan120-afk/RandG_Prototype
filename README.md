# R&G Aircon Repair and Installation Service Center Management System

A modern, clean, interactive web application prototype built for **R&G Aircon Repair and Installation Service Center**.

The system streamlines operations between two core roles:
- **Admin**: Complete operational control — service dispatch, technician assignment and reassignment, customer history, real-time workload monitoring, technician-customer tracking, and reporting.
- **Technician**: A streamlined, mobile-optimized interface focusing on getting work done — viewing assigned jobs, updating job status, and submitting quick completion reports with photo uploads.

---

## 🚀 Key Features

### 🛠️ Admin Portal
- **Operational Dashboard**: Real-time stats on assignments, in-progress jobs, completed tasks, workload distribution, and recent activity.
- **Service Assignment Workflow**: Create service jobs with unique IDs (e.g. `SRV-2026-0001`), customer information, aircon specifications, and technician assignments.
- **Technician Reassignment Tracking**: Audit trail capturing previous technicians, new technicians, timestamps, and reassignment reasons without overwriting history.
- **Technician–Customer Records**: Cross-referenced records detailing all interactions between technicians and customers, tracking unique customers served vs total jobs.
- **Customer & Technician Management**: Complete profiles, full service histories, and account status management.
- **Reports & Analytics**: Visual breakdown of job statuses, service types (repair, cleaning, installation, maintenance), and technician performance.

### 📱 Technician Portal
- **Simplified Job Queue**: Clean mobile-first view of Today's Assignments, In-Progress work, and Completed jobs.
- **One-Click Actions**: Quickly change status ("Start Job", "Put On Hold", "Complete Job").
- **Quick Completion Report**: Zero redundant data entry — enter work performed, optional findings, upload before-and-after photos, and confirm completion.
- **Photo Uploader**: Client-side photo upload and preview support.

---

## 💻 Tech Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Design System**: Tailored Philippine service enterprise aesthetic (Navy `#0A2342`, Teal `#2EC4B6`, Light Gray `#F7F7F7`)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Navigate to project folder
cd "R&G prototype"

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running locally at `http://localhost:5173/`.

### Building for Production
```bash
npm run build
```

---

## 📄 License
This project is proprietary and intended for R&G Aircon Repair and Installation Service Center.
