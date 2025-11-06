# Skillverse Network

**Share a Skill. Learn another.**

 <!-- It's a great idea to add a screenshot here -->

## Table of Contents
1.  [Project Ideology & Objective](#project-ideology--objective)
2.  [Core Concept: The P2P Skill Economy](#core-concept-the-p2p-skill-economy)
3.  [Current State: Phase One Complete](#current-state-phase-one-complete)
4.  [Technology Stack](#technology-stack)
5.  [Getting Started](#getting-started)
6.  [The Ideal App: Vision & Future Scope](#the-ideal-app-vision--future-scope)
7.  [Development Roadmap](#development-roadmap)

---

## Project Ideology & Objective

**Skillverse Network** is founded on a simple, powerful idea: **everyone has something to teach, and everyone has something to learn.**

Our core objective is to create a decentralized, peer-to-peer (P2P) social learning marketplace that removes the traditional barriers of cost and accessibility. We believe that knowledge should be a currency in itself. Instead of real money, our platform runs on a virtual, internal currency called **Tokens**, which are earned by sharing skills and spent on learning new ones.

Our ideology is **human-centric, not content-centric.** We are not a repository of video courses; we are a network for connecting people. The primary goal is to facilitate personal interactions—mentorships, one-on-one tutoring, and collaborative learning—both online and offline. The platform's success is measured by the connections made and the skills exchanged, not just the content consumed.

We aim to build a friendly, approachable, and trustworthy community where a user's expertise in one area directly funds their curiosity in another. A JavaScript developer can teach coding to earn Tokens, which they can then use to learn how to swim from another member of the community.

## Core Concept: The P2P Skill Economy

The platform is built around a closed-loop token economy designed to encourage participation and fair exchange.

*   **Earning Tokens:** Users earn Tokens primarily by teaching others. This can be through live 1:1 sessions, project reviews, or providing valuable resources.
*   **Spending Tokens:** Users spend Tokens to book sessions with other members, unlocking access to skills they want to learn.
*   **The Escrow System:** To ensure fairness and build trust, all transactions are managed by a secure escrow system. Tokens are held by the platform upon booking and are only released to the teacher after the learner confirms the session was completed, protecting both parties.
*   **No Real Money:** By abstracting away real-world currency, we lower the barrier to entry and focus purely on the value of the skills being exchanged.

## Current State: Phase One Complete

As of today, the project has successfully completed its foundational first phase, resulting in a robust Minimum Viable Product (MVP) with a strong social and economic core.

### Key Features Implemented in Phase One:

*   **🎨 Unique "Paper & Doodle" UI:** A friendly, hand-crafted design with a custom theme and decorative doodles to create a warm and approachable user experience.
*   **👤 User Authentication & Profiles:**
    *   Secure sign-up and JWT-based login system.
    *   Rich user profiles where users can edit their name, bio, and upload a custom avatar.
    *   A "skill wallet" on every profile to showcase "Skills I Can Teach" and "Skills I Want to Learn."
*   **🔍 Unified Discovery & Search:**
    *   A global search bar in the navbar for finding both skills (listings) and people (users).
    *   A dedicated search results page that displays categorized results.
*   **💼 Teacher Empowerment & Listings:**
    *   A seamless flow for users to create specific `Listings` for the skills they offer.
    *   An intelligent "Guided Pricing" system that suggests a fair token price based on similar listings in the marketplace.
*   **🤝 Interactive Transaction Flow (with Escrow):**
    *   A personal, handshake-based booking system: learners send a "Request," and teachers can "Accept" or "Decline."
    *   A secure **Escrow System** that holds tokens upon acceptance and only releases them to the teacher after the learner confirms completion.
    *   An automated 48-hour auto-release mechanism to protect teachers.
*   **📊 User Dashboard:**
    *   A central hub for users to manage their "Active" and "Historical" requests.
    *   Separate views for "Sent Requests" (as a learner) and "Received Requests" (as a teacher).
*   **🛡️ Community & Safety:**
    *   Publicly viewable profiles to encourage community browsing.
    *   A complete user reporting system with a modal for submitting detailed reports for admin review.

## Technology Stack

*   **Frontend:** React, Material-UI (with a highly customized "Paper" theme), React Router, Axios.
*   **Backend:** Java, Spring Boot, Spring Security (JWT), Spring Data JPA.
*   **Database:** H2 (In-Memory for development).
*   **Deployment:** (To be determined) Docker, with plans for Vercel (Frontend) and a cloud provider like Render or AWS (Backend).

## Getting Started

1.  **Backend:**
    *   Clone the repository.
    *   Navigate to the `backend/` directory.
    *   Ensure you have Java (JDK 17+) and Maven installed.
    *   Run `mvn spring-boot:run`. The server will start on `localhost:8080`.
2.  **Frontend:**
    *   Navigate to the `frontend/` directory.
    *   Run `npm install` to install dependencies.
    *   Run `npm start`. The application will be available at `http://localhost:3000`.

## The Ideal App: Vision & Future Scope

The ultimate vision for Skillverse Network is to be the go-to platform for frictionless, P2P skill exchange globally. The ideal app will be a vibrant ecosystem with deep social integration and powerful learning tools.

### Future Features Envisioned:

*   **Gamification & Reputation:** A deep reputation system with badges, achievements (e.g., "First Session Taught," "10 Skills Learned"), leaderboards, and learning streaks to incentivize consistent participation.
*   **Real-time Communication:** Integrated, private messaging between users to discuss session details before booking, and a built-in WebRTC video client for live online sessions (removing the need for external links).
*   **Advanced Learning Formats:**
    *   **Courses:** Allow teachers to create multi-part courses with video modules and resources.
    *   **Group Sessions & Workshops:** Enable teachers to host one-to-many sessions for a lower per-person token price.
*   **Offline & Location-Based Discovery:** A map-based search to find local teachers for in-person skills like swimming, guitar, or cooking.
*   **Skill Validation & Challenges:**
    *   Quizzes and projects to validate a user's proficiency in a skill, earning them a "Verified Skill" badge on their profile.
    *   Community-wide learning challenges (e.g., "Learn Python in 30 Days") with token rewards.
*   **Mobile App:** A native mobile application (React Native) for learning on the go.
*   **Advanced AI & Matchmaking:** An intelligent recommendation engine that proactively suggests connections: "We noticed you want to learn Guitar. Fiona, who is highly rated, has an open slot that matches your availability."

## Development Roadmap

The project will proceed in iterative phases, building upon our solid foundation.

*   **Phase 1 (Complete):** Foundational MVP, Social & Trust Layer, Discovery, and Teacher Empowerment.

*   **Phase 2: The Engagement & Communication Layer (Next Steps)**
    *   **[P2.1]** Implement real-time user-to-user messaging.
    *   **[P2.2]** Integrate a basic in-browser WebRTC video client for live sessions.
    *   **[P2.3]** Build a notification system (e.g., a notification bell in the navbar) for new messages and booking requests.
    *   **[P2.4]** Introduce basic gamification: award badges for key milestones (first session, first 100 tokens earned, etc.).

*   **Phase 3: The Advanced Learning Layer**
    *   **[P3.1]** Develop the functionality for teachers to create multi-part courses.
    *   **[P3.2]** Implement group session/workshop functionality.
    *   **[P3.3]** Build a skill validation system with quizzes.

*   **Phase 4: The Mobile & Global Layer**
    *   **[P4.1]** Begin development of the React Native mobile application.
    *   **[P4.2]** Implement location-based features for discovering offline skills.
    *   **[P4.3]** Add localization and internationalization (i18n) support.