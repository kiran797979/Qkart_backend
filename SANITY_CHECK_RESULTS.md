# Step D - Basic Sanity Checks Results

## Database Users Retrieved

Two users were successfully retrieved from MongoDB:

### User 1: nodejs-developer
- **ID**: `6005988f06ea6b360cb75747`
- **Email**: `test@gmail.com`
- **Wallet Money**: 300
- **Address**: "Room no\nRoad no\nStreet"

### User 2: crio-user
- **ID**: `600a695da6e5b6845906e726`
- **Email**: `crio-user@gmail.com`
- **Wallet Money**: 500
- **Address**: "ADDRESS_NOT_SET"

## API Endpoint Testing

### Endpoint: GET /v1/users/{userId}

**URL**: `http://localhost:8082/v1/users/{userId}`

**Authentication**: REQUIRED (JWT Bearer Token)

#### Example curl commands:

```bash
# Without authentication (will return 401 Unauthorized)
curl -X GET http://localhost:8082/v1/users/6005988f06ea6b360cb75747

# With authentication token
curl -X GET http://localhost:8082/v1/users/6005988f06ea6b360cb75747 \
  -H "Authorization: Bearer <TOKEN>"
```

#### PowerShell examples:

```powershell
# Without authentication
Invoke-RestMethod -Uri 'http://localhost:8082/v1/users/6005988f06ea6b360cb75747' -Method Get

# With authentication
Invoke-RestMethod -Uri 'http://localhost:8082/v1/users/6005988f06ea6b360cb75747' `
  -Method Get `
  -Headers @{'Authorization'='Bearer <TOKEN>'}
```

## Authentication Flow

To test the endpoint with authentication:

1. **Register a new user** (POST /v1/auth/register):
   ```json
   {
     "name": "Test User",
     "email": "testuser@example.com",
     "password": "TestPass123"
   }
   ```

2. **Login** (POST /v1/auth/login):
   ```json
   {
     "email": "testuser@example.com",
     "password": "TestPass123"
   }
   ```
   Response will include:
   ```json
   {
     "user": {...},
     "tokens": {
       "access": {
         "token": "<JWT_TOKEN>",
         "expires": "..."
       }
     }
   }
   ```

3. **Use the token** to access the user endpoint:
   ```bash
   curl -X GET http://localhost:8082/v1/users/<USER_ID> \
     -H "Authorization: Bearer <JWT_TOKEN>"
   ```

## Server Status

✅ Server running on port 8082
✅ MongoDB connected and seeded with sample data
✅ Authentication middleware configured and working
✅ API routes responding correctly
