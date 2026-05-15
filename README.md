# Recommendation Comparison System

Recommendation Comparison System is a MERN-style web application for browsing, recommending, and comparing educational institutions in Nepal. The repository contains a React/Vite frontend and an Express/MongoDB backend.

## Project Structure

```text
Recomendation_Comparison_System/
├── Educational_Institute/   # React frontend
├── serveBackEnd/            # Express backend API
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB Atlas connection string or a local MongoDB database
- Mapbox access token for map features

## Environment Setup

Create environment files from the included examples.

Frontend:

```bash
cd Educational_Institute
cp .env.example .env
```

Required frontend variables:

```env
VITE_API_BASE_URL=http://localhost:8800
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

Backend:

```bash
cd serveBackEnd
cp .env.example .env
```

Required backend variables:

```env
NODE_ENV=development
PORT=8800
DATABASE_URI=your_mongodb_atlas_connection_string
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
REFRESH_TOKEN_SECRET=replace_with_a_different_long_random_secret
CORS_ORIGINS=http://localhost:5173
```

Do not commit real `.env` files or production secrets.

## Install Dependencies

Install frontend dependencies:

```bash
cd Educational_Institute
npm install
```

Install backend dependencies:

```bash
cd serveBackEnd
npm install
```

## Run Locally

Start the backend API:

```bash
cd serveBackEnd
npm run dev
```

The backend runs on `http://localhost:8800` by default.

Start the frontend in another terminal:

```bash
cd Educational_Institute
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Build and Verification

Build the frontend:

```bash
cd Educational_Institute
npm run build
```

Preview the production build:

```bash
cd Educational_Institute
npm run preview
```

Run frontend linting:

```bash
cd Educational_Institute
npm run lint
```

## Deployment Notes

- Frontend deployment config is in `Educational_Institute/vercel.json`.
- Backend deployment config is in `serveBackEnd/render.yaml`.
- Set production environment variables in the hosting provider dashboard.
- Update `VITE_API_BASE_URL` to the deployed backend URL.
- Update backend `CORS_ORIGINS` to include the deployed frontend URL.

## Git Notes

The repository ignores dependency folders, build output, local environment files, and logs:

- `node_modules/`
- `dist/`
- `.env`
- `.env.local`
- `logs/`

Commit source code, configuration examples, and deployment config only. Do not commit generated dependency folders or local secrets.

## Project Management

Jira board:
https://compare-recommendation.atlassian.net/jira/software/projects/RCS/boards/1?assignee=712020%3Aa2c45b01-902e-4a66-928c-78c0acb62975
