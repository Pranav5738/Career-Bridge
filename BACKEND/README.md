# Career-Bridge Backend

Express + MongoDB API for Career-Bridge.

## Setup

```bash
npm install
```

Create a local `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/career-bridge
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## Run

```bash
npm run dev
```

## Key Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/profile`
- `PATCH /api/user/profile`
- `GET /api/forum/posts`
- `POST /api/forum/posts`
- `PATCH /api/forum/posts/:postId`
- `DELETE /api/forum/posts/:postId`
- `GET /api/marketplace/mentors`
- `POST /api/marketplace/save`
- `POST /api/marketplace/book`

## Test

```bash
npm test
```
