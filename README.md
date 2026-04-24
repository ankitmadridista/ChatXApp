# ChatXApp

A real-time chat application built with React, Node.js/Express, MongoDB, and Socket.IO. Users can register, pick an avatar, and exchange messages with other registered users in real time.

---

## Architecture

```
ChatXApp/
├── public/          # React frontend (Create React App)
│   └── src/
│       ├── pages/           # Route-level components
│       │   ├── Register.jsx
│       │   ├── Login.jsx
│       │   ├── SetAvatar.jsx
│       │   └── Chat.jsx
│       ├── components/      # Reusable UI components
│       │   ├── Contacts.jsx
│       │   ├── ChatContainer.jsx
│       │   ├── ChatInput.jsx
│       │   ├── Messages.jsx
│       │   ├── Welcome.jsx
│       │   └── Logout.jsx
│       └── utils/
│           └── APIRoutes.js  # Centralised API base URLs
└── server/          # Express + Socket.IO backend
    ├── controllers/
    │   ├── userController.js
    │   └── messagesController.js
    ├── model/
    │   ├── userModel.js
    │   └── messageModel.js
    └── routes/
        ├── userRoutes.js
        └── messagesRoutes.js
```

### Data flow

```
Browser ──HTTP──▶ Express REST API ──▶ MongoDB (Mongoose)
       ◀─────────────────────────────
Browser ──WS────▶ Socket.IO server ──▶ target socket (in-memory Map)
```

Messages are persisted via REST and delivered in real time via Socket.IO. Online users are tracked in a server-side `Map<userId, socketId>` — no Redis, so this resets on server restart.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v7, styled-components, axios, socket.io-client |
| UI extras | emoji-picker-react, react-icons, react-toastify |
| Avatar | [multiavatar.com](https://multiavatar.com) public API (SVG → base64) |
| Backend | Node.js, Express 4, Socket.IO 4 |
| Database | MongoDB via Mongoose 6 |
| Auth | bcrypt password hashing, localStorage session |
| Dev server | nodemon |

---

## Prerequisites

- Node.js >= 16
- npm >= 8
- A running MongoDB instance (local or Atlas)

---

## Getting Started

### 1. Clone

```bash
git clone <repo-url>
cd ChatXApp
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/chatxapp
```

Start the server:

```bash
npm start        # uses nodemon
```

### 3. Frontend

```bash
cd public
npm install
npm start        # CRA dev server on http://localhost:3000
```

The frontend expects the backend at `http://localhost:5000`. If you change the port, update `public/src/utils/APIRoutes.js`.

---

## API Reference

### Auth — `/api/auth`

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/register` | `{ username, email, password }` | Create account. Returns user object (password stripped). |
| POST | `/login` | `{ username, password }` | Authenticate. Returns user object. |
| POST | `/setavatar/:id` | `{ image: base64String }` | Set avatar for user `id`. |
| GET | `/allusers/:id` | — | All users except `id`. Returns `[{ _id, username, email, avatarImage }]`. |

### Messages — `/api/messages`

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/addmsg` | `{ from, to, message }` | Persist a message. |
| POST | `/getallmsg` | `{ from, to }` | Fetch conversation between two users, sorted by `updatedAt` asc. Returns `[{ fromSelf: bool, message: string }]`. |

### Socket.IO events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `add-user` | client → server | `userId` | Register socket for a user. |
| `send-msg` | client → server | `{ to, from, msg }` | Relay message to recipient's socket. |
| `msg-recieve` | server → client | `msg` | Incoming message for the recipient. |

> **Note:** there is a typo mismatch in the current code — the client emits `send-smg` but the server listens on `send-msg`. Messages sent via socket are not delivered until this is fixed (persisted messages still load correctly on refresh).

---

## Database Schema

### Users

```
username      String  required  unique  min:3  max:20
email         String  required  unique         max:50
password      String  required  (bcrypt hash)
isAvatarImageSet  Boolean  default: false
avatarImage   String   default: ""
```

### Messages

```
message.text  String   required
users         Array    [senderId, recipientId]
sender        ObjectId required
timestamps    true     (createdAt, updatedAt)
```

---

## Known Issues / Tech Debt

- **Socket event typo** — client emits `send-smg`, server listens on `send-msg`. Real-time delivery is broken; fix by aligning the event name in `ChatContainer.jsx`.
- **No auth middleware** — all API routes are unauthenticated. Any client can read or write messages for any `userId`.
- **Session via localStorage** — user object (including `_id`) is stored in plain localStorage. No JWT or token expiry.
- **In-memory online users** — `global.onlineUsers` Map is lost on server restart; users must reconnect to re-register.
- **`scrollRef.curret`** — typo in `ChatContainer.jsx` (`curret` instead of `current`) breaks auto-scroll to latest message.
- **`setAvatarRoute` URL mismatch** — `APIRoutes.js` uses `/api/auth/setAvatar` but the route is registered as `/api/auth/setavatar` (case-sensitive on Linux).
- **`allUsersRoute` URL mismatch** — `APIRoutes.js` uses `/api/auth/allUsers` but the route is `/api/auth/allusers`.
- **`bcrypt` imported but unused** in `messagesController.js`.
- **No error boundary on server** — unhandled promise rejections will crash the process without `--unhandled-rejections=throw` or a process manager.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Port the Express server listens on |
| `MONGO_URL` | Yes | MongoDB connection string |

> `server/.env` is gitignored. Never commit it.

---

## Scripts

### Server (`/server`)

| Command | Description |
|---------|-------------|
| `npm start` | Start with nodemon (auto-restart on change) |

### Frontend (`/public`)

| Command | Description |
|---------|-------------|
| `npm start` | CRA dev server with HMR |
| `npm run build` | Production build to `public/build/` |
| `npm test` | Jest + React Testing Library (watch mode) |
