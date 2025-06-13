---
sidebar_position: 1
---

# Robotics Tournament API Documentation

## Overview
This API provides endpoints for managing robotics tournaments, including users, teams, tournaments, stages, matches, match scores, and match scheduling. The API follows RESTful principles and uses JSON for data exchange.

**Base URL**: `http://localhost:3000/api`
**Swagger UI**: `/api/docs`

---

## Authentication

- Uses JWT (JSON Web Token) for authentication and role-based access control.
- After login, JWT is set as an HTTP-only cookie named `token`.
- Use the cookie for all authenticated requests.
- Common error responses include `401 Unauthorized` for authentication failures, `403 Forbidden` for authorization issues, `409 Conflict` for resource conflicts (e.g., duplicate username), and `400 Bad Request` for invalid input.

### Endpoints
| Method | Endpoint           | Description                       |
|--------|--------------------|-----------------------------------|
| POST   | /auth/register     | Register a new user               |
| POST   | /auth/login        | Login and receive JWT cookie      |
| POST   | /auth/logout       | Logout and clear cookie           |
| GET    | /auth/init-admin   | Initialize default admin          |
| GET    | /auth/check-auth   | Check authentication (JWT needed) |
| GET    | /auth/check-admin  | Check admin role (JWT needed)     |

#### Register
- **POST /auth/register**
- **Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string", // optional
  "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON" // optional, defaults to COMMON
}
```
- **Response:**
```json
{
  "id": "string",
  "username": "string",
  "role": "COMMON", // Or the role provided in the request
  "createdAt": "timestamp"
}
```

#### Login
- **POST /auth/login**
- **Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON"
  },
  "message": "Login successful"
}
```
- **Cookie:**
  - Name: `token`
  - httpOnly: true
  - maxAge: 7 days

#### Logout
- **POST /auth/logout**
- **Response:**
```json
{ "message": "Logged out" }
```

#### Initialize Default Admin
- **GET /auth/init-admin**
- **Description:** Creates a default admin user if one doesn't already exist. Uses `ADMIN_USERNAME` and `ADMIN_PASSWORD` from environment variables (defaults to `admin` and `admin123`).
- **Status Code:** `201 Created` (if admin is created or already exists)
- **Response (Admin Created):**
```json
{
  "message": "Default admin user created successfully (username: admin)"
}
```
- **Response (Admin Already Exists):**
```json
{
  "message": "Admin user already exists"
}
```

#### Check Auth
- **GET /auth/check-auth**
- **Headers:**
  - Cookie: `token=...`
- **Response:**
```json
{
  "authenticated": true,
  "user": { "id": "string", "username": "string", "role": "string" },
  "message": "Your authentication is working correctly"
}
```

#### Check Admin
- **GET /auth/check-admin**
- **Headers:**
  - Cookie: `token=...`
- **Response:**
```json
{
  "authenticated": true,
  "role": "ADMIN",
  "hasAdminAccess": true,
  "message": "Your ADMIN role is working correctly"
}
```

---

## Users

| Method | Endpoint         | Description           | Authorization                        | Body/Params |
|--------|------------------|----------------------|--------------------------------------|-------------|
| GET    | /users           | List all users       | Public (or check global guards)      |             |
| GET    | /users/:id       | Get user by ID       | Public (or check global guards)      |             |
| POST   | /users           | Create user          | Admin                                | JSON body   |
| PATCH  | /users/:id       | Update user          | Admin                                | JSON body   |
| DELETE | /users/:id       | Delete user          | Admin                                |             |

#### Create User
- **POST /users**
- **Authorization:** Requires `ADMIN` role.
- **Body:**
```json
{
  "username": "string (min 3 chars)",
  "password": "string (min 6 chars)",
  "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON",
  "createdById": "string (UUID)" // optional
}
```
- **Response (201 Created):**
```json
{
  "id": "string (UUID)",
  "username": "string",
  "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON",
  "createdById": "string (UUID)", // null if not provided
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
  // Note: Password is not returned.
}
```

#### Update User
- **PATCH /users/:id**
- **Authorization:** Requires `ADMIN` role.
- **Body:**
```json
{
  "username": "string (min 3 chars)", // optional
  "password": "string (min 6 chars)", // optional
  "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON", // optional
  "createdById": "string (UUID)" // optional, though typically not updated via this DTO
}
```
- **Response (200 OK):**
```json
{
  "id": "string (UUID)",
  "username": "string",
  "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
  // Note: Password is not returned. createdById is not part of the default select in the service update.
}
```

#### List All Users
- **GET /users**
- **Authorization:** Public (or check global guards if authentication is implicitly required).
- **Response (200 OK):**
```json
[
  {
    "id": "string (UUID)",
    "username": "string",
    "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "createdBy": { // null if not set
      "id": "string (UUID)",
      "username": "string"
    }
  }
  // ... more user objects
]
```

#### Get User by ID
- **GET /users/:id**
- **Authorization:** Public (or check global guards if authentication is implicitly required).
- **Response (200 OK):**
```json
{
  "id": "string (UUID)",
  "username": "string",
  "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "createdBy": { // null if not set
    "id": "string (UUID)",
    "username": "string"
  }
}
```
- **Response (404 Not Found):** If user with the given ID does not exist.

#### Delete User
- **DELETE /users/:id**
- **Authorization:** Requires `ADMIN` role.
- **Response (200 OK):**
```json
{
  "id": "string (UUID)",
  "username": "string",
  "role": "ADMIN | HEAD_REFEREE | ALLIANCE_REFEREE | COMMON",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
  // The service returns the deleted user object.
  // Alternatively, a 204 No Content response is also common.
}
```
- **Response (404 Not Found):** If user with the given ID does not exist.

---

## Teams

| Method | Endpoint         | Description           | Authorization                        | Body/Params |
|--------|------------------|----------------------|--------------------------------------|-------------|
| GET    | /teams           | List all teams       | Public (or check global guards)      | Query: `tournamentId` (optional) |
| GET    | /teams/:id       | Get team by ID       | Public (or check global guards)      |             |
| POST   | /teams           | Create team          | Admin                                | JSON body   |
| PATCH  | /teams/:id       | Update team          | Admin                                | JSON body   |
| DELETE | /teams/:id       | Delete team          | Admin                                |             |
| POST   | /teams/import    | Import teams         | Admin                                | JSON body   |

#### Create Team
- **POST /teams**
- **Authorization:** Requires `ADMIN` role.
- **Body:**
```json
{
  "name": "string (required)",
  "teamNumber": "string", // optional, auto-generated if not provided
  "organization": "string", // optional
  "avatar": "string (URL)", // optional
  "description": "string", // optional
  "teamMembers": [ { "name": "string (required)", "role": "string", "email": "string (email format)", "phone": "string" } ], // optional, can also be a JSON string
  "tournamentId": "string (UUID)" // optional
}
```
- **Response (201 Created):**
```json
{
  "id": "string (UUID)",
  "teamNumber": "string",
  "name": "string",
  "organization": "string", // or null
  "avatar": "string (URL)", // or null
  "description": "string", // or null
  "teamMembers": [], // or array of team member objects
  "tournamentId": "string (UUID)", // or null
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
  // Additional fields from Prisma schema might be present
}
```

#### Update Team
- **PATCH /teams/:id**
- **Authorization:** Requires `ADMIN` role.
- **Body:** (All fields are optional)
```json
{
  "name": "string",
  "teamNumber": "string",
  "organization": "string",
  "avatar": "string (URL)",
  "description": "string",
  "teamMembers": [ { "name": "string", "role": "string", "email": "string (email format)", "phone": "string" } ], // can also be a JSON string
  "tournamentId": "string (UUID)"
}
```
- **Response (200 OK):**
```json
{
  "id": "string (UUID)",
  "teamNumber": "string",
  "name": "string",
  "organization": "string", // or null
  "avatar": "string (URL)", // or null
  "description": "string", // or null
  "teamMembers": [], // or array of team member objects
  "tournamentId": "string (UUID)", // or null
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
  // Additional fields from Prisma schema might be present
}
```
- **Response (404 Not Found):** If team with the given ID does not exist.

#### Delete Team
- **DELETE /teams/:id**
- **Authorization:** Requires `ADMIN` role.
- **Response (200 OK):** (Returns the deleted team object)
```json
{
  "id": "string (UUID)",
  "teamNumber": "string",
  "name": "string",
  // ... other fields of the deleted team
}
```
- **Response (204 No Content):** Alternative successful response.
- **Response (404 Not Found):** If team with the given ID does not exist.

#### Import Teams
- **POST /teams/import**
- **Authorization:** Requires `ADMIN` role.
- **Body:**
```json
{
  "content": "string (required, e.g., 'Team Alpha\nTeam Beta,School XYZ')",
  "tournamentId": "string (UUID, required)",
  "format": "csv | text",      // optional, defaults to 'text'
  "hasHeader": false,         // optional, boolean, defaults to false
  "delimiter": ","           // optional, string, defaults to ','
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "count": 2, // Number of teams imported
  "teams": [
    {
      "id": "string (UUID)",
      "teamNumber": "string",
      "name": "Team Alpha",
      // ... other team fields
    },
    {
      "id": "string (UUID)",
      "teamNumber": "string",
      "name": "Team Beta",
      // ... other team fields
    }
  ]
}
```

#### List All Teams
- **GET /teams**
- **Authorization:** Public (or check global guards if authentication is implicitly required).
- **Query Parameters:**
  - `tournamentId` (string, UUID, optional): Filter teams by a specific tournament.
- **Response (200 OK):**
```json
[
  {
    "id": "string (UUID)",
    "teamNumber": "string",
    "name": "string",
    "organization": "string", // or null
    "avatar": "string (URL)", // or null
    "description": "string", // or null
    "teamMembers": [], // or array of team member objects
    "tournamentId": "string (UUID)", // or null
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "tournament": { // Included if tournamentId is valid or if team is associated
      "id": "string (UUID)",
      "name": "string",
      // ... other tournament fields
    }
  }
  // ... more team objects
]
```

#### Get Team by ID
- **GET /teams/:id**
- **Authorization:** Public (or check global guards if authentication isimplicitly required).
- **Response (200 OK):** (Response can be large due to nested includes)
```json
{
  "id": "string (UUID)",
  "teamNumber": "string",
  "name": "string",
  "organization": "string", // or null
  "avatar": "string (URL)", // or null
  "description": "string", // or null
  "teamMembers": [], // or array of team member objects
  "tournamentId": "string (UUID)", // or null
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "tournament": {
    "id": "string (UUID)",
    "name": "string",
    // ... other tournament fields
  },
  "teamAlliances": [ // Array of team participations in match alliances
    {
      "id": "string (UUID)",
      "teamId": "string (UUID)",
      "allianceId": "string (UUID)",
      "alliance": {
        "id": "string (UUID)",
        "matchId": "string (UUID)",
        "color": "RED | BLUE",
        "match": {
          "id": "string (UUID)",
          "matchNumber": 1,
          "stageId": "string (UUID)",
          // ... other match fields
          "stage": {
            "id": "string (UUID)",
            "name": "string",
            "tournamentId": "string (UUID)",
            // ... other stage fields
            "tournament": {
              // ... tournament fields (can be redundant if top-level tournament is present)
            }
          }
        }
      }
    }
  ]
  // Additional fields from Prisma schema might be present
}
```
- **Response (404 Not Found):** If team with the given ID does not exist.

---

## Tournaments

| Method | Endpoint             | Description                        | Authorization                        | Body/Params |
|--------|----------------------|------------------------------------|--------------------------------------|-------------|
| GET    | /tournaments         | List all tournaments               | Public (or check global guards)      |             |
| GET    | /tournaments/:id     | Get tournament by ID               | Public (or check global guards)      |             |
| GET    | /tournaments/:id/fields | Get all fields for a tournament | Public (or check global guards)      |             |
| POST   | /tournaments         | Create tournament                  | Admin                                | JSON body   |
| PATCH  | /tournaments/:id     | Update tournament                  | Admin                                | JSON body   |
| DELETE | /tournaments/:id     | Delete tournament                  | Admin                                |             |

#### Create Tournament
- **POST /tournaments**
- **Authorization:** Requires `ADMIN` role.
- **Body:**
```json
{
  "name": "string (required, min 1 char)",
  "description": "string", // optional
  "startDate": "string (ISO date format, required)",
  "endDate": "string (ISO date format, required, must be >= startDate)",
  "adminId": "string (UUID, required)",
  "numberOfFields": "number (integer, min 1, max 20, defaults to 1)" // optional
}
```
- **Response (201 Created):**
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string", // or null
  "startDate": "string (ISO date format)",
  "endDate": "string (ISO date format)",
  "adminId": "string (UUID)",
  "numberOfFields": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
  // Note: Associated fields are also created based on numberOfFields.
}
```

#### Update Tournament
- **PATCH /tournaments/:id**
- **Authorization:** Requires `ADMIN` role.
- **Body:** (All fields are optional)
```json
{
  "name": "string (min 1 char)",
  "description": "string",
  "startDate": "string (ISO date format)",
  "endDate": "string (ISO date format, must be >= startDate if both provided)",
  // "adminId": "string (UUID)", // adminId update not typically handled here by default service logic
  "numberOfFields": "number (integer, min 1, max 20)"
}
```
- **Response (200 OK):**
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string", // or null
  "startDate": "string (ISO date format)",
  "endDate": "string (ISO date format)",
  "adminId": "string (UUID)", // Unchanged by this typical update
  "numberOfFields": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
  // Note: Associated fields are updated (created/deleted) if numberOfFields changes.
  // An error may be thrown if decreasing numberOfFields conflicts with existing match field assignments.
}
```
- **Response (404 Not Found):** If tournament with the given ID does not exist.

#### List All Tournaments
- **GET /tournaments**
- **Authorization:** Public (or check global guards if authentication is implicitly required).
- **Response (200 OK):**
```json
[
  {
    "id": "string (UUID)",
    "name": "string",
    "description": "string", // or null
    "startDate": "string (ISO date format)",
    "endDate": "string (ISO date format)",
    "adminId": "string (UUID)",
    "numberOfFields": "number",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "admin": {
      "id": "string (UUID)",
      "username": "string"
    }
  }
  // ... more tournament objects
]
```

#### Get Tournament by ID
- **GET /tournaments/:id**
- **Authorization:** Public (or check global guards if authentication isimplicitly required).
- **Response (200 OK):** (Response can be large due to nested includes)
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string", // or null
  "startDate": "string (ISO date format)",
  "endDate": "string (ISO date format)",
  "adminId": "string (UUID)",
  "numberOfFields": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "admin": {
    "id": "string (UUID)",
    "username": "string"
  },
  "stages": [
    {
      "id": "string (UUID)",
      "name": "string",
      // ... other stage fields
      "matches": [
        {
          "id": "string (UUID)",
          // ... other match fields
          "alliances": [
            {
              "id": "string (UUID)",
              // ... other alliance fields
              "teamAlliances": [
                {
                  "id": "string (UUID)",
                  // ... other teamAlliance fields
                  "team": {
                    "id": "string (UUID)",
                    "name": "string"
                    // ... other team fields
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```
- **Response (404 Not Found):** If tournament with the given ID does not exist.

#### Get Fields by Tournament
- **GET /tournaments/:id/fields**
- **Authorization:** Public (or check global guards if authentication isimplicitly required).
- **Response (200 OK):**
```json
[
  {
    "id": "string (UUID)",
    "tournamentId": "string (UUID)",
    "number": "number (integer)",
    "name": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  // ... more field objects
]
```
- **Response (404 Not Found):** If tournament with the given ID does not exist (though the service might return an empty array if the tournament exists but has no fields).

#### Delete Tournament
- **DELETE /tournaments/:id**
- **Authorization:** Requires `ADMIN` role.
- **Response (200 OK):** (Returns the deleted tournament object)
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string", // or null
  "startDate": "string (ISO date format)",
  "endDate": "string (ISO date format)",
  "adminId": "string (UUID)",
  "numberOfFields": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
- **Response (204 No Content):** Alternative successful response if the service is changed to return no body.
- **Response (404 Not Found):** If tournament with the given ID does not exist.

---

## Stages

The Stages API is used to manage the different phases or parts of a tournament, such as qualification rounds (Swiss, Round Robin), playoffs, or finals.

### Endpoints Summary

| Method | Endpoint             | Description                                  | Authorization |
|--------|----------------------|----------------------------------------------|---------------|
| POST   | /stages              | Create a new stage                           | Admin         |
| GET    | /stages              | List all stages or filter by tournament ID   | Public        |
| GET    | /stages/:id          | Get a specific stage by ID                   | Public        |
| PATCH  | /stages/:id          | Update an existing stage                     | Admin         |
| DELETE | /stages/:id          | Delete a stage                               | Admin         |

---

### Create Stage

- **POST /stages**
- **Description:** Creates a new stage within a tournament.
- **Authorization:** Requires `ADMIN` role.
- **Request Body:** `CreateStageDto`
  ```json
  {
    "name": "string (min 1 char)",
    "type": "SWISS | PLAYOFF | FINAL",
    "startDate": "string (ISO 8601 date-time)",
    "endDate": "string (ISO 8601 date-time, must be after startDate)",
    "tournamentId": "string (UUID)"
  }
  ```
- **Responses:**
  - **201 Created:**
    ```json
    {
      "id": "string (UUID)",
      "name": "string",
      "type": "SWISS",
      "startDate": "string (ISO 8601 date-time)",
      "endDate": "string (ISO 8601 date-time)",
      "tournamentId": "string (UUID)",
      "createdAt": "string (ISO 8601 date-time)",
      "updatedAt": "string (ISO 8601 date-time)"
    }
    ```
  - **400 Bad Request:** If validation fails (e.g., missing fields, invalid date format, endDate before startDate).
    ```json
    {
      "statusCode": 400,
      "message": [
        "Name is required",
        "Invalid stage type",
        "End date must be after start date"
      ],
      "error": "Bad Request"
    }
    ```
  - **401 Unauthorized:** If the JWT token is missing or invalid.
  - **403 Forbidden:** If the authenticated user does not have the `ADMIN` role.

---

### List Stages

- **GET /stages**
- **Description:** Retrieves a list of all stages. Can be optionally filtered by `tournamentId`.
- **Authorization:** Public.
- **Query Parameters:**
  - `tournamentId` (optional, string UUID): Filters stages belonging to a specific tournament.
- **Responses:**
  - **200 OK:**
    ```json
    [
      {
        "id": "string (UUID)",
        "name": "Qualification Round",
        "type": "SWISS",
        "startDate": "string (ISO 8601 date-time)",
        "endDate": "string (ISO 8601 date-time)",
        "tournamentId": "string (UUID)",
        "createdAt": "string (ISO 8601 date-time)",
        "updatedAt": "string (ISO 8601 date-time)",
        "tournament": {
          "id": "string (UUID)",
          "name": "Spring Robotics Open",
          // ... other tournament fields
        }
      }
      // ... more stage objects
    ]
    ```
    *If `tournamentId` is not provided, all stages are returned. If `tournamentId` is provided, only stages for that tournament are returned. The `tournament` object is included in each stage.*

---

### Get Stage by ID

- **GET /stages/:id**
- **Description:** Retrieves a specific stage by its unique ID.
- **Authorization:** Public.
- **Path Parameters:**
  - `id` (string UUID): The ID of the stage to retrieve.
- **Responses:**
  - **200 OK:**
    ```json
    {
      "id": "string (UUID)",
      "name": "Playoffs",
      "type": "PLAYOFF",
      "startDate": "string (ISO 8601 date-time)",
      "endDate": "string (ISO 8601 date-time)",
      "tournamentId": "string (UUID)",
      "createdAt": "string (ISO 8601 date-time)",
      "updatedAt": "string (ISO 8601 date-time)",
      "tournament": {
        "id": "string (UUID)",
        "name": "Spring Robotics Open",
        // ... other tournament fields
      },
      "matches": [
        {
          "id": "string (UUID)",
          "matchNumber": 1,
          "type": "QUALIFICATION",
          // ... other match fields
          "alliances": [
            {
              "id": "string (UUID)",
              "color": "RED",
              // ... other alliance fields
              "teamAlliances": [
                {
                  "id": "string (UUID)",
                  "teamId": "string (UUID)",
                  "team": {
                    "id": "string (UUID)",
                    "name": "RoboWarriors",
                    // ... other team fields
                  }
                }
                // ... other teams in alliance
              ]
            }
            // ... other alliances (e.g., BLUE)
          ]
        }
        // ... more match objects
      ]
    }
    ```
    *Includes the associated `tournament` and a list of `matches` within that stage. Matches include their `alliances` and the `teams` within those alliances.*
  - **404 Not Found:** If no stage with the given ID exists.
    ```json
    {
      "statusCode": 404,
      "message": "Stage with ID <id> not found", // Or similar from Prisma
      "error": "Not Found"
    }
    ```

---

### Update Stage

- **PATCH /stages/:id**
- **Description:** Updates an existing stage. Only provided fields will be updated.
- **Authorization:** Requires `ADMIN` role.
- **Path Parameters:**
  - `id` (string UUID): The ID of the stage to update.
- **Request Body:** `UpdateStageDto` (all fields are optional)
  ```json
  {
    "name": "string",
    "type": "SWISS | PLAYOFF | FINAL",
    "startDate": "string (ISO 8601 date-time)",
    "endDate": "string (ISO 8601 date-time, must be after startDate if both provided)",
    "tournamentId": "string (UUID)" // Note: Typically tournamentId is not changed after creation.
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "id": "string (UUID)",
      "name": "Updated Stage Name",
      "type": "PLAYOFF",
      "startDate": "string (ISO 8601 date-time)",
      "endDate": "string (ISO 8601 date-time)",
      "tournamentId": "string (UUID)",
      "createdAt": "string (ISO 8601 date-time)",
      "updatedAt": "string (ISO 8601 date-time)"
      // ... other fields that were updated or remained the same
    }
    ```
  - **400 Bad Request:** If validation fails (e.g., invalid date format, endDate before startDate).
  - **401 Unauthorized:** If the JWT token is missing or invalid.
  - **403 Forbidden:** If the authenticated user does not have the `ADMIN` role.
  - **404 Not Found:** If no stage with the given ID exists.

---

### Delete Stage

- **DELETE /stages/:id**
- **Description:** Deletes a stage by its ID.
- **Authorization:** Requires `ADMIN` role.
- **Path Parameters:**
  - `id` (string UUID): The ID of the stage to delete.
- **Responses:**
  - **200 OK:** (Returns the deleted stage object)
    ```json
    {
      "id": "string (UUID)",
      "name": "Stage to be Deleted",
      "type": "FINAL",
      "startDate": "string (ISO 8601 date-time)",
      "endDate": "string (ISO 8601 date-time)",
      "tournamentId": "string (UUID)",
      "createdAt": "string (ISO 8601 date-time)",
      "updatedAt": "string (ISO 8601 date-time)"
    }
    ```
    *(Alternatively, could be a 204 No Content response if the service is designed that way, but the controller shows it returns the result of `stagesService.remove(id)` which typically returns the deleted object).*
  - **401 Unauthorized:** If the JWT token is missing or invalid.
  - **403 Forbidden:** If the authenticated user does not have the `ADMIN` role.
  - **404 Not Found:** If no stage with the given ID exists.

---

## Matches

The Matches API is responsible for managing individual matches within a tournament stage, including their creation, scheduling, team assignments, and scoring status.

### Endpoints Summary

| Method | Endpoint                      | Description                                                                 | Authorization |
|--------|-------------------------------|-----------------------------------------------------------------------------|---------------|
| POST   | /matches                      | Create a new match                                                          | Admin         |
| GET    | /matches                      | List all matches, optionally filtered by stage, team, or tournament         | Public        |
| GET    | /matches/:id                  | Get a specific match by ID                                                  | Public        |
| PATCH  | /matches/:id                  | Update an existing match                                                    | Admin         |
| DELETE | /matches/:id                  | Delete a match                                                              | Admin         |
| GET    | /matches/alliance/:id         | Get all matches for a specific alliance ID                                  | Public        |
| GET    | /matches/scoring/:id          | Get scoring status for a specific match                                     | Public        |
| PATCH  | /matches/scoring/:id/finalize | Finalize the scores for a specific match                                    | Scorekeeper   |
| PATCH  | /matches/scoring/:id/unfinalize| Unfinalize the scores for a specific match                                  | Admin         |
| POST   | /matches/bulk                 | Create multiple matches at once                                             | Admin         |
| PATCH  | /matches/bulk-update-status   | Update the status of multiple matches at once                               | Admin         |

---

### Data Transfer Objects (DTOs)

#### `CreateMatchDto`

Used for creating a single match.

```typescript
{
  "matchNumber": "number (integer, min 1)",
  "type": "QUALIFICATION | PLAYOFF | PRACTICE | OTHER", // Enum: MatchType
  "status": "PENDING | ACTIVE | COMPLETED | CANCELLED", // Enum: MatchStatus
  "scheduledTime": "string (ISO 8601 date-time, optional)",
  "actualTime": "string (ISO 8601 date-time, optional)",
  "stageId": "string (UUID)",
  "alliances": [
    {
      "color": "RED | BLUE", // Enum: AllianceColor
      "teams": [
        {
          "teamId": "string (UUID)",
          "isSurrogate": "boolean (optional, default: false)"
        }
        // ... up to N teams per alliance based on game rules
      ]
    }
    // ... RED and BLUE alliances typically
  ]
}
```

- `alliances`: Must contain at least one alliance. Each alliance must have at least one team.

#### `UpdateMatchDto`

Used for updating an existing match. All fields are optional.

```typescript
{
  "matchNumber": "number (integer, min 1, optional)",
  "type": "QUALIFICATION | PLAYOFF | PRACTICE | OTHER (optional)",
  "status": "PENDING | ACTIVE | COMPLETED | CANCELLED (optional)",
  "scheduledTime": "string (ISO 8601 date-time, optional)",
  "actualTime": "string (ISO 8601 date-time, optional)",
  "stageId": "string (UUID, optional)",
  "alliances": [
    {
      "id": "string (UUID, optional, for existing alliances)",
      "color": "RED | BLUE (optional)",
      "teams": [
        {
          "id": "string (UUID, optional, for existing team assignments)",
          "teamId": "string (UUID, optional)",
          "isSurrogate": "boolean (optional)"
        }
      ]
    }
  ]
}
```

- When updating alliances and teams, providing IDs for existing entities allows modification. Omitting IDs might imply creating new ones or replacing existing ones, depending on service logic.

#### `BulkCreateMatchDto`

Used for creating multiple matches in a single request.

```typescript
{
  "matches": [
    // Array of CreateMatchDto objects
    {
      "matchNumber": 101,
      "type": "QUALIFICATION",
      "status": "PENDING",
      "stageId": "stage-uuid-1",
      "alliances": [
        { "color": "RED", "teams": [{ "teamId": "team-uuid-A" }] },
        { "color": "BLUE", "teams": [{ "teamId": "team-uuid-B" }] }
      ]
    },
    {
      "matchNumber": 102,
      // ... other match details
    }
  ]
}
```

#### `BulkUpdateMatchStatusDto`

Used for updating the status of multiple matches.

```typescript
{
  "matchIds": "string[] (array of UUIDs)",
  "status": "PENDING | ACTIVE | COMPLETED | CANCELLED" // Enum: MatchStatus
}
```

---

### Create Match

- **POST /matches**
- **Description:** Creates a new match.
- **Authorization:** Requires `ADMIN` role.
- **Request Body:** `CreateMatchDto`
- **Responses:**
  - **201 Created:** Returns the created match object, including nested alliance and team alliance details.
    ```json
    // Example structure (actual fields may vary based on Prisma schema)
    {
      "id": "match-uuid-123",
      "matchNumber": 1,
      "type": "QUALIFICATION",
      "status": "PENDING",
      "scheduledTime": "2024-09-15T10:00:00.000Z",
      "actualTime": null,
      "stageId": "stage-uuid-abc",
      "createdAt": "2024-09-14T12:00:00.000Z",
      "updatedAt": "2024-09-14T12:00:00.000Z",
      "alliances": [
        {
          "id": "alliance-uuid-red",
          "color": "RED",
          "matchId": "match-uuid-123",
          "score": 0, // Default score
          "teamAlliances": [
            {
              "id": "teamalliance-uuid-r1",
              "teamId": "team-uuid-A",
              "allianceId": "alliance-uuid-red",
              "isSurrogate": false,
              "team": { "id": "team-uuid-A", "name": "RoboDragons", /* ...other team fields */ }
            }
          ]
        },
        {
          "id": "alliance-uuid-blue",
          "color": "BLUE",
          "matchId": "match-uuid-123",
          "score": 0,
          "teamAlliances": [
            {
              "id": "teamalliance-uuid-b1",
              "teamId": "team-uuid-B",
              "allianceId": "alliance-uuid-blue",
              "isSurrogate": false,
              "team": { "id": "team-uuid-B", "name": "CyberKnights", /* ...other team fields */ }
            }
          ]
        }
      ],
      "stage": { "id": "stage-uuid-abc", "name": "Qualifiers", /* ...other stage fields */ }
    }
    ```
  - **400 Bad Request:** If validation fails (e.g., invalid enum values, missing required fields).
  - **401 Unauthorized:** JWT missing/invalid.
  - **403 Forbidden:** User lacks `ADMIN` role.

---

### List Matches

- **GET /matches**
- **Description:** Retrieves a list of matches. Can be filtered by `stageId`, `teamId`, or `tournamentId`.
- **Authorization:** Public.
- **Query Parameters:**
  - `stageId` (optional, string UUID): Filter by stage.
  - `teamId` (optional, string UUID): Filter by matches a specific team participated in.
  - `tournamentId` (optional, string UUID): Filter by matches within a specific tournament (requires joining through stages).
  - `page` (optional, number, default 1): For pagination.
  - `limit` (optional, number, default 10): For pagination.
- **Responses:**
  - **200 OK:** Returns a paginated list of match objects with nested details.
    ```json
    {
      "data": [
        // Array of match objects, similar to Create Match response structure
        {
          "id": "match-uuid-123",
          // ... other match fields
          "alliances": [ /* ... */ ],
          "stage": { /* ... */ },
          "matchScores": [ /* ... if scores exist and are included */ ]
        }
      ],
      "meta": {
        "totalItems": 100,
        "itemCount": 10,
        "itemsPerPage": 10,
        "totalPages": 10,
        "currentPage": 1
      }
    }
    ```
    *The response includes `alliances` (with `teamAlliances` and `team` details), `stage` details, and potentially `matchScores` if they are part of the default include query.* 

---

### Get Match by ID

- **GET /matches/:id**
- **Description:** Retrieves a specific match by its ID.
- **Authorization:** Public.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match.
- **Responses:**
  - **200 OK:** Returns the match object with full nested details (alliances, teams, stage, match scores).
    ```json
    // Similar structure to the Create Match response, but potentially with more complete data
    // like matchScores if they exist.
    {
      "id": "match-uuid-123",
      // ... other match fields
      "alliances": [ /* ... includes teamAlliances with team details ... */ ],
      "stage": { /* ... stage details ... */ },
      "matchScores": [
        {
          "id": "score-uuid-xyz",
          "matchId": "match-uuid-123",
          "allianceColor": "RED",
          "totalScore": 150,
          // ... other score fields and game elements
        }
      ]
    }
    ```
  - **404 Not Found:** If the match with the given ID doesn't exist.

---

### Update Match

- **PATCH /matches/:id**
- **Description:** Updates an existing match.
- **Authorization:** Requires `ADMIN` role.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match to update.
- **Request Body:** `UpdateMatchDto`
- **Responses:**
  - **200 OK:** Returns the updated match object.
  - **400 Bad Request:** Validation errors.
  - **401 Unauthorized:** JWT missing/invalid.
  - **403 Forbidden:** User lacks `ADMIN` role.
  - **404 Not Found:** Match not found.

---

### Delete Match

- **DELETE /matches/:id**
- **Description:** Deletes a match.
- **Authorization:** Requires `ADMIN` role.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match to delete.
- **Responses:**
  - **200 OK:** Returns the deleted match object.
  - **401 Unauthorized:** JWT missing/invalid.
  - **403 Forbidden:** User lacks `ADMIN` role.
  - **404 Not Found:** Match not found.

---

### Get Matches by Alliance ID

- **GET /matches/alliance/:id**
- **Description:** Retrieves all matches associated with a specific alliance ID.
- **Authorization:** Public.
- **Path Parameters:**
  - `id` (string UUID): The ID of the alliance.
- **Responses:**
  - **200 OK:** Returns an array of match objects where the specified alliance participated.
    ```json
    [
      {
        "id": "match-uuid-456",
        // ... other match fields
        "alliances": [
          { "id": "alliance-uuid-red", "color": "RED", /* ... */ },
          { "id": "alliance-uuid-blue", "color": "BLUE", /* ... */ }
        ]
        // ... other related data
      }
    ]
    ```
  - **404 Not Found:** If the alliance ID does not exist or has no associated matches (service might return empty array instead of 404 if alliance exists but has no matches).

---

### Get Match Scoring Status

- **GET /matches/scoring/:id**
- **Description:** Retrieves the scoring status and details for a specific match.
- **Authorization:** Public.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match.
- **Responses:**
  - **200 OK:** Returns an object containing scoring information.
    ```json
    {
      "matchId": "match-uuid-123",
      "status": "SCORED | PENDING_FINALIZATION | FINALIZED", // Or similar status enum
      "redScore": 150,
      "blueScore": 120,
      "winner": "RED", // or "BLUE" or "TIE"
      "details": { /* Potentially detailed breakdown from MatchScores service */ }
    }
    ```
    *The exact structure depends on what `matchesService.getScoringStatus` returns. It likely aggregates data from the `MatchScores` entity.* 
  - **404 Not Found:** Match not found.

---

### Finalize Match Scores

- **PATCH /matches/scoring/:id/finalize**
- **Description:** Marks the scores for a match as final. This action might trigger ranking updates or other post-match processes.
- **Authorization:** Requires `SCOREKEEPER` role.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match whose scores are to be finalized.
- **Responses:**
  - **200 OK:** Returns the updated match object or a success message.
    ```json
    {
      "id": "match-uuid-123",
      "status": "COMPLETED", // Or a specific finalized status
      // ... other match fields, potentially updated scores or status
      "isScoreFinalized": true // Example field
    }
    ```
  - **401 Unauthorized:** JWT missing/invalid.
  - **403 Forbidden:** User lacks `SCOREKEEPER` role.
  - **404 Not Found:** Match not found.
  - **409 Conflict:** If scores are already finalized or not yet submitted.

---

### Unfinalize Match Scores

- **PATCH /matches/scoring/:id/unfinalize**
- **Description:** Reverts the finalization status of match scores, allowing for corrections. This is typically a restricted administrative action.
- **Authorization:** Requires `ADMIN` role.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match.
- **Responses:**
  - **200 OK:** Returns the updated match object or a success message.
    ```json
    {
      "id": "match-uuid-123",
      "status": "ACTIVE", // Or a status indicating scores are editable again
      // ... other match fields
      "isScoreFinalized": false // Example field
    }
    ```
  - **401 Unauthorized:** JWT missing/invalid.
  - **403 Forbidden:** User lacks `ADMIN` role.
  - **404 Not Found:** Match not found.
  - **409 Conflict:** If scores were not previously finalized.

---

### Bulk Create Matches

- **POST /matches/bulk**
- **Description:** Creates multiple matches in a single request.
- **Authorization:** Requires `ADMIN` role.
- **Request Body:** `BulkCreateMatchDto`
- **Responses:**
  - **201 Created:** Returns an array of the created match objects.
    ```json
    [
      // Array of created match objects, similar to single Create Match response
      { /* ... match 1 data ... */ },
      { /* ... match 2 data ... */ }
    ]
    ```
  - **400 Bad Request:** If validation fails for any of the matches in the bulk request.
  - **401 Unauthorized:** JWT missing/invalid.
  - **403 Forbidden:** User lacks `ADMIN` role.

---

### Bulk Update Match Status

- **PATCH /matches/bulk-update-status**
- **Description:** Updates the status of multiple matches simultaneously.
- **Authorization:** Requires `ADMIN` role.
- **Request Body:** `BulkUpdateMatchStatusDto`
- **Responses:**
  - **200 OK:** Returns a count of updated matches or a success message.
    ```json
    {
      "message": "Successfully updated status for X matches to COMPLETED",
      "count": 5 // Example: number of matches updated
    }
    ```
    *(The controller returns `this.matchesService.bulkUpdateStatus(...)`. The exact response structure depends on the service method's return type, which might be a Prisma batch payload or a custom object.)*
  - **400 Bad Request:** If `matchIds` is empty or `status` is invalid.
  - **401 Unauthorized:** JWT missing/invalid.
  - **403 Forbidden:** User lacks `ADMIN` role.
  - **404 Not Found:** If some `matchIds` do not correspond to existing matches (behavior might vary: partial success or full failure).

---

## Match Scores

The Match Scores API is used to record, retrieve, update, and manage the detailed scoring data for each match, including scores for individual game elements and overall alliance scores.

### Endpoints Summary

| Method | Endpoint                           | Description                                                              | Authorization        |
|--------|------------------------------------|--------------------------------------------------------------------------|----------------------|
| POST   | /match-scores                      | Create new scores for a match (typically for both alliances)             | Scorekeeper, Referee |
| GET    | /match-scores                      | List all match scores (admin/broader view)                               | Admin                |
| GET    | /match-scores/match/:matchId       | Get all scores associated with a specific match ID                       | Public               |
| GET    | /match-scores/:id                  | Get a specific match score entry by its own ID                           | Public               |
| PATCH  | /match-scores/:id                  | Update an existing match score entry                                     | Scorekeeper, Referee |
| DELETE | /match-scores/:id                  | Delete a specific match score entry (use with caution)                   | Admin                |
| POST   | /match-scores/initialize/:matchId  | Initialize empty score sheets for a match (for RED and BLUE alliances)   | Scorekeeper          |

---

### Data Transfer Objects (DTOs)

#### `GameElementDto`

Represents a scored game element within a match.

```typescript
{
  "elementId": "string (UUID of the game element definition)",
  "count": "number (integer, min 0)",
  "points": "number (integer, calculated or fixed based on element and count)"
}
```

#### `CreateMatchScoresDto`

Used to submit scores for an alliance in a match. Typically, two such objects would be submitted per match, one for RED and one for BLUE.

```typescript
{
  "matchId": "string (UUID)",
  "allianceColor": "RED | BLUE", // Enum: AllianceColor
  "autonScore": "number (integer, min 0)",
  "teleopScore": "number (integer, min 0)",
  "penaltyPoints": "number (integer, min 0)",
  "totalScore": "number (integer, min 0, often calculated: auton + teleop - penalty)",
  "gameElements": [
    // Array of GameElementDto
    {
      "elementId": "game-element-uuid-1",
      "count": 5,
      "points": 25
    },
    {
      "elementId": "game-element-uuid-2",
      "count": 2,
      "points": 20
    }
  ]
}
```

#### `UpdateMatchScoresDto`

Used to update existing scores for an alliance in a match. All fields are optional.

```typescript
{
  "autonScore": "number (integer, min 0, optional)",
  "teleopScore": "number (integer, min 0, optional)",
  "penaltyPoints": "number (integer, min 0, optional)",
  "totalScore": "number (integer, min 0, optional)",
  "gameElements": [
    // Array of GameElementDto, can be partial to update specific elements
    // or complete to replace all elements.
    {
      "elementId": "game-element-uuid-1",
      "count": 6,
      "points": 30
    }
  ]
}
```

---

### Create Match Scores

- **POST /match-scores**
- **Description:** Creates a new match score entry for a specific alliance in a match. This is typically called by a scorekeeper or referee after a match is played.
- **Authorization:** Requires `SCOREKEEPER` or `REFEREE` role.
- **Request Body:** `CreateMatchScoresDto`
- **Responses:**
  - **201 Created:** Returns the created match score object, including nested game element scores.
    ```json
    {
      "id": "match-score-uuid-123",
      "matchId": "match-uuid-abc",
      "allianceColor": "RED",
      "autonScore": 50,
      "teleopScore": 80,
      "penaltyPoints": 5,
      "totalScore": 125,
      "createdAt": "string (ISO 8601 date-time)",
      "updatedAt": "string (ISO 8601 date-time)",
      "gameElementScores": [
        {
          "id": "element-score-uuid-1",
          "matchScoreId": "match-score-uuid-123",
          "elementId": "game-element-uuid-1",
          "count": 5,
          "points": 25,
          "gameElement": { "id": "game-element-uuid-1", "name": "High Goal", /* ... */ }
        }
        // ... other game element scores
      ],
      "match": { "id": "match-uuid-abc", "matchNumber": 101, /* ... */ }
    }
    ```
  - **400 Bad Request:** Validation errors (e.g., invalid `allianceColor`, negative scores where not allowed).
  - **401 Unauthorized:** JWT missing/invalid.
  - **403 Forbidden:** User lacks `SCOREKEEPER` or `REFEREE` role.
  - **404 Not Found:** If the specified `matchId` or `elementId` (in `gameElements`) does not exist.
  - **409 Conflict:** If scores for this match and alliance already exist and the system doesn't allow overwriting via POST.

---

### List All Match Scores (Admin View)

- **GET /match-scores**
- **Description:** Retrieves a list of all match score entries across all matches. Primarily for administrative overview.
- **Authorization:** Requires `ADMIN` role.
- **Query Parameters:**
    - `page` (optional, number, default 1): For pagination.
    - `limit` (optional, number, default 10): For pagination.
- **Responses:**
  - **200 OK:** Returns a paginated list of match score objects.
    ```json
    {
      "data": [
        // Array of match score objects, similar to Create Match Scores response structure
        {
          "id": "match-score-uuid-123",
          // ... other fields
          "gameElementScores": [ /* ... */ ],
          "match": { /* ... */ }
        }
      ],
      "meta": {
        "totalItems": 50,
        "itemCount": 10,
        "itemsPerPage": 10,
        "totalPages": 5,
        "currentPage": 1
      }
    }
    ```
  - **401 Unauthorized / 403 Forbidden**

---

### Get Scores for a Specific Match

- **GET /match-scores/match/:matchId**
- **Description:** Retrieves all score entries (typically RED and BLUE alliance scores) for a given match ID.
- **Authorization:** Public.
- **Path Parameters:**
  - `matchId` (string UUID): The ID of the match.
- **Responses:**
  - **200 OK:** Returns an array of match score objects for the specified match.
    ```json
    [
      {
        "id": "match-score-uuid-red",
        "matchId": "match-uuid-abc",
        "allianceColor": "RED",
        "totalScore": 125,
        // ... other fields and gameElementScores
      },
      {
        "id": "match-score-uuid-blue",
        "matchId": "match-uuid-abc",
        "allianceColor": "BLUE",
        "totalScore": 110,
        // ... other fields and gameElementScores
      }
    ]
    ```
  - **404 Not Found:** If the `matchId` does not exist or has no associated scores.

---

### Get Specific Match Score Entry

- **GET /match-scores/:id**
- **Description:** Retrieves a single match score entry by its unique ID.
- **Authorization:** Public.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match score entry.
- **Responses:**
  - **200 OK:** Returns the specific match score object.
    ```json
    // Similar structure to the Create Match Scores response
    {
      "id": "match-score-uuid-red",
      // ... fields
    }
    ```
  - **404 Not Found:** If the match score entry with the given ID doesn't exist.

---

### Update Match Score Entry

- **PATCH /match-scores/:id**
- **Description:** Updates an existing match score entry. Allows for corrections to scores before finalization.
- **Authorization:** Requires `SCOREKEEPER` or `REFEREE` role.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match score entry to update.
- **Request Body:** `UpdateMatchScoresDto`
- **Responses:**
  - **200 OK:** Returns the updated match score object.
  - **400 Bad Request:** Validation errors.
  - **401 Unauthorized / 403 Forbidden**.
  - **404 Not Found:** Match score entry not found.

---

### Delete Match Score Entry

- **DELETE /match-scores/:id**
- **Description:** Deletes a specific match score entry. This is a destructive operation and should be used with caution, typically only by administrators.
- **Authorization:** Requires `ADMIN` role.
- **Path Parameters:**
  - `id` (string UUID): The ID of the match score entry to delete.
- **Responses:**
  - **200 OK:** Returns the deleted match score object.
  - **401 Unauthorized / 403 Forbidden**.
  - **404 Not Found:** Match score entry not found.

---

### Initialize Score Sheets for a Match

- **POST /match-scores/initialize/:matchId**
- **Description:** Creates placeholder/empty score sheets for both RED and BLUE alliances for a specified match. This is useful to set up the scoring interface before scores are actually entered.
- **Authorization:** Requires `SCOREKEEPER` role.
- **Path Parameters:**
  - `matchId` (string UUID): The ID of the match for which to initialize scores.
- **Responses:**
  - **201 Created:** Returns an array containing the two created (empty) match score objects (one for RED, one for BLUE).
    ```json
    [
      {
        "id": "new-match-score-uuid-red",
        "matchId": "match-uuid-xyz",
        "allianceColor": "RED",
        "autonScore": 0,
        "teleopScore": 0,
        "penaltyPoints": 0,
        "totalScore": 0,
        "gameElementScores": [], // Initially empty or pre-filled with 0-count elements
        "createdAt": "string (ISO 8601 date-time)",
        "updatedAt": "string (ISO 8601 date-time)"
      },
      {
        "id": "new-match-score-uuid-blue",
        "matchId": "match-uuid-xyz",
        "allianceColor": "BLUE",
        "autonScore": 0,
        // ... similar empty fields
      }
    ]
    ```
  - **401 Unauthorized / 403 Forbidden**.
  - **404 Not Found:** If the `matchId` does not exist.
  - **409 Conflict:** If score sheets for this match have already been initialized or if scores already exist.

---

## Match Scheduler

The Match Scheduler API is responsible for generating match schedules for different tournament formats (e.g., FRC-style round robin, Swiss pairings, Playoffs), managing rankings, and finalizing tournament progression.

**Authorization:** All endpoints under `/api/match-scheduler` require `ADMIN` role unless otherwise specified.

### Endpoints Summary

| Method | Endpoint                               | Description                                                                 | Authorization |
|--------|----------------------------------------|-----------------------------------------------------------------------------|---------------|
| POST   | /match-scheduler/generate-frc-schedule | Generates a qualification schedule based on FRC algorithm for a given stage | Admin         |
| POST   | /match-scheduler/generate-swiss-round  | Generates pairings for the next Swiss round based on current rankings       | Admin         |
| POST   | /match-scheduler/update-swiss-rankings | Updates Swiss rankings after a round is completed                           | Admin         |
| GET    | /match-scheduler/get-swiss-rankings    | Retrieves the current Swiss rankings for a stage                            | Public        |
| POST   | /match-scheduler/generate-playoff      | Generates a playoff bracket (e.g., single/double elimination)             | Admin         |
| POST   | /match-scheduler/update-playoff-brackets| Updates playoff bracket based on match results                              | Admin         |
| POST   | /match-scheduler/finalize-playoff-rankings| Finalizes playoff rankings and determines winners                           | Admin         |

---

### Generate FRC Qualification Schedule

- **POST /match-scheduler/generate-frc-schedule**
- **Description:** Generates a qualification match schedule for a specified stage using an algorithm similar to FRC (FIRST Robotics Competition). This typically aims for balanced partner and opponent assignments.
- **Authorization:** `ADMIN`
- **Request Body:**
  ```json
  {
    "stageId": "string (UUID)",
    "numMatchesPerTeam": "number (integer, e.g., 8-12)",
    "numTeamsPerAlliance": "number (integer, e.g., 2 or 3)"
  }
  ```
- **Responses:**
  - **201 Created:** Returns an array of the generated `Match` objects.
    ```json
    [
      {
        "id": "match-uuid-1",
        "matchNumber": 1,
        "type": "QUALIFICATION",
        "status": "PENDING",
        "stageId": "stage-uuid-provided",
        "alliances": [
          { "color": "RED", "teams": [{"teamId": "team-A"}, {"teamId": "team-B"}] },
          { "color": "BLUE", "teams": [{"teamId": "team-C"}, {"teamId": "team-D"}] }
        ]
        // ... other match fields
      }
      // ... more generated matches
    ]
    ```
  - **400 Bad Request:** If `stageId` is invalid, or if parameters are unsuitable for schedule generation (e.g., not enough teams for `numTeamsPerAlliance`).
  - **404 Not Found:** If the `stageId` does not correspond to an existing stage, or if the stage does not have registered teams.

---

### Generate Swiss Round

- **POST /match-scheduler/generate-swiss-round**
- **Description:** Generates pairings for the next round of a Swiss-system tournament stage based on current team rankings. Teams with similar scores/ranking points are typically paired.
- **Authorization:** `ADMIN`
- **Request Body:**
  ```json
  {
    "stageId": "string (UUID)",
    "currentRoundNumber": "number (integer, e.g., 1, 2, ...)"
  }
  ```
- **Responses:**
  - **201 Created:** Returns an array of newly created `Match` objects for the Swiss round.
    ```json
    [
      {
        "id": "match-uuid-swiss-1",
        "matchNumber": 101, // Or some other numbering scheme for the round
        "type": "QUALIFICATION", // Or a specific SWISS type if defined
        "status": "PENDING",
        "stageId": "stage-uuid-provided",
        "alliances": [
          // Pairings based on rankings
          { "color": "RED", "teams": [{"teamId": "team-ranked-1"}] }, // Assuming 1v1 for simplicity
          { "color": "BLUE", "teams": [{"teamId": "team-ranked-2"}] }
        ]
        // ... other match fields
      }
      // ... more generated matches for the round
    ]
    ```
  - **400 Bad Request:** Invalid `stageId`, `currentRoundNumber` issues (e.g., requesting round 1 when it already exists), or issues with fetching rankings.
  - **404 Not Found:** Stage not found or no teams/rankings available for the stage.

---

### Update Swiss Rankings

- **POST /match-scheduler/update-swiss-rankings**
- **Description:** Recalculates and updates the Swiss rankings for a given stage. This is typically done after all matches in a Swiss round have been played and scores finalized.
- **Authorization:** `ADMIN`
- **Request Body:**
  ```json
  {
    "stageId": "string (UUID)"
  }
  ```
- **Responses:**
  - **200 OK:** Returns the updated list of team rankings for the Swiss stage.
    ```json
    [
      {
        "teamId": "team-uuid-A",
        "teamName": "RoboKings",
        "rankingPoints": 12,
        "matchesPlayed": 4,
        "wins": 3,
        "losses": 1,
        "ties": 0,
        // ... other ranking metrics (e.g., tiebreaker points)
      },
      {
        "teamId": "team-uuid-B",
        "teamName": "Circuit Breakers",
        "rankingPoints": 10,
        // ...
      }
      // ... more ranked teams
    ]
    ```
  - **400 Bad Request:** If `stageId` is invalid.
  - **404 Not Found:** Stage not found.

---

### Get Swiss Rankings

- **GET /match-scheduler/get-swiss-rankings**
- **Description:** Retrieves the current Swiss rankings for a specified stage.
- **Authorization:** Public
- **Query Parameters:**
  - `stageId` (string UUID, required): The ID of the Swiss stage.
- **Responses:**
  - **200 OK:** Returns the list of team rankings for the Swiss stage (similar to `update-swiss-rankings` response).
    ```json
    [
      {
        "teamId": "team-uuid-A",
        "teamName": "RoboKings",
        "rankingPoints": 12,
        // ... other ranking metrics
      }
      // ... more ranked teams
    ]
    ```
  - **400 Bad Request:** If `stageId` query parameter is missing or invalid.
  - **404 Not Found:** Stage not found or no rankings available.

---

### Generate Playoff Bracket

- **POST /match-scheduler/generate-playoff**
- **Description:** Generates the initial matches for a playoff stage based on final qualification rankings (e.g., from Swiss or Round Robin) and a specified bracket type (e.g., single elimination, double elimination, round robin for top N).
- **Authorization:** `ADMIN`
- **Request Body:**
  ```json
  {
    "stageId": "string (UUID of the playoff stage)",
    "qualificationStageId": "string (UUID of the stage providing rankings, e.g., Swiss stage)",
    "bracketType": "SINGLE_ELIMINATION | DOUBLE_ELIMINATION | ROUND_ROBIN", // Enum or string
    "numAdvancingTeams": "number (integer, e.g., 8, 16 for bracket size)"
  }
  ```
- **Responses:**
  - **201 Created:** Returns an array of the generated playoff `Match` objects.
    ```json
    [
      {
        "id": "match-uuid-playoff-1",
        "matchNumber": 1, // Or specific playoff match codes like QF1-1
        "type": "PLAYOFF",
        "status": "PENDING",
        "stageId": "playoff-stage-uuid-provided",
        "alliances": [
          // Seeded based on qualificationStageId rankings
          { "color": "RED", "teams": [{"teamId": "team-seed-1"}] },
          { "color": "BLUE", "teams": [{"teamId": "team-seed-8"}] }
        ]
        // ... other match fields
      }
      // ... more initial playoff matches
    ]
    ```
  - **400 Bad Request:** Invalid parameters, e.g., `numAdvancingTeams` not a power of 2 for elimination brackets, or issues fetching rankings from `qualificationStageId`.
  - **404 Not Found:** Either `stageId` or `qualificationStageId` not found.

---

### Update Playoff Brackets

- **POST /match-scheduler/update-playoff-brackets**
- **Description:** Updates the playoff bracket by advancing winners and potentially generating new matches based on the results of completed playoff matches. For example, after a quarterfinal match, the winner advances to a semifinal match which might be created or populated by this call.
- **Authorization:** `ADMIN`
- **Request Body:**
  ```json
  {
    "stageId": "string (UUID of the playoff stage)",
    "completedMatchId": "string (UUID of the match whose result triggers the update, optional, can be inferred if service logic supports broader updates)"
  }
  ```
- **Responses:**
  - **200 OK:** Returns the current state of the playoff bracket, which might include updated existing matches and newly created matches.
    ```json
    {
      "updatedMatches": [
        // Matches whose status or participants might have changed
        { "id": "match-uuid-QF1-1", "status": "COMPLETED", "winnerAllianceColor": "RED", /* ... */ }
      ],
      "newMatches": [
        // New matches generated, e.g., semifinals
        { "id": "match-uuid-SF1-1", "type": "PLAYOFF", "status": "PENDING", /* ... */ }
      ],
      "bracketStatus": "string (e.g., SEMIFINALS_SET, FINALS_PENDING)"
    }
    ```
    *(The exact response structure will depend on the service implementation. It should clearly indicate changes and new matchups.)*
  - **400 Bad Request:** Invalid `stageId` or `completedMatchId`.
  - **404 Not Found:** Stage or completed match not found.
  - **409 Conflict:** If trying to update based on a match that isn't ready or if the bracket logic prevents the update.

---

### Finalize Playoff Rankings

- **POST /match-scheduler/finalize-playoff-rankings**
- **Description:** Determines and records the final rankings of teams based on their performance throughout the playoff bracket (e.g., 1st place, 2nd place, etc.). This marks the conclusion of the playoff stage.
- **Authorization:** `ADMIN`
- **Request Body:**
  ```json
  {
    "stageId": "string (UUID of the playoff stage)"
  }
  ```
- **Responses:**
  - **200 OK:** Returns the finalized list of playoff rankings.
    ```json
    [
      { "rank": 1, "teamId": "team-uuid-winner", "teamName": "Tournament Champions", /* ... */ },
      { "rank": 2, "teamId": "team-uuid-runnerup", "teamName": "Finalists", /* ... */ },
      // ... other ranked teams
    ]
    ```
  - **400 Bad Request:** Invalid `stageId`.
  - **404 Not Found:** Playoff stage not found.
  - **409 Conflict:** If playoffs are not yet completed or all matches haven't been scored and finalized.

---

## Usage Examples

### Record Match Scores (Frontend)
```javascript
const scoreData = {
  matchId: "cltz0982v0001g8mbadcd1234",
  redAutoScore: 45,
  redDriveScore: 65,
  redTeamCount: 3,
  blueAutoScore: 40,
  blueDriveScore: 60,
  blueTeamCount: 3,
  redGameElements: { highGoal: 4, midGoal: 5, lowGoal: 2 },
  blueGameElements: { highGoal: 3, midGoal: 4, lowGoal: 3 },
  scoreDetails: { penalties: { red: 0, blue: 10 } }
};
fetch('/api/match-scores', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
  body: JSON.stringify(scoreData)
});
```

### Display Tournament Results (Frontend)
```javascript
async function loadTournamentResults(tournamentId) {
  const matches = await fetch(`/api/tournaments/${tournamentId}/matches`).then(r => r.json());
  const completedMatches = matches.filter(m => m.status === 'COMPLETED');
  const matchResults = await Promise.all(
    completedMatches.map(async match => {
      const scoreData = await fetch(`/api/match-scores/match/${match.id}`).then(r => r.json());
      return {
        matchNumber: match.matchNumber,
        round: match.roundNumber,
        stageName: match.stage.name,
        redTeams: match.alliances.find(a => a.color === 'RED').teamAlliances.map(ta => ta.team.teamNumber).join(', '),
        blueTeams: match.alliances.find(a => a.color === 'BLUE').teamAlliances.map(ta => ta.team.teamNumber).join(', '),
        redScore: scoreData.redTotalScore,
        blueScore: scoreData.blueTotalScore,
        winner: scoreData.redTotalScore > scoreData.blueTotalScore ? 'RED' : scoreData.blueTotalScore > scoreData.redTotalScore ? 'BLUE' : 'TIE'
      };
    })
  );
  // ...render table
}
```

---

## Notes
- All endpoints use JSON for request and response bodies unless otherwise specified.
- For more details, see the Swagger UI at `/api/docs`.
- The match scheduler implements simulated annealing for qualification, Swiss-style pairing, and elimination bracket generation.
- Team statistics are updated automatically when match scores are created or updated.