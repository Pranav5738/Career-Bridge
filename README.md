# Career-Bridge

Career-Bridge is an AI-assisted mentorship and career acceleration platform with a React frontend and an Express/MongoDB backend. Core flows now persist to the database for authentication, profile updates, forum posts, and marketplace mentor actions.

## Structure

```
Career-Bridge/
├── BACKEND/   # Express API + MongoDB models/controllers
├── FRONTEND/  # React + Vite application
├── README.md
└── package.json
```

## Quick Start

Install dependencies in both app folders:

```bash
cd BACKEND
npm install

cd ../FRONTEND
npm install
```

Create `BACKEND/.env` with your database and auth settings, then keep `FRONTEND/.env.local` pointed at the API:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/career-bridge
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Run both apps from separate terminals:

```bash
cd BACKEND && npm run dev
cd FRONTEND && npm run dev
```

## Working CRUD Flows

- Authentication: register and login are stored in MongoDB.
- Profile: users can read and update their profile fields.
- Forum: users can create, read, edit, and delete posts.
- Marketplace: users can browse mentors, save mentors, and book sessions.

## Verification

The current workspace passes the frontend build, frontend lint, and backend test suite.

## Notes

- `FRONTEND/.env.local` defaults `VITE_API_URL` to `http://localhost:5000`.
- The backend exposes the API under `/api/*` and requires a running MongoDB instance.

