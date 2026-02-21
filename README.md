# DRIVE UCSD - Hackathon Backend

A minimal Next.js backend for the DRIVE UCSD hackathon project, supporting a 3-hour MVP demo.

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Data Layer**: In-memory store (fastest for demo)

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Seed demo data:
```bash
curl http://localhost:3000/api/seed
```

4. See `API_EXAMPLES.md` for all API endpoints and example curl commands.

## Project Structure

```
.
├── app/
│   └── api/
│       ├── auth/
│       │   └── demo-login/
│       │       └── route.ts          # POST /api/auth/demo-login
│       ├── me/
│       │   └── route.ts              # GET, PATCH /api/me
│       ├── trips/
│       │   ├── route.ts              # GET, POST /api/trips
│       │   └── [tripId]/
│       │       └── request/
│       │           └── route.ts      # POST /api/trips/:tripId/request
│       ├── requests/
│       │   └── [requestId]/
│       │       ├── accept/
│       │       │   └── route.ts      # POST /api/requests/:requestId/accept
│       │       └── decline/
│       │           └── route.ts      # POST /api/requests/:requestId/decline
│       └── seed/
│           └── route.ts              # GET /api/seed
├── lib/
│   ├── types.ts                      # TypeScript interfaces
│   ├── store.ts                      # In-memory storage
│   └── validate.ts                   # Validation functions
├── package.json
├── tsconfig.json
└── next.config.js
```

## API Endpoints

### Auth
- `POST /api/auth/demo-login` - Login with UCSD email

### User
- `GET /api/me?userId=...` - Get user profile
- `PATCH /api/me` - Update user profile

### Trips
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create a new trip

### Requests
- `POST /api/trips/:tripId/request` - Request a ride
- `POST /api/requests/:requestId/accept` - Accept a request (driver only)
- `POST /api/requests/:requestId/decline` - Decline a request (driver only)

### Demo
- `GET /api/seed` - Seed demo data

## Constraints

- **UCSD-only**: All users must have an email ending with `@ucsd.edu`
- **Consistent JSON**: All endpoints return consistent JSON shapes
- **Validation**: Simple validation with clear error messages
- **Stable endpoints**: Endpoints are stable and predictable

## Data Models

See `lib/types.ts` for full TypeScript interfaces:
- `User` - User profile with interests, rating, etc.
- `Trip` - Trip details with driver, locations, seats, etc.
- `RideRequest` - Ride request with status (pending/accepted/declined)

## Development

The backend uses in-memory storage, so data resets on server restart. Use `/api/seed` to populate demo data.

For detailed API examples, see `API_EXAMPLES.md`.
