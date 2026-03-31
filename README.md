# Maara Bank — Full Stack Banking System

Maara Bank is a modern, full-stack web application built to simulate a real-world banking environment. It features a robust Java Spring Boot backend and a premium, responsive Single Page Application (SPA) frontend utilizing vanilla JavaScript and Vite.

## 🌟 Key Features

### Authentication & Security
*   **JWT (JSON Web Tokens):** Secure, stateless authentication. Tokens are generated on login and required for all protected API routes.
*   **Role-Based Access Control (RBAC):** Users are assigned either a `USER` or `ADMIN` role. 
    *   *Users* can perform transactions and view their own history.
    *   *Admins* have access to a dedicated dashboard to approve or reject pending account registrations.
*   **Account Status Verification:** New users are placed in a `PENDING` state and cannot perform transactions until an Admin approves their account.

### Core Banking Operations
*   **Deposits & Withdrawals:** Users can add or remove funds from their assigned account.
*   **Peer-to-Peer Transfers:** Users can instantly transfer money to other users using their unique alphanumeric Account ID (e.g., `Acc292628`).
*   **Transaction History:** A detailed, filterable ledger of all incoming and outgoing transactions (Deposits, Withdrawals, Transfers), complete with timestamps and status tracking.
*   **Account Generation:** Upon admin approval, users are automatically provisioned a unique bank account number with an initial zero balance.

### Premium Frontend Experience
*   **Modern SPA Architecture:** Built with Vite for rapid development and lightning-fast client-side routing. No page reloads.
*   **Glassmorphism UI:** A stunning, dark-themed user interface featuring semi-transparent frosted glass elements, floating cards, and animated mesh gradients.
*   **Custom Toast Notifications:** Non-intrusive, animated feedback alerts for successes and errors.
*   **Responsive Design:** Fully mobile-friendly layouts utilizing CSS Grid and Flexbox.

---

## 🏗️ Technical Architecture

### Backend (Java Spring Boot)
*   **Framework:** Spring Boot 3.x
*   **Data Access:** Spring Data JPA + Hibernate (connecting to MySQL).
*   **Security:** Spring Security + `jjwt` library for token parsing/generation.
*   **Key Controllers:**
    *   `AuthController`: Manages `/api/auth/register` and `/api/auth/login`.
    *   `TransactionController`: Handles `/transactions/deposit`, `/withdraw`, `/transfer`, and `/view`.
    *   `AdminController`: Secured endpoints (`/api/admin/*`) for user management.
    *   `UserController`: Serves profile and account data (`/api/user/*`).

### Frontend (Vite + Vanilla JS)
*   **Build Tool:** Vite (port 5173).
*   **Styling:** Pure vanilla CSS (`style.css`) leveraging native CSS variables for theme management.
*   **Routing:** Custom client-side router (`main.js`) mapping URL paths to JavaScript render functions (`/dashboard`, `/transfer`, etc.) with built-in route guards to protect authenticated and admin-only pages.
*   **API Client:** A centralized `api.js` interceptor that automatically attaches the JWT token from `localStorage` to all outbound `fetch` requests.

---

## 🚀 How to Run the Project

1. **Database:** Ensure your MySQL server is running and the database specified in `application.properties` exists.
2. **Backend:** Open the `BankingSystem` root directory and run the Spring Boot application (runs on `http://localhost:8080`).
3. **Frontend:** 
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 👥 Usage Flow Test
1. Register a new account.
2. Observe you cannot yet do transactions (Account is pending).
3. Log in with an Admin account (you may need to manually set a user's role to `ADMIN` in the database for the first time).
4. Go to the Admin Panel and approve the new user.
5. Log back in as the new user to view your generated Account ID and start depositing and transferring money!
