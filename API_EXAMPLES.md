# DRIVE UCSD API Examples

All endpoints are available at `http://localhost:3000` (or your deployed URL).

## 1. Seed Demo Data

```bash
curl -X GET http://localhost:3000/api/seed
```

**Response:**
```json
{
  "ok": true,
  "tripsCount": 2
}
```

## 2. Demo Login (Auth)

```bash
curl -X POST http://localhost:3000/api/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@ucsd.edu",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "user-1234567890-abc123",
    "name": "John Doe",
    "email": "student@ucsd.edu",
    "interests": []
  }
}
```

**Error (non-UCSD email):**
```json
{
  "error": "Email must end with @ucsd.edu"
}
```

## 3. Get User Profile

```bash
curl -X GET "http://localhost:3000/api/me?userId=user-1"
```

**Response:**
```json
{
  "user": {
    "id": "user-1",
    "name": "Alice Johnson",
    "email": "alice@ucsd.edu",
    "year": "Senior",
    "major": "Computer Science",
    "interests": ["Hiking", "Music", "Travel"],
    "ratingAvg": 4.8
  }
}
```

## 4. Update User Profile

```bash
curl -X PATCH http://localhost:3000/api/me \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "year": "Senior",
    "major": "Computer Science",
    "interests": ["Hiking", "Music", "Travel", "Photography"]
  }'
```

**Response:**
```json
{
  "user": {
    "id": "user-1",
    "name": "Alice Johnson",
    "email": "alice@ucsd.edu",
    "year": "Senior",
    "major": "Computer Science",
    "interests": ["Hiking", "Music", "Travel", "Photography"],
    "ratingAvg": 4.8
  }
}
```

## 5. Get All Trips

```bash
curl -X GET http://localhost:3000/api/trips
```

**Response:**
```json
{
  "trips": [
    {
      "id": "trip-1",
      "driverId": "user-1",
      "toLocation": "Los Angeles",
      "fromLocation": "UCSD",
      "departureTime": "2024-01-15T10:00:00.000Z",
      "seatsTotal": 4,
      "seatsAvailable": 3,
      "compRate": 15.5,
      "notes": "Comfortable car, AC available",
      "createdAt": "2024-01-14T12:00:00.000Z"
    }
  ]
}
```

## 6. Create a Trip

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "user-1",
    "toLocation": "San Diego Airport",
    "departureTime": "2024-01-20T08:00:00.000Z",
    "seatsTotal": 3,
    "compRate": 12.00,
    "notes": "Early morning departure",
    "fromLocation": "UCSD"
  }'
```

**Response:**
```json
{
  "trip": {
    "id": "trip-1234567890-xyz789",
    "driverId": "user-1",
    "toLocation": "San Diego Airport",
    "fromLocation": "UCSD",
    "departureTime": "2024-01-20T08:00:00.000Z",
    "seatsTotal": 3,
    "seatsAvailable": 3,
    "compRate": 12.00,
    "notes": "Early morning departure",
    "createdAt": "2024-01-19T15:30:00.000Z"
  }
}
```

## 7. Request a Ride

```bash
curl -X POST http://localhost:3000/api/trips/trip-1/request \
  -H "Content-Type: application/json" \
  -d '{
    "riderId": "user-2"
  }'
```

**Response:**
```json
{
  "request": {
    "id": "request-1234567890-abc456",
    "tripId": "trip-1",
    "riderId": "user-2",
    "status": "pending",
    "createdAt": "2024-01-19T16:00:00.000Z"
  }
}
```

## 8. Accept a Ride Request

```bash
curl -X POST http://localhost:3000/api/requests/request-1234567890-abc456/accept \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "user-1"
  }'
```

**Response:**
```json
{
  "request": {
    "id": "request-1234567890-abc456",
    "tripId": "trip-1",
    "riderId": "user-2",
    "status": "accepted",
    "createdAt": "2024-01-19T16:00:00.000Z"
  },
  "trip": {
    "id": "trip-1",
    "driverId": "user-1",
    "toLocation": "Los Angeles",
    "fromLocation": "UCSD",
    "departureTime": "2024-01-15T10:00:00.000Z",
    "seatsTotal": 4,
    "seatsAvailable": 2,
    "compRate": 15.5,
    "notes": "Comfortable car, AC available",
    "createdAt": "2024-01-14T12:00:00.000Z"
  }
}
```

## 9. Decline a Ride Request

```bash
curl -X POST http://localhost:3000/api/requests/request-1234567890-abc456/decline \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "user-1"
  }'
```

**Response:**
```json
{
  "request": {
    "id": "request-1234567890-abc456",
    "tripId": "trip-1",
    "riderId": "user-2",
    "status": "declined",
    "createdAt": "2024-01-19T16:00:00.000Z"
  }
}
```

## Error Responses

All endpoints return consistent error formats:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `403` - Forbidden (unauthorized action)
- `404` - Not Found
- `500` - Internal Server Error

