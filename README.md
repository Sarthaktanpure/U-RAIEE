# U-RAIEE Portal

**Unified Research, Academic, Innovation and Entrepreneurial Ecosystem**

A full-stack institutional web portal built with the **MERN** stack (MongoDB, Express, React 18, Node.js) that guides a participant's academic work through a continuous, human-validated progression loop:

```text
Login → My Roles & Access → Participant Dashboard → Submission → Pathway Recommendation → Expert Evaluation → Refinement → Progression Review → Merit & Recognition → Outcome Verification → Academic Passport → Next Opportunity
```

---

## UI Architecture & Design System

- **Styling**: Tailwind CSS with custom institutional design system.
- **Color Palette**: Industry-grade deep slate, navy (`#0f172a`, `#1e293b`), vibrant brand blues (`#0c8be9`, `#006ec7`), emerald accents for verified achievements, and amber warnings.
- **Motion & Interaction**: Framer Motion for smooth route transitions, timeline progressions, and micro-interactions.
- **Iconography**: Lucide React icons.
- **Layout**: Glassmorphic sticky navigation bar (`backdrop-blur-md`), role-filtered sidebar, responsive tables, badge pills, and flat cards with subtle elevation (`shadow-subtle`, `shadow-card`).

---

## Seeded Role Credentials (Password for all accounts: `Demo@1234`)

Every role in the ecosystem has a dedicated, pre-configured account seeded in MongoDB Atlas:

| Role | Email | Name | Institution & Department | Active Role | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@uraiee.test` | Dr. Ramesh Kulkarni | IISc Bangalore &bull; Academic Innovation | `admin` | Approve/reject role requests, assign non-conflicting evaluators, verify outcomes, grant/revoke any role to any user (including promoting to Admin) |
| **Participant** | `participant@uraiee.test` | Aarav Sharma | COEP &bull; Electrical Engineering | `participant` | Submit research/ideas/prototypes with PDF upload, refine work per feedback, report outcomes with evidence, view Academic Passport & Merit |
| **Expert** | `expert@uraiee.test` | Dr. Sunita Varma | NITK &bull; Center for Energy Studies | `expert` | Access `/expert` queue, evaluate technical work across 4 criteria (Originality, Feasibility, Impact, Clarity: 1-5), award guidance |
| **Reviewer** | `reviewer@uraiee.test` | Prof. Rajesh Menon | IIT Bombay &bull; Energy Science | `reviewer` | Access `/reviewer` queue, evaluate author refinements, approve progression (+30 author / +15 reviewer merit) or request rework |
| **Mentor** | `mentor@uraiee.test` | Dr. Ananya Deshmukh | BITS Pilani &bull; Electrical & Electronics | `mentor` | Access `/workspace/mentor` advisory workspace and research mentoring resources |
| **Jury** | `jury@uraiee.test` | Dr. Vikram Singhania | IIT Delhi &bull; Incubation Council | `jury` | Access `/workspace/jury` evaluation workspace for institutional innovation awards |
| **Editor** | `editor@uraiee.test` | Prof. Kavita Krishnan | IIIT Hyderabad &bull; Publications Directorate | `editor` | Access `/workspace/editor` proceedings and monograph editorial workspace |
| **Coordinator** | `coordinator@uraiee.test` | Dr. Manoj Prabhakar | PREC Loni &bull; Information Technology | `coordinator` | Access `/workspace/coordinator` departmental research cluster coordination workspace |

> **Note:** The seeded participant (`participant@uraiee.test`) includes the completed reference journey: **AI-Assisted Campus Energy Monitoring System** with verified outcome **Campus Energy Baseline Validation Completed** and next opportunity unlocked: **Prototype Development, followed by IP Support**. You can also register any new participant or create new submissions anytime.

---

## Directory Architecture

```text
PREC/
├── client/
│   ├── .env                    # VITE_API_URL=http://localhost:5000/api
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/axios.js        # Axios instance with JWT interceptor
│       ├── context/AuthContext.jsx
│       ├── components/         # Navbar, Sidebar, StatusBadge, ProtectedRoute
│       ├── pages/              # Home, Auth, MyRoles, Dashboard, NewSubmission,
│       │                       # MySubmissions, SubmissionDetail, Recommendations,
│       │                       # Passport, Merit, ExpertDashboard, ExpertEvaluate,
│       │                       # ReviewerDashboard, ReviewerDecide, AdminPanel,
│       │                       # RoleWorkspace
│       └── styles/base.css     # Institutional CSS system
├── server/
│   ├── .env                    # PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
│   ├── .env.example
│   ├── package.json
│   ├── test_flow.js            # Automated end-to-end and anti-cheat test suite
│   └── src/
│       ├── config/db.js        # Mongoose connection
│       ├── models/             # User, RoleRequest, Submission, Review,
│       │                       # MeritEntry, Outcome, PassportEvent, Opportunity
│       ├── controllers/        # auth, role, submission, expert, reviewer,
│       │                       # admin, outcome, passport, merit, dashboard
│       ├── routes/             # authRoutes, roleRoutes, submissionRoutes, etc.
│       ├── middleware/         # auth.js (JWT), requireRole.js
│       ├── utils/              # recommend.js, logEvent.js, awardMerit.js
│       ├── seed/seed.js        # Database seeder
│       └── index.js            # Express API server entry
└── README.md
```

---

## Environment Variables

### Backend (`server/.env`):
```ini
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.0ltpveg.mongodb.net/uraiee?retryWrites=true&w=majority
JWT_SECRET=uraiee_super_secret_jwt_key_2026_dev
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

### Frontend (`client/.env`):
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## How to Install and Run

### 1. Database Seeding (Pre-loads catalog, users & demo journey)
```bash
cd server
npm run seed
```

### 2. Start the Backend API Server
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)

### 3. Start the Frontend Application
```bash
cd client
npm run dev
```
Client runs on: `http://localhost:5173`

### 4. Run Automated End-to-End & Anti-Cheat Tests
```bash
cd server
npm run test:flow
```

---

## Core Human Validation & Anti-Cheat Rules Enforced

1. **Separation of Evaluation Duties**: The Expert and Progression Reviewer assigned to a submission must be different individuals, and neither can be the author of the work.
2. **Authority Verification**: Only the assigned Expert can submit scores/feedback (`/api/expert/evaluate/:id`). Only the assigned Reviewer can approve progression (`/api/reviewer/decide/:id`).
3. **No Self-Verification**: A participant cannot verify their own outcome. Only users with the active `admin` role can verify outcomes (`/api/admin/outcomes/:id`).
4. **Transparent Merit Rules**:
   - Submission created: `+10` Progression Merit (Participant)
   - Refined work resubmitted: `+10` Progression Merit (Participant)
   - Progression validated: `+30` Progression Merit (Participant)
   - Outcome verified: `+50` Progression Merit (Participant)
   - Expert evaluation completed: `+15` Contribution Recognition (Expert)
   - Progression decision completed: `+15` Contribution Recognition (Reviewer)
