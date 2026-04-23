# Full-Stack Job Portal

A complete, production-ready Job Portal built with **React.js + Spring Boot + MongoDB**.

---

## 📁 Project Structure

```
job-portal/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/jobportal/
│   │   ├── JobPortalApplication.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── JobController.java
│   │   │   ├── ApplicationController.java
│   │   │   └── FileController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── JobService.java
│   │   │   ├── ApplicationService.java
│   │   │   └── FileStorageService.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── JobRepository.java
│   │   │   └── ApplicationRepository.java
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Job.java
│   │   │   └── Application.java
│   │   ├── dto/
│   │   │   ├── AuthDTO.java
│   │   │   ├── JobDTO.java
│   │   │   └── ApplicationDTO.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── MvcConfig.java
│   │   ├── security/
│   │   │   ├── JwtUtils.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── CustomUserDetailsService.java
│   │   └── exception/
│   │       ├── GlobalExceptionHandler.java
│   │       ├── ResourceNotFoundException.java
│   │       ├── UnauthorizedException.java
│   │       ├── BadRequestException.java
│   │       └── ErrorResponse.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                         # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── JobCard.js
│   │   │   ├── MatchBadge.js
│   │   │   └── ResumeUpload.js
│   │   └── pages/
│   │       ├── Login.js
│   │       ├── Register.js
│   │       ├── JobList.js
│   │       ├── JobDetail.js
│   │       ├── Dashboard.js
│   │       ├── PostJob.js
│   │       └── EditJob.js
│   ├── package.json
│   └── nginx.conf
│
└── README.md
```

---

## ✅ Features

| Feature | Details |
|---|---|
| 🔐 Auth | JWT Login/Register with BCrypt password hashing |
| 👤 Roles | JOBSEEKER and RECRUITER |
| 💼 Job Management | Create, Edit, Delete (Recruiter only) |
| 🔍 Job Search | Search by title or location |
| 📋 Apply | Job seekers apply with optional cover letter |
| 📊 Dashboard | Seeker: view applied jobs. Recruiter: view applicants, update status |
| 📄 Resume Upload | Upload PDF resume, stored on server |
| 🎯 Skill Match | % match score based on skill comparison |

---

## 🚀 How to run

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MongoDB 6+ running locally

---

### Step 1 — Start MongoDB

**Option 1: MongoDB installed locally**
```bash
mongod --dbpath /data/db
```

**Option 2: MongoDB via Docker (just the DB)**
```bash
docker run -d -p 27017:27017 --name mongo mongo:7.0
```

MongoDB will auto-create the `jobportal` database on first use.

---

### Step 2 — Run the Backend

```bash
# Navigate to backend folder
cd job-portal/backend

# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

You should see:
```
Started JobPortalApplication in X.XXX seconds
```

---

### Step 3 — Run the Frontend

Open a new terminal:

```bash
# Navigate to frontend folder
cd job-portal/frontend

# Install dependencies
npm install

# Start the dev server
npm start
```

Frontend starts at: **http://localhost:3000**

---

## 🌐 API Endpoints Reference

### Auth
| Method | URL | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get logged-in user profile |

### Jobs
| Method | URL | Auth | Description |
|---|---|---|---|
| GET | /api/jobs/all | Public | List all active jobs |
| GET | /api/jobs/search?keyword=X | Public | Search jobs |
| GET | /api/jobs/{id} | Public | Get job by ID |
| POST | /api/jobs | RECRUITER | Create new job |
| PUT | /api/jobs/{id} | RECRUITER | Update job |
| DELETE | /api/jobs/{id} | RECRUITER | Delete job |
| GET | /api/jobs/my-jobs | RECRUITER | Get recruiter's own jobs |

### Applications
| Method | URL | Auth | Description |
|---|---|---|---|
| POST | /api/applications/apply | JOBSEEKER | Apply for a job |
| GET | /api/applications/my-applications | JOBSEEKER | View own applications |
| GET | /api/applications/job/{jobId} | RECRUITER | View applicants for a job |
| PUT | /api/applications/{id}/status | RECRUITER | Update application status |

### Files
| Method | URL | Auth | Description |
|---|---|---|---|
| POST | /api/files/upload-resume | Any | Upload PDF resume |

---

## 📦 Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Spring Boot 3.2, Spring Security |
| Database | MongoDB (via Spring Data MongoDB) |
| Auth | JWT (jjwt 0.11.5) + BCrypt |
| Build | Maven (backend), npm (frontend) |
| Container | Docker + Docker Compose |
