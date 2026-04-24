# Intelligence Query engine

A RESTful API for querying and filtering demographic profile data. Built with Node.js, Express, and PostgreSQL.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Seeding Data](#seeding-data)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## Overview

Intelligence Query Engine API provides endpoints to retrieve and search demographic profiles with support for filtering by gender, age, age group, country, and probability thresholds. It also supports natural language search queries such as `"young males from nigeria"`.

---

## Live Demo

```
https://intelligence-query-engine.vercel.app/api/profiles

```

Example requests:

```
https://intelligence-query-engine.vercel.app/api/profiles
https://intelligence-query-engine.vercel.app/api/profiles?gender=male&country_id=NG&limit=5
https://intelligence-query-engine.vercel.app/api/profiles/search?q=young males from nigeria
```

---

## Project Structure

```
INTELLIGENCE-QUERY-ENGINE/
│
├── src/
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   │
│   ├── controllers/
│   │   └── profileController.js # Request handlers
│   │
│   ├── routes/
│   │   └── profileRoutes.js     # Route definitions
│   │
│   ├── services/
│   │   └── queryBuilder.js      # Dynamic SQL query builder
│   │
│   ├── utils/
│   │   ├── parser.js            # Natural language query parser
│   │   └── validator.js         # Input validation helpers
│   │
│   ├── seed/
│   │   └── seed.js              # Database seeding script
│   │
│   └── app.js                  # Express app entry point
│
├── data/
│   └── seed_profiles.json      # Seed dataset
│
├── package.json
├── .env
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/download/) 15 or higher
- npm

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/UkannaRaymond/intelligence-Query-Engine.git
cd intelligence-query-engine
npm install
```

---

## Database Setup

Make sure your PostgreSQL server is running, then open the psql shell:

```bash
# Linux / macOS
psql -U postgres

# Windows
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h 127.0.0.1
```

Run the following SQL commands:

```sql
CREATE USER insighta_user WITH PASSWORD 'yourpassword';
CREATE DATABASE insighta_db OWNER insighta_user;
GRANT ALL PRIVILEGES ON DATABASE insighta_db TO insighta_user;
\c insighta_db

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  gender VARCHAR(10),
  gender_probability FLOAT,
  age INTEGER,
  age_group VARCHAR(50),
  country_id CHAR(2),
  country_name VARCHAR(100),
  country_probability FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

\q
```

### Cloud (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**, give it a name and a strong password
3. Once provisioned, click **SQL Editor** in the left sidebar
4. Run the same `CREATE TABLE` statement above
5. Go to **Connect** (top of dashboard) or **Project Settings** → **Database** → copy the **Connection string (URI)**
6. Replace `[YOUR-PASSWORD]` with your database password and append `?sslmode=require`:

```
postgresql://postgres:yourpassword@db.xxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/insighta_db
PORT=3000
```

---

## Seeding Data

Place your dataset at `data/seed_profiles.json` in the following format:

```json
{
  "profiles": [
    {
      "name": "John Doe",
      "gender": "male",
      "gender_probability": 0.95,
      "age": 28,
      "age_group": "adult",
      "country_id": "NG",
      "country_name": "Nigeria",
      "country_probability": 0.8
    }
  ]
}
```

Then run:

```bash
node src/seed/seed.js
```

Expected output:

```
[db] Connected to PostgreSQL successfully.
[seed] Seeding 2026 profiles...
[seed] Done. Inserted: 2026 | Skipped (duplicate): 0 | Failed: 0
```

---

## Running the Server

```bash
node src/app.js
```

Expected output:

```
[db] Connected to PostgreSQL successfully.
[app] Server running on port 3000
```

---

## API Reference

### Base URL

```
# Local
http://localhost:3000/api/profiles

# Production
https://intelligence-query-engine.vercel.app/api/profiles
```

---

### GET `/api/profiles`

Returns a paginated list of profiles with optional filters.

**Query Parameters**

| Parameter                 | Type   | Description                | Example                                   |
| ------------------------- | ------ | -------------------------- | ----------------------------------------- |
| `gender`                  | string | Filter by gender           | `male`, `female`                          |
| `age_group`               | string | Filter by age group        | `adult`, `teenager`, `senior`, `child`    |
| `country_id`              | string | Filter by country code     | `NG`, `KE`, `AO`                          |
| `min_age`                 | number | Minimum age                | `18`                                      |
| `max_age`                 | number | Maximum age                | `35`                                      |
| `min_gender_probability`  | number | Minimum gender confidence  | `0.8`                                     |
| `min_country_probability` | number | Minimum country confidence | `0.5`                                     |
| `sort_by`                 | string | Sort field                 | `age`, `created_at`, `gender_probability` |
| `order`                   | string | Sort direction             | `asc`, `desc`                             |
| `page`                    | number | Page number                | `1`                                       |
| `limit`                   | number | Results per page (max 50)  | `10`                                      |

**Example Request**

```bash
curl "http://localhost:3000/api/profiles?gender=male&country_id=NG&limit=5"

curl "https://intelligence-query-engine.vercel.app/api/profiles?gender=male&country_id=NG&limit=5"
```

**Example Response**

```json
{
  "status": "success",
  "page": 1,
  "limit": 5,
  "total": 120,
  "data": [
    {
      "id": "019db3cd-8d03-7253-925b-20ba32e32858",
      "name": "Thabo Ndebele",
      "gender": "male",
      "gender_probability": 0.66,
      "age": 18,
      "age_group": "teenager",
      "country_id": "NG",
      "country_name": "Nigeria",
      "country_probability": 0.68,
      "created_at": "2026-04-22T06:08:05.893Z"
    }
  ]
}
```

---

### GET `/api/profiles/search`

Search profiles using a natural language query string.

**Query Parameters**

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `q`       | string | Natural language query |

**Supported keywords in `q`**

- Gender: `male`, `female`
- Age: `young` (16–24), `teenager`, `above <n>`, `below <n>`
- Country: `nigeria`, `kenya`, `angola`, `benin`

**Example Requests**

```bash
curl "http://localhost:3000/api/profiles/search?q=young males from nigeria"
curl "http://localhost:3000/api/profiles/search?q=females above 30 from kenya"
curl "http://localhost:3000/api/profiles/search?q=teenagers from angola"
```

```bash
curl "https://intelligence-query-engine.vercel.app/api/profiles/search?q=young males from nigeria"
curl "https://intelligence-query-engine.vercel.app/api/profiles/search?q=females above 30 from kenya"
curl "https://intelligence-query-engine.vercel.app/api/profiles/search?q=teenagers from angola"
```

**Example Response**

```json
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 45,
  "data": [...]
}
```

**Error Response (unrecognisable query)**

```json
{
  "status": "error",
  "message": "Unable to interpret query"
}
```

---

## Deployment

### Supabase (Database)

This project uses [Supabase](https://supabase.com) as the cloud PostgreSQL database.

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project and note your database password
3. Run the `CREATE TABLE` SQL in the Supabase **SQL Editor**
4. Get your connection string from **Connect** (top of dashboard) or **Project Settings** → **Database**
5. Append `?sslmode=require` to the end of the connection string
6. Use this as your `DATABASE_URL` environment variable

### Vercel (API Hosting)

This project is deployed on [Vercel](https://vercel.com) using the configuration in `vercel.json`.

**Deploy from CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

**Add environment variable:**

```bash
vercel env add DATABASE_URL
```

Paste your Supabase connection string when prompted and select all environments. Then redeploy:

```bash
vercel --prod
```

**`vercel.json` configuration:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ]
}
```

> **Note:** The warning `builds existing in your configuration file` is expected and can be safely ignored. It simply means Vercel uses `vercel.json` over dashboard build settings.
