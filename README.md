# SkillVerse Network

**The Global Guild & Archival Atelier for Living Knowledge Exchange.**
*Share a Skill. Learn Another.*

---

## 🏛️ Project Ideology & Objective

**SkillVerse Network** is a decentralized, peer-to-peer (P2P) social learning atelier. We believe knowledge itself is currency. Rather than monetary fees or passive video archives, SkillVerse runs on an internal token economy protected by cryptographic escrow: users earn tokens by sharing craft, and spend tokens to apprentice under master practitioners.

### Core Architecture & Innovations:
- **Living Atelier & Archival Codex UI**: An editorial design system inspired by independent craft ateliers (*Kinfolk*, *Are.na*, *Cosmos*), featuring vetted documentary photography, archival record cards, and tactile monospace stamps.
- **Interactive Knowledge Barter Matrix**: 1:1 trade calculator matching complementary mentors across guilds.
- **Automated Trust Escrow**: Tokens are held in platform escrow upon booking acceptance and released only upon confirmed session delivery, with automated 48-hour auto-release protection for educators.
- **Integrated Real-Time Chat & Video Studio**:
  - Full-duplex STOMP WebSocket messaging (`/ws`).
  - Browser-native WebRTC peer video room (`/session/:roomId`) with media controls.
  - Interactive calendar availability slot management.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Material-UI 5 (Custom Atelier Bone & Evergreen Theme), React Router 6, TanStack Query, Framer Motion, Lucide Icons |
| **Backend** | Java 17+ / Spring Boot 3.1.5, Spring Security (Stateless JWT), Spring Data JPA, Spring WebSocket (STOMP), Flyway Migrations |
| **Database** | PostgreSQL 15 (with Flyway V1 schema migrations and automated schema initialization) |
| **Realtime** | SockJS, STOMP protocol, RTCPeerConnection (WebRTC) |
| **Containers** | Multi-stage Dockerfiles (`eclipse-temurin:17-jre-alpine`, `nginx:alpine`), Docker Compose turnkey cluster |

---

## 🚀 Quickstart & Deployment

### Option A: One-Command Turnkey Deployment (Docker Compose)
The entire stack (PostgreSQL + Spring Boot API + React Nginx SPA) is containerized and pre-wired:
```bash
docker-compose up --build
```
- **Web Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **Database**: PostgreSQL on `localhost:5432` (`db: skillverse`, `user: postgres`)

---

### Option B: Local Development

#### 1. Backend Service
```bash
cd SkillVerse-Network/backend

# Configure local environment (or rely on defaults in application.properties)
# Defaults connect to localhost:5432/skillverse with credentials postgres/password
mvn clean spring-boot:run
```
*Health Check & Actuator*: `http://localhost:8080/actuator/health`

#### 2. Frontend Client
```bash
cd SkillVerse-Network/frontend

# Install dependencies and start development server
npm install
npm start
```
*Application runs at*: `http://localhost:3000`

---

## 🔑 Environment Configuration

### Backend (`SkillVerse-Network/backend/.env`)
| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `8080` | HTTP listener port |
| `DB_URL` | `jdbc:postgresql://localhost:5432/skillverse` | PostgreSQL JDBC connection URL |
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | `password` | Database password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | JPA DDL schema synchronization |
| `SPRING_FLYWAY_ENABLED` | `true` | Flyway database migration runner |
| `JWT_SECRET` | *(Default 256-bit secure secret)* | HMAC-SHA signing key for JWT tokens |
| `JWT_EXPIRATION_MS` | `86400000` (24 Hours) | Token lifetime |

### Frontend (`SkillVerse-Network/frontend/.env`)
| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `REACT_APP_API_URL` | `http://localhost:8080` | Base URL of the Spring Boot API |

---

## 📦 Production Build Verification

Both backend and frontend have been compiled and verified:
```bash
# Backend JAR package
cd SkillVerse-Network/backend
mvn clean package -DskipTests

# Frontend static asset build
cd SkillVerse-Network/frontend
npm run build
```
Result: Zero compilation errors, optimized chunking, and self-contained static assets ready for Nginx or CDN deployment.
