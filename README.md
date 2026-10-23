# DiagnoConnect

**A healthcare coordination platform prototype** connecting patients, clinicians, hospitals, diagnostic centers, and ambulance providers through a shared web application.

DiagnoConnect brings common care coordination tasks into one place: finding providers, arranging appointments, tracking referrals, managing medical records, and keeping care teams informed. This repository contains a React web client and an Express/MongoDB API.

> **Project status:** Prototype for demonstration and development. It is not a production medical system and should not be used to store real patient information or make clinical decisions.

## What it includes

- Role-based experiences for patients, doctors, hospital administrators, diagnostic center administrators, ambulance providers, and system administrators.
- Account registration and login, refresh and logout flows, password reset, and OTP verification endpoints.
- Patient profiles, medical records, prescriptions, appointments, referrals, notifications, and reviews.
- Provider and diagnostic center discovery, including search and nearby search endpoints.
- Ambulance requests, payment workflow endpoints, and administrative user and institution management.
- A responsive React interface with dashboards, charts, and animated UI elements.

## Tech stack

- **Client:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, Recharts, Lucide React
- **API:** Node.js, Express, Mongoose, MongoDB
- **Authentication:** JWT access and refresh tokens

## Get started

### Requirements

- Node.js 18 or later and npm
- MongoDB running locally, or a MongoDB connection string

### Install

From the repository root, install all dependencies:

```bash
npm run install:all
```

Create a local environment file from the example:

```bash
Copy-Item server/.env.example server/.env
```

On macOS/Linux, use `cp server/.env.example server/.env` instead. Edit `server/.env` as needed. At minimum, make sure MongoDB is reachable; for local development the example URI points to `mongodb://127.0.0.1:27017/diagnoconnect`.

### Start the app

```bash
npm run dev
```

- Web app: <http://localhost:5173>
- API health check: <http://localhost:5000/api/health>

Vite forwards `/api` requests to the local API server. You can also start each part separately with `npm run dev:client` and `npm run dev:server`.

### Optional demo data

With MongoDB running and `server/.env` configured, seed demo accounts:

```bash
npm run seed
```

The seed script creates accounts only when they do not already exist. Demo logins:

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@diagnoconnect.local` | `Admin123!` |
| Patient | `patient@demo.local` | `Demo123!` |
| Doctor | `doctor@demo.local` | `Demo123!` |
| Diagnostic center admin | `center@demo.local` | `Demo123!` |
| Ambulance provider | `ambulance@demo.local` | `Demo123!` |

These credentials are for local demos only. The admin seed email and password can be overridden with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `server/.env`.

## Configuration

The example configuration lives in [`server/.env.example`](server/.env.example):

| Variable | Purpose | Example/default |
| --- | --- | --- |
| `PORT` | API server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/diagnoconnect` |
| `JWT_SECRET` | Access token signing secret | Set a unique local value |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | Set a different unique value |
| `CLIENT_URL` | Allowed client origin for CORS | `http://localhost:5173` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Optional email transport settings | Empty in example |
| `SMS_PROVIDER` | SMS integration selection | `console` in example |

Do not commit your populated `.env` file or use demo credentials and development secrets in a deployed environment. Email and SMS notifications use development stubs unless configured with a real provider.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API and client together |
| `npm run dev:server` | Run the API only |
| `npm run dev:client` | Run the web client only |
| `npm run build` | Build the client for production |
| `npm run seed` | Add local demo accounts and sample institutions |

## Repository layout

```text
client/   React + Vite application
server/   Express API, MongoDB models, routes, and seed script
```

## Contributing

Bug reports and pull requests are welcome. For changes, include a clear description of the user-facing behavior and steps to reproduce or review it. Please do not include real patient data in issues, screenshots, or commits.

## License

No license is currently specified. All rights are reserved unless the repository owner adds a license.
