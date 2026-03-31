# Maara Bank Deployment Guide

Taking a full-stack Spring Boot and Vite/JavaScript application live requires hosting three distinct parts:
1.  **The Database (MySQL)**
2.  **The Backend API (Java Spring Boot)**
3.  **The Frontend SPA (Vite)**

This guide walks you through a completely **free or very low-cost** path to getting Maara Bank on the internet using modern hosting providers.

---

## 1. Host the MySQL Database
Your backend needs a database that lives on the internet, not just `localhost`.
**Recommended Free Provider:** [Aiven](https://aiven.io/) or [Railway.app](https://railway.app/).

**Steps:**
1.  Create an account and spin up a new "MySQL" instance.
2.  Once created, the provider will give you a **Connection URI**, **Host**, **Port**, **Username**, and **Password**.
3.  Save these credentials—you will need them for your backend!

---

## 2. Prepare & Deploy the Backend (Spring Boot)
**Recommended Free Provider:** [Render](https://render.com/) or [Railway.app](https://railway.app/).

Before uploading your code to GitHub and deploying, you must ensure your `application.properties` does not hardcode `localhost`.

### A. Update `application.properties`
Change your database connection to read from Environment Variables, with `localhost` as a fallback for local development:

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/banking_system}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASS:password}
```

### B. Update CORS in `AppConfig.java`
You configured CORS to allow `http://localhost:5173`. You must update this to allow your *future* frontend production URL (e.g., `https://maarabank.vercel.app`), or simply allow `*` (any origin) for testing.

```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://your-future-frontend.vercel.app"));
```

### C. Deploying to Render
1. Push your entire Spring Boot project to a GitHub repository.
2. Go to **Render** -> **New Web Service**.
3. Connect your GitHub repository.
4. Render will automatically detect it's a Maven/Java app.
5. **Build Command:** `./mvnw clean package -DskipTests`
6. **Start Command:** `java -jar target/BankingSystem-0.0.1-SNAPSHOT.jar`
7. **Environment Variables:** Add the database variables you got from Step 1 (`DB_URL`, `DB_USER`, `DB_PASS`).
8. Click Deploy! Render will give you a live API URL like `https://maara-bank-api.onrender.com`.

---

## 3. Prepare & Deploy the Frontend (Vite)
**Recommended Free Provider:** [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

### A. Update `api.js` Base URL
Your frontend is currently hardcoded to talk to your local backend. Update `frontend/src/api.js` line 5 to point to your new live backend URL:

```javascript
// Change this:
// const BASE_URL = 'http://localhost:8080';

// To the URL Render gave you in Step 2:
const BASE_URL = 'https://maara-bank-api.onrender.com';
```
*(Pro-tip: You can use `import.meta.env.VITE_API_URL` to handle local vs. production automatically, but hardcoding the production URL is the fastest way for a one-off deployment).*

### B. Deploying to Vercel
1. Push your `frontend` folder to a GitHub repository (or the same repository as the backend, just specifically selecting the `frontend` folder in Vercel).
2. Go to **Vercel** -> **Add New Project**.
3. Connect your GitHub repo. Let Vercel know that the "Root Directory" is `frontend`.
4. Vercel will automatically detect Vite. The framework preset should be `Vite`.
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. Click Deploy! Vercel will give you a beautiful, live HTTPS URL (e.g., `https://maara-bank.vercel.app`).

---

## 🚀 You're Live!
Once all three are deployed:
1. Go to your new Vercel frontend URL.
2. Register a new user. The frontend will hit your Render backend, which will save the user to your Aiven MySQL database.
3. Everything is now live on the internet!
