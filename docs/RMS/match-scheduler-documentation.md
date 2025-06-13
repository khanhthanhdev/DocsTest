---
sidebar_position: 3
---
# Match Scheduler API Documentation

The Match Scheduler API provides endpoints for generating and managing match schedules for robotics competitions, including FRC-style qualification rounds, Swiss-style tournaments, and playoff brackets. It leverages different algorithms to suit various tournament phases.

## API Endpoints

All endpoints require **Admin** role authorization.

### 1. Generate FRC Schedule

Generates a balanced FRC-style (qualification) schedule using a simulated annealing algorithm. This is typically used for initial seeding rounds where each team plays a set number of matches.

**Endpoint:** `POST /match-scheduler/generate-frc-schedule`

**Request Body (`ScheduleConfigDto`):**
```json
{
  "stageId": "cltyg56k80000y8mwasdf1234", // UUID of the stage
  "rounds": 10, // Number of rounds each team should ideally play
  "minMatchSeparation": 3, // Minimum matches between a team's appearances
  "teamsPerAlliance": 2, // Optional: Number of teams per alliance (default: 2)
  "maxIterations": 20000, // Optional: Max iterations for optimization (default: 10000)
  "qualityLevel": "medium" // Optional: 'low', 'medium', or 'high' (default: 'medium')
}
```

**Response:**
```json
// Array of generated Match objects
[
  {
    "id": "match_uuid_1",
    "matchNumber": 1,
    "roundNumber": 1,
    "status": "SCHEDULED",
    "scheduledTime": "2025-06-14T09:00:00.000Z",
    "stageId": "cltyg56k80000y8mwasdf1234",
    // ... other match properties
  },
  // ... more matches
]
```

### 2. Generate Swiss Round

Creates the next round of Swiss-style matches based on current team rankings within a stage. Teams with similar records are paired.

**Endpoint:** `POST /match-scheduler/generate-swiss-round`

**Request Body:**
```json
{
  "stageId": "cltyg56k80000y8mwasdf1234", // UUID of the Swiss stage
  "currentRoundNumber": 2 // The current round number that has just been completed
}
```

**Response:**
```json
// Array of generated Match objects for the new round
[
  {
    "id": "match_uuid_swiss_1",
    "matchNumber": 10, // Example match number for the new round
    "roundNumber": 3,
    "status": "SCHEDULED",
    // ... other match properties
  },
  // ... more matches
]
```

### 3. Update Swiss Rankings

Recalculates and updates team statistics and rankings for a Swiss stage. This should typically be called after all matches in a Swiss round are completed and scored.

**Endpoint:** `POST /match-scheduler/update-swiss-rankings/:stageId`

**URL Parameters:**
- `stageId`: UUID of the Swiss stage whose rankings need updating.

**Response:**
```json
{
  "message": "Successfully updated Swiss rankings for stage cltyg56k80000y8mwasdf1234"
  // Potentially, could also return the updated rankings directly
}
```

### 4. Get Swiss Rankings

Retrieves the current team rankings for a Swiss stage, ordered by ranking points and tiebreakers.

**Endpoint:** `POST /match-scheduler/get-swiss-rankings/:stageId`
*(Note: While this is a GET-like operation, the controller uses POST. Ensure client compatibility.)*

**URL Parameters:**
- `stageId`: UUID of the Swiss stage.

**Response:**
```json
// Array of TeamStats objects with ranking information
[
  {
    "teamId": "team_uuid_1",
    "team": { "name": "Team Alpha", "teamNumber": "123A" },
    "wins": 3,
    "losses": 1,
    "ties": 0,
    "rankingPoints": 9,
    "opponentWinPercentage": 0.65,
    "pointDifferential": 150,
    "matchesPlayed": 4,
    // ... other TeamStats properties
  },
  // ... more ranked teams
]
```

### 5. Generate Playoff Schedule

Creates an elimination tournament bracket (playoff) structure with a specified number of rounds based on prior seeding (e.g., from Swiss or Qualification stages).

**Endpoint:** `POST /match-scheduler/generate-playoff`

**Request Body:**
```json
{
  "stageId": "cltyg67k80001y8mwasdf5678", // UUID of the Playoff stage
  "numberOfRounds": 3 // e.g., 3 for Quarterfinals, Semifinals, Finals (8 teams)
}
```

**Response:**
```json
// Array of generated Match objects for the playoff bracket
[
  {
    "id": "match_uuid_playoff_qf1",
    "matchNumber": 1,
    "roundNumber": 1, // Quarterfinal 1
    "status": "SCHEDULED",
    // ... other match properties
  },
  // ... more playoff matches
]
```

### 6. Update Playoff Brackets

Advances winners to the next match in the playoff bracket after a match is completed and its outcome (winning alliance) is determined.

**Endpoint:** `POST /match-scheduler/update-playoff-brackets/:matchId`

**URL Parameters:**
- `matchId`: UUID of the completed playoff match.

**Response:**
```json
// Array of updated Match objects (the completed match and the next match(es) in the bracket)
[
  {
    "id": "match_uuid_playoff_qf1", // The completed match
    "status": "COMPLETED",
    "winningAlliance": "RED",
    // ... other properties
  },
  {
    "id": "match_uuid_playoff_sf1", // The next match, now with advanced teams
    // ... alliances updated with winning teams
  }
]
```

### 7. Finalize Playoff Rankings

Updates team statistics and final tournament rankings after all playoff matches are completed.

**Endpoint:** `POST /match-scheduler/finalize-playoff-rankings/:stageId`

**URL Parameters:**
- `stageId`: UUID of the playoff stage.

**Response:**
```json
{
  "message": "Successfully finalized playoff rankings for stage cltyg67k80001y8mwasdf5678"
  // Potentially, could also return the finalized rankings or affected match data
}
```

## Data Transfer Objects (DTOs)

### `ScheduleConfigDto`
Used for configuring FRC schedule generation.
- `stageId: string` (UUID) - Identifier for the stage.
- `rounds: number` - Target number of matches per team.
- `minMatchSeparation: number` - Minimum number of matches between a team's appearances.
- `teamsPerAlliance?: number` (default: 2) - Number of teams in each alliance.
- `maxIterations?: number` (default: 10000 for medium quality) - Iterations for the optimization algorithm.
- `qualityLevel?: 'low' | 'medium' | 'high'` (default: 'medium') - Affects `maxIterations` if not explicitly set; higher quality means more iterations.

## Key Concepts

*   **FRC Scheduling:** Utilizes a simulated annealing algorithm to create balanced qualification schedules, aiming for fair distribution of matches, partners, and opponents. Managed by `FrcScheduler`.
*   **Swiss System:** Pairs teams with similar win/loss records in each round. Rankings are updated based on match outcomes and tiebreakers like opponent win percentage. Managed by `SwissScheduler`.
*   **Playoffs:** Standard elimination bracket. Teams are seeded, and winners advance. Managed by `PlayoffScheduler`.

## Usage Examples

### Example 1: Setting up Qualification Matches (FRC Style)
1.  Create a "Qualification" stage.
2.  Call `POST /match-scheduler/generate-frc-schedule` with the `stageId` and desired configuration.

```bash
# Example cURL for generating FRC schedule
curl -X POST -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" -H "Content-Type: application/json" \
-d '{
  "stageId": "your_qualification_stage_id",
  "rounds": 8,
  "minMatchSeparation": 2,
  "qualityLevel": "medium"
}' \
http://localhost:3000/api/match-scheduler/generate-frc-schedule
```

### Example 2: Running a Swiss Tournament Stage
1.  Create a "Swiss" stage.
2.  (Optional) Seed initial rankings if applicable, or let the first round be random/seeded.
3.  For each round:
    a.  Call `POST /match-scheduler/generate-swiss-round` with `stageId` and `currentRoundNumber`.
    b.  After all matches in the generated round are played and scored:
        Call `POST /match-scheduler/update-swiss-rankings/:stageId`.
4.  To view rankings at any time: Call `POST /match-scheduler/get-swiss-rankings/:stageId`.

```bash
# Example cURL for generating a Swiss round
curl -X POST -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" -H "Content-Type: application/json" \
-d '{
  "stageId": "your_swiss_stage_id",
  "currentRoundNumber": 1 
}' \
http://localhost:3000/api/match-scheduler/generate-swiss-round

# Example cURL for updating Swiss rankings
curl -X POST -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" \
http://localhost:3000/api/match-scheduler/update-swiss-rankings/your_swiss_stage_id
```

### Example 3: Managing a Playoff Stage
1.  Create a "Playoff" stage.
2.  Seed teams into the bracket (this might be manual or based on previous stage rankings).
3.  Call `POST /match-scheduler/generate-playoff` with `stageId` and `numberOfRounds`.
4.  After each playoff match is completed and scored:
    Call `POST /match-scheduler/update-playoff-brackets/:matchId` with the ID of the completed match.
5.  Once all playoff matches are done:
    Call `POST /match-scheduler/finalize-playoff-rankings/:stageId`.

```bash
# Example cURL for generating playoff schedule
curl -X POST -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" -H "Content-Type: application/json" \
-d '{
  "stageId": "your_playoff_stage_id",
  "numberOfRounds": 3
}' \
http://localhost:3000/api/match-scheduler/generate-playoff

# Example cURL for updating playoff brackets
curl -X POST -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" \
http://localhost:3000/api/match-scheduler/update-playoff-brackets/completed_match_id
```

## Notes on Implementation

The core scheduling logic is encapsulated within the `MatchSchedulerService`. For specific algorithms and complex calculations, this service delegates to specialized classes:
-   `FrcScheduler.ts`: Handles FRC-style qualification schedule generation.
-   `SwissScheduler.ts`: Manages Swiss pairing logic and ranking updates.
-   `PlayoffScheduler.ts`: Deals with playoff bracket generation and advancement.

Refer to these classes in the `backend/src/match-scheduler/` directory for detailed algorithm implementations.