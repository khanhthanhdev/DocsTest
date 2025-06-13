---
sidebar_position: 2
---
# Robotics Tournament Management System - Technical Documentation

## 1. Introduction

### System Purpose and Scope

The Robotics Tournament Management System is a full-stack application designed to manage robotics competitions, from tournament creation to real-time match control and scoring. The system enables tournament organizers to:

*   Create and manage robotics tournaments
*   Register teams and organize them into alliances
*   Define tournament stages (Swiss format, playoffs, finals)
*   Schedule and control matches in real-time
*   Track scores and provide audience displays
*   Maintain tournament statistics and rankings

This document provides a technical overview of the application's architecture, API, and key technology implementations. It is intended for software engineers involved in the development and maintenance of the system.

## 2. Overall Application Architecture

The Robotics Tournament Management System employs a modern full-stack architecture with a clear separation of concerns between the frontend and backend components.

*   **Frontend:** A Next.js application is responsible for the user interface and client-side logic. It interacts with the backend via REST APIs and real-time WebSocket connections. Key technologies include TanStack Query for state management and data synchronization, Shadcn for UI components, and Socket.io client for real-time communication.
*   **Backend:** A NestJS application serves as the backend API and handles business logic, data persistence, and real-time event broadcasting. It exposes RESTful endpoints and manages WebSocket connections using Socket.io server. Prisma is utilized as the Object-Relational Mapper (ORM) for database interactions.
*   **Database:** A relational database (e.g., PostgreSQL, MySQL, SQLite, as supported by Prisma) stores all persistent data, including tournament details, team information, match schedules, scores, and user accounts.
*   **Real-time Communication:** Socket.io is used to facilitate bidirectional, real-time communication between the frontend and backend. This is crucial for features like live match control, real-time scoring updates, and audience displays.

The general flow involves the Next.js frontend making requests to the NestJS backend. For data retrieval and mutations, standard HTTP requests (managed by TanStack Query) are used. For real-time updates, both frontend and backend establish a Socket.io connection, allowing the server to push updates to clients and clients to send real-time commands to the server.




## 3. Frontend Architecture (Next.js)

The frontend of the Robotics Tournament Management System is built using Next.js with the App Router, providing a robust framework for server-side rendering, static site generation, and client-side navigation. TypeScript is used throughout the frontend codebase for type safety and improved developer experience.

### 3.1. Folder Structure

The primary source code for the frontend resides within the `/frontend/src` directory. Key subdirectories include:

*   **`src/app`**: This directory leverages the Next.js App Router paradigm. It contains subdirectories for different routes (e.g., `/tournaments`, `/matches`, `/control-match`, `/audience-display`, `/login`, `/register`). Each route directory typically includes a `page.tsx` file for the main page component and may also contain `layout.tsx` for shared UI structures, as well as route-specific components and sub-routes.
    *   `providers.tsx` within this directory likely wraps the application with global context providers, such as the TanStack Query `QueryClientProvider` and potentially Socket.io context.
*   **`src/components`**: This houses reusable React components utilized across various parts of the application.
    *   **`src/components/ui`**: This subdirectory is dedicated to UI primitives and components, largely based on Shadcn UI. It contains individual files for components like `button.tsx`, `card.tsx`, `dialog.tsx`, `table.tsx`, etc., which are typically composed to build more complex interfaces.
    *   Other general-purpose components like `navbar.tsx` and `secure-layout.tsx` (for handling authenticated routes) are also found here.
*   **`src/hooks`**: This directory contains custom React hooks that encapsulate reusable logic, particularly for state management, data fetching, and side effects.
    *   Hooks like `use-tournaments.ts`, `use-matches.ts`, `use-stages.ts` are likely custom hooks built on top of TanStack Query for managing data related to their respective domains.
    *   `useWebSocket.ts` is central to managing the Socket.io client connection and event handling.
    *   `use-auth.tsx` probably handles authentication state and logic.
*   **`src/lib`**: This directory contains utility functions, library configurations, service definitions, and type declarations.
    *   `api-client.ts`: This file likely configures and exports an HTTP client instance (e.g., Axios or a fetch wrapper) for making API calls to the NestJS backend.
    *   `query-keys.ts`: Defines constants for TanStack Query keys, ensuring consistency and avoiding typos when referencing queries and mutations.
    *   `websocket.ts` and `websocket-service.ts`: These files are responsible for establishing and managing the Socket.io client connection, and providing a service layer for sending and receiving real-time messages.
    *   `types.ts`: Contains shared TypeScript type definitions used across the frontend application.

### 3.2. State Management with TanStack Query

TanStack Query (formerly React Query) is the primary library for managing server state in the frontend. It simplifies data fetching, caching, synchronization, and updates with the backend API.

*   **Data Fetching and Caching:** Custom hooks (e.g., `use-tournaments`, `use-matches`) encapsulate TanStack Query's `useQuery` hook to fetch data from the backend. These hooks typically define a query key (sourced from `src/lib/query-keys.ts`) and a fetcher function that uses the `api-client.ts` to make the actual HTTP request. TanStack Query automatically handles caching, background updates, and stale-while-revalidate strategies, significantly improving performance and user experience.
*   **Mutations:** For operations that modify data on the server (POST, PUT, DELETE requests), TanStack Query's `useMutation` hook is employed. These mutations are often wrapped in custom hooks as well. `useMutation` provides helper states like `isLoading`, `isError`, and `isSuccess`, and allows for optimistic updates and query invalidation to ensure the UI reflects the latest server state after a mutation.
*   **Query Invalidation and Refetching:** After successful mutations, relevant queries are often invalidated using their query keys. This prompts TanStack Query to refetch the data, ensuring the UI displays the most up-to-date information. This is crucial for maintaining data consistency across the application.
*   **Global Configuration:** The `QueryClient` is typically instantiated and provided at the root of the application, likely within `src/app/providers.tsx`, making it accessible to all components and hooks.

### 3.3. UI Components with Shadcn UI

The user interface is built using Shadcn UI, a collection of beautifully designed, accessible, and customizable React components. Shadcn UI is not a traditional component library but rather a set of reusable components that can be copied into the project and modified as needed.

*   **Component Integration:** The components are located in the `src/components/ui` directory. Each component (e.g., `Button`, `Card`, `Dialog`, `Table`, `Input`) has its own file (e.g., `button.tsx`, `card.tsx`). These components are built using Radix UI primitives and styled with Tailwind CSS, offering excellent accessibility and flexibility.
*   **Customization and Theming:** Since Shadcn components are directly part of the project's codebase, they can be easily customized to fit the specific design requirements of the Robotics Tournament Management System. Theming is primarily handled through Tailwind CSS configuration (`tailwind.config.js`) and global styles (`src/app/globals.css`).
*   **Composition:** These base UI components are composed to create more complex UI elements and page layouts throughout the application, ensuring a consistent look and feel.

### 3.4. Real-time Communication (Socket.io Client)

Real-time communication between the frontend and backend is facilitated by Socket.io. The frontend uses the Socket.io client library to connect to the NestJS Socket.io server.

*   **Client Setup:** The Socket.io client instance is likely initialized and managed in `src/lib/websocket.ts` or `src/lib/websocket-service.ts`. This service might provide functions to connect, disconnect, send messages, and register event listeners.
*   **Connection Management:** The `useWebSocket.ts` custom hook likely encapsulates the logic for establishing and maintaining the WebSocket connection. It might provide the socket instance and connection status (connected, disconnected) to components that need real-time updates.
*   **Event Handling:** Components or hooks subscribe to specific Socket.io events emitted by the server. For example, a component displaying live match scores would listen for an `updateScore` event. When such an event is received, the component updates its state to reflect the new information. TanStack Query's `queryClient.setQueryData` might be used to update the local cache with real-time data, ensuring consistency with other data fetching mechanisms.
*   **Emitting Events:** The frontend can also emit events to the server. For instance, in the match control interface (`src/app/control-match`), actions like starting a timer or submitting a score might trigger the emission of a Socket.io event to the backend, which then processes the command and broadcasts updates to other connected clients (like the audience display).

The integration of these technologies (Next.js, TanStack Query, Shadcn UI, and Socket.io client) allows for the development of a responsive, interactive, and real-time user experience for managing robotics tournaments.



## 4. Backend Architecture (NestJS)

The backend of the Robotics Tournament Management System is developed using NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It leverages TypeScript and is built with a modular architecture, making it well-suited for complex applications.

### 4.1. Folder Structure

The primary source code for the backend resides within the `/backend/src` directory. The structure is organized by modules, promoting separation of concerns and maintainability:

*   **`src/main.ts`**: The entry point of the NestJS application, responsible for bootstrapping the application and starting the HTTP server and WebSocket gateway.
*   **`src/app.module.ts`**: The root module of the application, which imports all other feature modules.
*   **`src/prisma.service.ts`**: A service that instantiates and provides the Prisma Client, making it available for dependency injection across different modules for database interactions.
*   **`src/auth`**: This module handles authentication and authorization. It likely includes:
    *   `auth.controller.ts`: Defines routes for login, registration, and potentially token refresh.
    *   `auth.service.ts`: Contains the business logic for user authentication (e.g., validating credentials, generating JWTs).
    *   `jwt.strategy.ts`: Implements the JWT passport strategy for validating tokens.
    *   `jwt-auth.guard.ts`: An authentication guard to protect routes that require a valid JWT.
    *   `roles.decorator.ts` and `roles.guard.ts`: Implement role-based access control (RBAC).
*   **`src/users`**: Manages user-related operations (CRUD for users, profile management).
    *   `users.controller.ts`: Exposes API endpoints for user management.
    *   `users.service.ts`: Handles the logic for user data manipulation.
*   **`src/tournaments`**: Manages tournament creation, retrieval, updates, and deletion.
    *   `tournaments.controller.ts`: Defines API endpoints for tournament operations.
    *   `tournaments.service.ts`: Contains business logic related to tournaments.
*   **`src/stages`**: Manages tournament stages (e.g., Swiss, Playoffs).
    *   `stages.controller.ts`: API endpoints for stage management.
    *   `stages.service.ts`: Business logic for stages.
*   **`src/teams`**: Handles team registration and management within tournaments.
    *   `teams.controller.ts`: API endpoints for team operations.
    *   `teams.service.ts`: Business logic for teams.
*   **`src/matches`**: Manages match creation, scheduling, and status updates.
    *   `matches.controller.ts`: API endpoints for match-related actions.
    *   `matches.service.ts`: Business logic for matches.
*   **`src/match-scheduler`**: Contains logic for automatically scheduling matches based on defined algorithms (e.g., Swiss system).
    *   `match-scheduler.controller.ts`: Endpoints to trigger or configure match scheduling.
    *   `match-scheduler.service.ts`: Implements scheduling algorithms.
*   **`src/match-scores`**: Manages the recording and calculation of scores for matches.
    *   `match-scores.controller.ts`: API endpoints for submitting and retrieving scores.
    *   `match-scores.service.ts`: Business logic for score processing and validation.
    *   `team-stats.service.ts`: Likely calculates and updates team statistics based on match outcomes.
*   **`src/websockets`**: This module is responsible for real-time communication using Socket.io.
    *   `events.gateway.ts`: The core of the real-time functionality. This NestJS Gateway listens for incoming WebSocket connections, handles client messages, and broadcasts events to connected clients (e.g., score updates, match state changes).
*   **`src/utils`**: Contains utility functions or shared types, such as `prisma-types.ts` which might re-export Prisma-generated types for easier use.
*   **DTOs (Data Transfer Objects)**: Each feature module typically has a `dto` subdirectory (e.g., `src/tournaments/dto`) containing classes that define the shape of data for requests and responses. These DTOs are often used with NestJS pipes for validation.
*   **`prisma/schema.prisma`**: Located in `/backend/prisma/schema.prisma`, this file defines the database schema, including models, fields, relations, and enums. Prisma Migrate uses this schema to generate and apply database migrations, and Prisma Client is generated based on this schema for type-safe database access.

### 4.2. Data Modeling with Prisma

Prisma is used as the ORM to interact with the database. The data model is defined in the `prisma/schema.prisma` file.

*   **Schema Definition:** The schema defines various models such as `User`, `Tournament`, `Stage`, `Match`, `Team`, `Alliance`, `MatchScores` (representing a potentially simpler or older scoring structure), and the newer flexible scoring system components including `ScoreConfig`, `ScoreElement`, and `MatchScore`. It also includes `TeamStats`, `MatchControl`, `MatchTimer`, `AudienceDisplay`, and several enums like `UserRole`, `StageType`, `MatchState`, etc. These models represent the entities in the application and their relationships.
    *   **Key Models and Relations (Illustrative - refer to actual `schema.prisma` for definitive structure):**
        *   `User`: Stores user information and roles (ADMIN, HEAD_REFEREE, etc.).
        *   `Tournament`: Represents a robotics competition, linked to an admin `User` and containing multiple `Stage`s, `Team`s, and `ScoreConfig`s.
        *   `Game`: (Implicitly defined by `ScoreConfig`) Defines a specific robotics game (e.g., "VEX Over Under 2024-2025") through its scoring configuration.
        *   `ScoreConfig`: Defines the overall scoring structure for a game/tournament, detailing scorable `ScoreElement`s. Linked to a `Tournament`.
        *   `ScoreElement`: Represents an individual scorable item in a game (e.g., "Triball in Goal", "Autonomous Win Point"), including its type (boolean, integer), point value, and associated rules. Part of a `ScoreConfig`.
        *   `Stage`: Defines a phase of a tournament (e.g., SWISS, PLAYOFF), linked to a `Tournament` and containing `Match`es.
        *   `Team`: Represents a participating team, linked to a `Tournament`.
        *   `Match`: Represents a single game between alliances, linked to a `Stage`, `Alliance`s, and potentially `Field` and `Schedule`. It can have associated `MatchScore` records (for flexible scoring) and/or a `MatchScores` record (older/simpler scoring).
        *   `Alliance`: Represents a group of teams (e.g., Red, Blue) within a `Match`.
        *   `TeamAlliance`: A join table linking `Team`s to `Alliance`s for a specific match.
        *   `MatchScores`: (Potentially older/simpler scoring model) Stores an aggregated score summary for each alliance in a `Match` using predefined fields.
        *   `MatchScore`: (New flexible scoring model) Stores the specific value or count for each `ScoreElement` for an alliance in a `Match`, providing a detailed and adaptable score breakdown. Linked to a `Match`, `Alliance`, and `ScoreElement`.
        *   `TeamStats`: Tracks statistics for each `Team` within a `Tournament` and optionally a `Stage`.
        *   `MatchControl`: Manages the real-time state of a `Match` (e.g., SCHEDULED, RUNNING, PAUSED), linked to `MatchTimer`s and `AudienceDisplay`.
        *   `MatchTimer`: Tracks various timers associated with a match (e.g., AUTO, TELEOP).
        *   `AudienceDisplay`: Manages the state of the audience display for a specific match.
*   **Prisma Client:** NestJS services inject the `PrismaService` (which provides an instance of `PrismaClient`) to perform CRUD operations and other database queries in a type-safe manner. The queries are written using Prisma Client's fluent API.
*   **Migrations:** Prisma Migrate is used to manage database schema evolution. Changes to `schema.prisma` are translated into SQL migration files that can be applied to the database to keep its structure in sync with the application's data model.

### 4.3. API Endpoints (REST)

The NestJS backend exposes a RESTful API for the frontend to consume. Controllers within each module define the routes and handle incoming HTTP requests.

*   **Standard CRUD Operations:** Most modules (Tournaments, Stages, Teams, Matches, Users) provide standard CRUD (Create, Read, Update, Delete) endpoints for managing their respective resources.
*   **Request/Response Payloads:** DTOs are used to define the structure of request bodies and response payloads. NestJS pipes, such as `ValidationPipe`, are often used globally or per-endpoint to validate incoming request data against these DTOs.
*   **Authentication and Authorization:**
    *   The `AuthModule` provides endpoints like `/auth/login` for user authentication. Upon successful login, a JWT (JSON Web Token) is typically returned to the client.
    *   The `JwtAuthGuard` is applied to routes that require authentication. It validates the JWT sent in the `Authorization` header (usually as a Bearer token: `Authorization: Bearer <token>`).
    *   The `RolesGuard` and `@Roles()` decorator are used to implement role-based access control, restricting access to certain endpoints or operations based on the authenticated user's role (e.g., only an ADMIN can create a tournament).
*   **API Versioning/Prefix:** A global API prefix (e.g., `/api/v1`) might be configured in `main.ts` for all routes.

### 4.4. Real-time Communication (Socket.io Server)

Real-time functionality is handled by the `WebsocketsModule` using Socket.io, integrated with NestJS via Gateways.

*   **`EventsGateway` (`src/websockets/events.gateway.ts`):** This class is decorated with `@WebSocketGateway()` and implements NestJS WebSocket lifecycle hooks (`OnGatewayInit`, `OnGatewayConnection`, `OnGatewayDisconnect`).
    *   It listens for client connections and disconnections.
    *   It uses `@SubscribeMessage('eventName')` decorators on methods to handle specific messages (events) sent by connected clients. For example, a client might send a `startMatchTimer` event, which would be handled by a corresponding method in the gateway.
    *   The gateway can broadcast events to all connected clients, to specific rooms (e.g., a room for a particular match), or to individual clients using the `Socket.io` server instance (often accessed via `@WebSocketServer()` decorator).
*   **Key Real-time Events Handled and Emitted:**
    *   **Match Control:** Events related to starting/pausing/resetting match timers, updating match states (e.g., `matchStateChanged`).
    *   **Score Updates:** Events broadcasting real-time score changes (`scoreUpdated`).
    *   **Audience Display:** Events to control the content shown on audience displays (`audienceDisplayUpdated`).
    *   **Notifications:** General notifications or alerts to connected users.
*   **Integration with Services:** The `EventsGateway` often injects and uses other services (e.g., `MatchControlService`, `MatchScoresService`) to process real-time commands and fetch data that needs to be broadcasted. When data is updated via a REST API call (e.g., a score is submitted), the corresponding service might then trigger an event emission through the `EventsGateway` to notify all relevant clients of the change.

This modular and feature-rich backend architecture allows for robust management of tournament data, secure access control, and seamless real-time interactions essential for a dynamic robotics competition environment.



## 5. Real-time Features and Integration (Socket.io)

Socket.io is pivotal for enabling real-time interactions within the Robotics Tournament Management System. It facilitates instantaneous communication between the Next.js frontend and the NestJS backend, which is crucial for features like live match control, dynamic score updates, and synchronized audience displays. The `EventsGateway` on the backend and the `useWebSocket` hook (along with `websocket-service.ts`) on the frontend are the core components managing this real-time data flow.

### 5.1. Data Flow for Real-time Interactions

The general data flow for real-time features involves the following steps:

1.  **Connection Establishment:** When a user accesses a relevant part of the frontend application (e.g., the match control interface or an audience display page), the `useWebSocket` hook initiates a Socket.io connection to the NestJS backend's `EventsGateway`.
2.  **Room Subscription (Optional but Recommended):** For targeted communication, clients might join specific Socket.io rooms. For example, all clients viewing or controlling a particular match (e.g., `match_123`) could join a room named `match_123_updates`. This allows the backend to broadcast events only to relevant clients.
3.  **Client-to-Server Events (Commands/Actions):**
    *   Users performing actions in the frontend (e.g., an admin clicking "Start Timer" in the match control interface) trigger the emission of a Socket.io event from the client to the server. The `websocket-service.ts` would handle sending this event, perhaps named `startMatchTimer`, along with a payload containing necessary data like `matchId` and `timerType`.
    *   The `EventsGateway` on the backend has a handler (a method decorated with `@SubscribeMessage("startMatchTimer")`) that receives this event. This handler would then typically call a relevant service (e.g., `MatchControlService`) to process the command, update the database (e.g., change match state, update timer records via Prisma), and prepare for broadcasting the update.
4.  **Server-to-Client Events (Updates/Notifications):**
    *   After processing an action or when an automated event occurs (e.g., a timer elapses), the backend service instructs the `EventsGateway` to broadcast an update event to connected clients. For instance, after starting a timer, the gateway might emit a `matchTimerStateChanged` event or a more general `matchControlUpdate` event.
    *   This event is broadcasted, often to a specific room (e.g., `match_123_updates`) or to all connected clients if it's a global update. The payload of this event contains the new state or data (e.g., the current timer value, the new match status).
5.  **Frontend Receives and Processes Updates:**
    *   The `useWebSocket` hook or components using it on the frontend listen for these server-emitted events (e.g., `matchTimerStateChanged`).
    *   Upon receiving an event, the frontend updates its local state. This could involve directly updating component state or, more robustly, updating the TanStack Query cache using `queryClient.setQueryData()`. This ensures that the UI reflects the latest information and remains consistent with data fetched via regular API calls.

### 5.2. Key Real-time Features

*   **Live Match Control:**
    *   **Functionality:** Tournament staff (e.g., Head Referee) can start, pause, resume, and end match timers, update match states (e.g., from `SCHEDULED` to `RUNNING` to `COMPLETED`), and potentially record penalties or other in-match events in real-time.
    *   **Socket.io Usage:**
        *   **Client Emits:** `controlMatchAction` (e.g., payload: `{ matchId: "xyz", action: "startTimer", timerType: "AUTO" }`), `submitScoreSegment`.
        *   **Server Emits:** `matchStateUpdated` (payload: `{ matchId: "xyz", newState: "RUNNING", ... }`), `timerUpdated` (payload: `{ matchId: "xyz", timerType: "AUTO", remainingTime: 15 }`), `scoreSegmentConfirmed`.
        *   The `MatchControl` and `MatchTimer` Prisma models are updated on the backend, and these changes are broadcasted.
*   **Real-time Scoring Updates:**
    *   **Functionality:** As referees input scores for different tasks or periods of a match, these scores are immediately reflected for other staff and, importantly, on audience displays.
    *   **Socket.io Usage:**
        *   **Client Emits (from referee interface):** `updateScore` (payload: `{ matchId: "xyz", alliance: "RED", scoreField: "autoScore", value: 20 }`).
        *   **Server Emits (to all relevant clients, including audience displays):** `matchScoreUpdated` (payload: `{ matchId: "xyz", updatedScores: { red: { autoScore: 20, total: 20 }, blue: { ... } } }`).
        *   The `MatchScores` Prisma model is updated on the backend.
*   **Audience Displays:**
    *   **Functionality:** Large screens show live information to the audience, including current match details, running timers, real-time scores, upcoming match schedules, and tournament rankings.
    *   **Socket.io Usage:**
        *   The audience display frontend client primarily listens for events broadcasted by the server.
        *   **Server Emits:** `matchStateUpdated`, `timerUpdated`, `matchScoreUpdated`, `audienceDisplayStateChanged` (e.g., to show "Next Match Starting Soon", or `currentRankingsUpdated`).
        *   The `AudienceDisplay` Prisma model on the backend might dictate the overall state of what the audience display should be showing, and changes to this model (triggered by admins or automated processes) would be broadcasted.
*   **Team Statistics and Rankings:**
    *   **Functionality:** As matches conclude and scores are finalized, team statistics (wins, losses, ranking points) and overall tournament rankings are updated and can be displayed in real-time.
    *   **Socket.io Usage:**
        *   After a match is completed and scores are finalized (often via a REST API call that then triggers a service), the `TeamStatsService` recalculates relevant statistics.
        *   **Server Emits:** `teamStatsUpdated` (payload: `{ tournamentId: "abc", teamId: "team1", newStats: { ... } }`), `rankingsUpdated` (payload: `{ tournamentId: "abc", stageId: "swiss1", rankings: [ ... ] }`).

### 5.3. Ensuring Data Consistency

While Socket.io provides real-time updates, it's important to manage data consistency between these updates and the primary data store (database via Prisma) and client-side cache (TanStack Query).

*   **Backend as Source of Truth:** The NestJS backend and its Prisma-managed database remain the ultimate source of truth. Real-time events are typically broadcasted *after* the backend has successfully persisted the change.
*   **Frontend Cache Updates:** When the frontend receives a Socket.io update, it should ideally update its TanStack Query cache. This ensures that if a component re-fetches data or if other components rely on the same query key, they all see the latest, consistent information. This prevents discrepancies between data shown via real-time updates and data fetched via initial loads or subsequent API calls.

By carefully orchestrating events and ensuring that real-time updates correctly synchronize with the backend data and frontend cache, the Robotics Tournament Management System can provide a seamless and engaging experience for organizers, participants, and the audience.



## 6. Database Schema (Prisma)

The database schema for the Robotics Tournament Management System is defined using Prisma, an open-source ORM for Node.js and TypeScript. The schema is located in `/backend/prisma/schema.prisma` and outlines all data models, their fields, relationships, and enumerations. Prisma Client, generated from this schema, provides type-safe database access throughout the NestJS backend.

Below is the complete Prisma schema definition:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  HEAD_REFEREE
  ALLIANCE_REFEREE
  COMMON
}

enum StageType {
  SWISS
  PLAYOFF
  FINAL
}

enum CardType {
  NONE
  YELLOW
  RED
}

enum RefereeRole {
  HEAD_REFEREE
  ALLIANCE_REFEREE
}

enum MatchState {
  SCHEDULED
  READY
  RUNNING
  PAUSED
  COMPLETED
  CANCELLED
  ERROR
}

enum ErrorSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum ErrorStatus {
  OPEN
  ACKNOWLEDGED
  RESOLVED
  CLOSED
}

enum DisplayState {
  STANDBY
  STARTING_SOON
  LIVE
  MATCH_RESULTS
  FINISHED
  CANCELLED
  ERROR
  CUSTOM_MESSAGE
}

model User {
  id              String           @id @default(uuid())
  username        String           @unique
  password        String
  role            UserRole
  email           String?          @unique
  gender          Boolean?
  DateOfBirth     DateTime?
  phoneNumber     String?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  createdBy       User?            @relation("CreatedUsers", fields: [createdById], references: [id])
  createdById     String?
  createdUsers    User[]           @relation("CreatedUsers")
  tournaments     Tournament[]
  scoredMatches   Match[]          @relation("ScoredBy")
  allianceRefFor  AllianceScoring[] @relation("AllianceReferee")
  matchReferees   MatchReferee[]   // New relation for match referees
}

model Tournament {
  id           String     @id @default(uuid())
  name         String
  description  String?
  startDate    DateTime
  endDate      DateTime
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  adminId      String
  admin        User       @relation(fields: [adminId], references: [id])
  stages       Stage[]
  teams        Team[]     // Added teams relationship
  teamStats    TeamStats[] // New relation to track team statistics
  fields       Field[]    // New relation: Tournament has many Fields
}

model Stage {
  id           String    @id @default(uuid())
  name         String
  type         StageType
  startDate    DateTime
  endDate      DateTime
  tournamentId String
  tournament   Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  matches      Match[]
  teamStats    TeamStats[] // Added relation field for TeamStats
  teamsPerAlliance Int @default(2) // Number of teams per alliance (2v2, 3v3, etc.)
  teamsPerMatch    Int @default(4) // Number of teams per match (all alliances)
  schedules        Schedule[] // Add this line for relation
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Match {
  id            String    @id @default(uuid())
  matchNumber   Int
  roundNumber   Int?      // The round number this match belongs to
  status        String    @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED
  startTime     DateTime? // Full timestamp with hour-minute precision
  scheduledTime DateTime? // New field for the scheduled time with hour-minute precision
  endTime       DateTime? // Full timestamp with hour-minute precision
  duration      Int?      // Duration in minutes
  winningAlliance String?  // "RED" or "BLUE" - indicates which alliance won
  stageId       String
  stage         Stage     @relation(fields: [stageId], references: [id], onDelete: Cascade)
  alliances     Alliance[]
  scoredById    String?
  scoredBy      User?     @relation("ScoredBy", fields: [scoredById], references: [id])
  referees      MatchReferee[] // New relation for match referees
  matchScores   MatchScores?
  matchControl  MatchControl? // Optional relation to match control for display state
  roundType     String? // e.g., "QUALIFICATION", "SWISS", "PLAYOFF", "FINAL"
  scheduleId    String?
  schedule      Schedule? @relation(fields: [scheduleId], references: [id], onDelete: SetNull)
  fieldId       String?
  field         Field?     @relation(fields: [fieldId], references: [id], onDelete: SetNull)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model MatchReferee {
  id        String      @id @default(uuid())
  matchId   String
  match     Match       @relation(fields: [matchId], references: [id], onDelete: Cascade)
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  role      RefereeRole // HEAD_REFEREE or ALLIANCE_REFEREE
  position  String?     // Optional position identifier (e.g. "RED1", "BLUE2")
  createdAt DateTime    @default(now()) 
  updatedAt DateTime    @updatedAt

  @@unique([matchId, userId])
  @@index([matchId])
  @@index([userId])
}

model Alliance {
  id            String    @id @default(uuid())
  color         String    // e.g., "RED", "BLUE"
  score         Int       @default(0)
  matchId       String
  match         Match     @relation(fields: [matchId], references: [id], onDelete: Cascade)
  teamAlliances TeamAlliance[]
  allianceScoring AllianceScoring?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model AllianceScoring {
  id            String    @id @default(uuid())
  allianceId    String    @unique
  alliance      Alliance  @relation(fields: [allianceId], references: [id], onDelete: Cascade)
  refereeId     String?
  referee       User?     @relation("AllianceReferee", fields: [refereeId], references: [id])
  scoreDetails  Json?     // Store detailed scoring information as JSON
  card          CardType  @default(NONE)
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Team {
  id            String         @id @default(uuid())
  teamNumber    String         @unique
  name          String
  organization  String?
  avatar        String?        // URL to team avatar image
  description   String?        // Team description
  teamMembers   Json?          // Store team members as a JSON array
  tournamentId  String?        // Optional link to tournament
  tournament    Tournament?    @relation(fields: [tournamentId], references: [id])
  teamAlliances TeamAlliance[]
  teamStats     TeamStats[]    // New relation to track team statistics
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([tournamentId])
}

model TeamAlliance {
  id          String   @id @default(uuid())
  teamId      String
  team        Team     @relation(fields: [teamId], references: [id])
  allianceId  String
  alliance    Alliance @relation(fields: [allianceId], references: [id], onDelete: Cascade)
  stationPosition Int   @default(1)  // Station position: 1, 2, or 3 within an alliance
  isSurrogate Boolean  @default(false) // Indicates if this is a surrogate appearance
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([teamId, allianceId])
}

model MatchScores {
  id                String   @id @default(uuid())
  matchId           String   @unique
  match             Match    @relation(fields: [matchId], references: [id], onDelete: Cascade)
  
  // Red Alliance Scores
  redAutoScore      Int      @default(0)
  redDriveScore     Int      @default(0)
  redTotalScore     Int      @default(0)
  
  // Blue Alliance Scores
  blueAutoScore     Int      @default(0)
  blueDriveScore    Int      @default(0)
  blueTotalScore    Int      @default(0)
  
  // Game Elements Scoring for Red Alliance
  redGameElements   Json?    // Structure: [{ "element": "ball", "count": 3, "pointsEach": 20, "totalPoints": 60, "operation": "multiply" }]
  
  // Game Elements Scoring for Blue Alliance
  blueGameElements  Json?    // Structure: [{ "element": "ball", "count": 3, "pointsEach": 20, "totalPoints": 60, "operation": "multiply" }]
  
  // Team count multipliers (applied automatically based on team count)
  redTeamCount      Int      @default(0)  // Number of teams in red alliance (1-4)
  redMultiplier     Float    @default(1.0) // Calculated multiplier based on team count: 1 team (x1.25), 2 teams (x1.5), 3 teams (x1.75), 4 teams (x2)
  
  blueTeamCount     Int      @default(0)  // Number of teams in blue alliance (1-4)
  blueMultiplier    Float    @default(1.0) // Calculated multiplier based on team count: 1 team (x1.25), 2 teams (x1.5), 3 teams (x1.75), 4 teams (x2)
  
  // Additional metadata
  scoreDetails      Json?    // Other scoring details or game-specific information
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model TeamStats {
  id                  String   @id @default(uuid())
  teamId              String
  team                Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  tournamentId        String
  tournament          Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  stageId             String?    // Adding optional stageId field for stage-specific stats
  stage               Stage?     @relation(fields: [stageId], references: [id], onDelete: SetNull)
  wins                Int       @default(0)
  losses              Int       @default(0)
  ties                Int       @default(0)
  pointsScored        Int       @default(0)
  pointsConceded      Int       @default(0)
  matchesPlayed       Int       @default(0)
  rankingPoints       Int       @default(0)
  opponentWinPercentage Float   @default(0)
  pointDifferential   Int       @default(0)
  rank                Int?      // For playoff rankings
  tiebreaker1         Float     @default(0) // First tiebreaker metric (e.g., average score)
  tiebreaker2         Float     @default(0) // Second tiebreaker metric (e.g., strength of schedule)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  @@unique([teamId, tournamentId])
  @@index([teamId])
  @@index([tournamentId])
  @@index([stageId])
}

model Schedule {
  id        String   @id @default(uuid())
  stageId   String
  stage     Stage    @relation(fields: [stageId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  matches   Match[]
  algorithm String?  // e.g., "simulated_annealing", "swiss"
  quality   String?  // e.g., "low", "medium", "high"
  params    Json?    // Store algorithm parameters
}

model Field {
  id           String      @id @default(uuid())
  name         String
  location     String?
  description  String?
  tournamentId String
  tournament   Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  matches      Match[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}



model MatchControl {
  id              String      @id @default(uuid())
  matchId         String      @unique
  match           Match       @relation(fields: [matchId], references: [id], onDelete: Cascade)
  currentState    MatchState  @default(SCHEDULED)
  stateHistory    Json?       // Array of state transitions with timestamps
  controlledBy    String?     // Admin who is currently controlling the match
  lockToken       String?     // Token for locking control to prevent race conditions
  lockTimestamp   DateTime?   // When the lock was acquired
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  matchTimers     MatchTimer[] 
  matchErrors     MatchError[] 
  audienceDisplay AudienceDisplay?
}

model MatchTimer {
  id              String      @id @default(uuid())
  matchControlId  String
  matchControl    MatchControl @relation(fields: [matchControlId], references: [id], onDelete: Cascade)
  timerType       String      // "AUTO", "TELEOP", "ENDGAME", "FULL_MATCH", etc.
  duration        Int         // Total duration in seconds
  remaining       Int         // Remaining time in seconds
  isRunning       Boolean     @default(false)
  startedAt       DateTime?   // When the timer was started
  pausedAt        DateTime?   // When the timer was last paused
  completedAt     DateTime?   // When the timer completed
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model MatchError {
  id              String        @id @default(uuid())
  matchControlId  String
  matchControl    MatchControl  @relation(fields: [matchControlId], references: [id], onDelete: Cascade)
  errorType       String        // "ROBOT_FAILURE", "FIELD_FAULT", "NETWORK_ISSUE", etc.
  description     String
  severity        ErrorSeverity @default(MEDIUM)
  status          ErrorStatus   @default(OPEN)
  reportedBy      String        // User ID who reported the error
  resolvedBy      String?       // User ID who resolved the error
  resolvedAt      DateTime?
  affectedAlliance String?      // "RED", "BLUE", or null if affects both
  affectedTeamId  String?       // Optional reference to specific team
  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model AudienceDisplay {
  id              String        @id @default(uuid())
  matchControlId  String        @unique
  matchControl    MatchControl  @relation(fields: [matchControlId], references: [id], onDelete: Cascade)
  currentState    DisplayState  @default(STANDBY)
  customMessage   String?
  customData      Json?         // Additional display data
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### Key Models and Relationships:

*   **`User`**: Represents individuals interacting with the system. It includes authentication details (`username`, `password`), roles (`UserRole` enum: ADMIN, HEAD_REFEREE, etc.), and personal information. Users can create other users, administer tournaments, score matches, and be assigned as referees.
*   **`Tournament`**: The central entity for a competition. It has a name, description, dates, and is linked to an admin `User`. A tournament comprises multiple `Stage`s, registered `Team`s, `TeamStats`, and playing `Field`s.
*   **`Stage`**: Defines a distinct phase within a tournament (e.g., SWISS, PLAYOFF, FINAL, defined by `StageType` enum). Each stage belongs to a `Tournament`, contains `Match`es, and can have specific `TeamStats` and `Schedule`s. It also defines parameters like `teamsPerAlliance` and `teamsPerMatch`.
*   **`Team`**: Represents a participating robotics team with a unique `teamNumber`, name, and organization. Teams are associated with a `Tournament` and participate in `Match`es through the `TeamAlliance` model. Their performance is tracked in `TeamStats`.
*   **`Match`**: A single contest within a `Stage`. It has a `matchNumber`, `roundNumber`, status (e.g., PENDING, COMPLETED), timings, and is linked to participating `Alliance`s. It can be scored by a `User` and have assigned `MatchReferee`s. It also links to `MatchScores`, `MatchControl`, an optional `Schedule`, and a `Field`.
*   **`MatchReferee`**: Assigns a `User` with a specific `RefereeRole` (HEAD_REFEREE, ALLIANCE_REFEREE) to a `Match`.
*   **`Alliance`**: Represents one of the competing sides in a match (e.g., "RED", "BLUE"). It has a score and is composed of one or more teams via the `TeamAlliance` join table. It can also have specific `AllianceScoring` details.
*   **`AllianceScoring`**: Stores detailed scoring information for an alliance in a match, potentially recorded by a specific `User` (referee), including `scoreDetails` (JSON), any `CardType` issued (NONE, YELLOW, RED), and notes.
*   **`TeamAlliance`**: A join model linking a `Team` to an `Alliance` for a specific match, indicating the team's station position and whether it's a surrogate.
*   **`MatchScores`**: Captures the detailed breakdown of scores for both red and blue alliances in a `Match`, including autonomous scores, driver-controlled scores, game element details (JSON), and calculated multipliers based on team counts.
*   **`TeamStats`**: Aggregates performance statistics for a `Team` within a `Tournament` (and optionally a specific `Stage`), including wins, losses, ties, points scored/conceded, ranking points, and tiebreaker metrics.
*   **`Schedule`**: Represents a generated set of matches for a `Stage`, potentially created using a specific algorithm and parameters.
*   **`Field`**: Defines a physical playing area for matches within a `Tournament`.
*   **`MatchControl`**: Manages the real-time operational state of a `Match` (using `MatchState` enum: SCHEDULED, RUNNING, PAUSED, COMPLETED, etc.). It tracks state history, who controls the match, and is linked to `MatchTimer`s, `MatchError`s, and an `AudienceDisplay`.
*   **`MatchTimer`**: Represents various timers associated with a `MatchControl` instance (e.g., "AUTO", "TELEOP"), tracking duration, remaining time, and running status.
*   **`MatchError`**: Logs errors or issues that occur during a match, including type, description, `ErrorSeverity`, and `ErrorStatus`.
*   **`AudienceDisplay`**: Controls the information shown on public displays for a given match, using the `DisplayState` enum (e.g., STANDBY, LIVE, MATCH_RESULTS).

### Enumerations (Enums):

The schema defines several enums to represent fixed sets of values for certain fields, enhancing data integrity and readability:

*   `UserRole`: Defines the different roles a user can have.
*   `StageType`: Specifies the type of a tournament stage.
*   `CardType`: Represents disciplinary cards that can be issued.
*   `RefereeRole`: Differentiates between head and alliance referees.
*   `MatchState`: Tracks the various states a match can be in during its lifecycle.
*   `ErrorSeverity`: Classifies the severity of match errors.
*   `ErrorStatus`: Tracks the resolution status of match errors.
*   `DisplayState`: Defines the different states for the audience display.

This comprehensive schema supports the complex data management and real-time operational needs of the Robotics Tournament Management System.



## 7. API Documentation (Consolidated)

A comprehensive API documentation, detailing all RESTful endpoints and Socket.io events, is crucial for both frontend development and potential third-party integrations. This documentation should be automatically generated where possible (e.g., using tools like Swagger/OpenAPI for NestJS REST endpoints) and kept up-to-date with the codebase.

*Self-Review Note: For REST APIs, consider documenting common HTTP response status codes (e.g., 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error), a general error response structure (e.g., `{ "statusCode": 400, "message": "Validation failed", "errors": ["field: reason"] }`), and how authentication tokens (e.g., JWT Bearer tokens) are expected in request headers.*

### 7.1. REST API Endpoints

All REST API endpoints are typically prefixed (e.g., `/api/v1`). Authentication is generally handled via JWT Bearer tokens, with specific roles required for certain operations.

**Auth Module (`/auth`)**

*   **`POST /auth/login`**
    *   Description: Authenticates a user and returns a JWT.
    *   Request Body: `{ username, password }`
    *   Response: `{ accessToken: "jwt_token" }`
*   **`POST /auth/register`** (Potentially admin-only or open, depending on system policy)
    *   Description: Registers a new user.
    *   Request Body: `CreateUserDto` (e.g., `{ username, password, email, role }`)
    *   Response: User object (excluding password).

**Users Module (`/users`)** (Protected, typically ADMIN access for some operations)

*   **`GET /users`**: Lists all users.
*   **`GET /users/:id`**: Retrieves a specific user.
*   **`POST /users`**: Creates a new user (likely ADMIN only).
    *   Request Body: `CreateUserDto`
*   **`PATCH /users/:id`**: Updates a user.
    *   Request Body: `UpdateUserDto`
*   **`DELETE /users/:id`**: Deletes a user (likely ADMIN only).

**Tournaments Module (`/tournaments`)**

*   **`GET /tournaments`**: Lists all tournaments.
*   **`GET /tournaments/:id`**: Retrieves a specific tournament, potentially including its stages, teams, etc.
*   **`POST /tournaments`** (Protected, e.g., ADMIN role)
    *   Description: Creates a new tournament.
    *   Request Body: `CreateTournamentDto` (e.g., `{ name, description, startDate, endDate }`)
    *   Response: Created tournament object.
*   **`PATCH /tournaments/:id`** (Protected)
    *   Description: Updates an existing tournament.
    *   Request Body: `UpdateTournamentDto`
    *   Response: Updated tournament object.
*   **`DELETE /tournaments/:id`** (Protected)
    *   Description: Deletes a tournament.

**Stages Module (`/stages`)** (Typically nested under tournaments, e.g., `/tournaments/:tournamentId/stages` or standalone with `tournamentId` in body/query)

*   **`GET /stages?tournamentId=:tournamentId`**: Lists stages for a tournament.
*   **`GET /stages/:id`**: Retrieves a specific stage.
*   **`POST /stages`** (Protected)
    *   Request Body: `CreateStageDto` (e.g., `{ name, type, startDate, endDate, tournamentId, teamsPerAlliance, teamsPerMatch }`)
*   **`PATCH /stages/:id`** (Protected)
    *   Request Body: `UpdateStageDto`

**Teams Module (`/teams`)**

*   **`GET /teams?tournamentId=:tournamentId`**: Lists teams for a tournament.
*   **`GET /teams/:id`**: Retrieves a specific team.
*   **`POST /teams`** (Protected)
    *   Request Body: `CreateTeamDto` (e.g., `{ teamNumber, name, organization, tournamentId }`)
*   **`POST /teams/import`** (Protected)
    *   Description: Imports multiple teams, likely from a CSV or JSON file.
    *   Request Body: `ImportTeamsDto` (e.g., `{ tournamentId, teams: [...] }`)
*   **`PATCH /teams/:id`** (Protected)
    *   Request Body: `UpdateTeamDto`

**Matches Module (`/matches`)**

*   **`GET /matches?stageId=:stageId`**: Lists matches for a stage.
*   **`GET /matches/:id`**: Retrieves a specific match, including alliances, scores, etc.
*   **`POST /matches`** (Protected, often part of match scheduling)
    *   Request Body: `CreateMatchDto`
*   **`PATCH /matches/:id`** (Protected)
    *   Description: Updates match details (e.g., status, startTime, winningAlliance).
    *   Request Body: `UpdateMatchDto`

**Match Scheduler Module (`/match-scheduler`)**

*   **`POST /match-scheduler/schedule`** (Protected)
    *   Description: Triggers the scheduling of matches for a given stage.
    *   Request Body: `ScheduleConfigDto` (e.g., `{ stageId, algorithm, params }`)
    *   Response: Newly scheduled matches or a job ID.

**Match Scores Module (`/match-scores`)**

*   **`GET /match-scores/:matchId`**: Retrieves the scores for a specific match.
*   **`POST /match-scores`** (Protected, e.g., Referee role)
    *   Description: Submits or updates scores for a match.
    *   Request Body: `CreateMatchScoresDto` or `UpdateMatchScoresDto` (e.g., `{ matchId, redAutoScore, blueTotalScore, redGameElements, ... }`)
    *   Response: Updated match scores object.

**Team Stats Module (`/team-stats`)**

*   **`GET /team-stats?tournamentId=:tournamentId&stageId=:stageId`**: Retrieves team statistics for a tournament or specific stage, often including rankings.

### 7.2. Socket.io Events

Socket.io is used for real-time communication, primarily managed by the `EventsGateway` on the backend. Clients connect and can subscribe to events, often within specific rooms (e.g., `match_XYZ_updates`).

**Client-to-Server Events (Examples):**

*   **`joinMatchRoom`**
    *   Payload: `{ "matchId": "string" }`
    *   Description: Client requests to join a room for a specific match to receive updates.
*   **`leaveMatchRoom`**
    *   Payload: `{ "matchId": "string" }`
    *   Description: Client requests to leave a match room.
*   **`controlMatchAction`**
    *   Payload: `{ "matchId": "string", "action": "startTimer" | "pauseTimer" | "resetTimer" | "setMatchState", "timerType"?: "AUTO" | "TELEOP", "newState"?: "MatchStateEnum" }`
    *   Description: Admin/Referee sends a command to control a match.
*   **`submitLiveScore`**
    *   Payload: `{ "matchId": "string", "alliance": "RED" | "BLUE", "scoreField": "string", "value": "number" }`
    *   Description: Referee submits a partial or live score update.

**Server-to-Client Events (Examples):**

*   **`matchStateUpdated`**
    *   Payload: `{ "matchId": "string", "newState": "MatchStateEnum", "matchData": { ...full match object or relevant parts... } }`
    *   Description: Broadcasts changes to a match's state (e.g., SCHEDULED, RUNNING, PAUSED, COMPLETED).
*   **`timerUpdated`**
    *   Payload: `{ "matchId": "string", "timerType": "AUTO" | "TELEOP", "remainingTime": "number", "isRunning": "boolean" }`
    *   Description: Broadcasts updates to a match timer.
*   **`matchScoreUpdated`**
    *   Payload: `{ "matchId": "string", "scores": { ...MatchScores object... } }`
    *   Description: Broadcasts updates to the scores of a match.
*   **`audienceDisplayUpdated`**
    *   Payload: `{ "matchId": "string", "displayState": "DisplayStateEnum", "customMessage"?: "string", "data"?: { ... } }`
    *   Description: Updates the audience display for a specific match.
*   **`teamStatsUpdated`**
    *   Payload: `{ "tournamentId": "string", "teamId"?: "string", "stats": [ ...TeamStats objects... ] }`
    *   Description: Broadcasts updates to team statistics or rankings.
*   **`newNotification`**
    *   Payload: `{ "message": "string", "type": "info" | "warning" | "error" }`
    *   Description: Sends a general notification to clients.

This API documentation provides a high-level overview. For precise details on DTOs, specific error codes, and exact event payloads, developers should refer to the backend source code, particularly the controller files, DTO definitions, and the `EventsGateway` implementation.



## 8. Deployment

This section outlines general strategies and considerations for deploying the Robotics Tournament Management System. Specific CI/CD pipelines, Docker configurations, or hosting platform details are not yet finalized but will be developed as the project matures.

**Frontend (Next.js):**
*   **Hosting:** Platforms like Vercel (ideal for Next.js), Netlify, AWS Amplify, or self-hosting on a Node.js server.
*   **Build Process:** `next build` generates an optimized production build.
*   **Key Considerations:** Environment variables for API endpoints, static site generation (SSG) or server-side rendering (SSR) strategies per page, CDN for static assets.

**Backend (NestJS):**
*   **Hosting:** Cloud platforms like AWS (EC2, Fargate, Lambda), Google Cloud (Cloud Run, App Engine), Azure (App Service), or traditional VPS/dedicated servers. Containerization with Docker is highly recommended.
*   **Build Process:** `nest build` compiles TypeScript to JavaScript.
*   **Key Considerations:** Environment variables for database connections, JWT secrets, and other sensitive configurations. Scalability, logging, monitoring, and database management (backups, migrations).

**Database (PostgreSQL):**
*   **Hosting:** Managed database services like AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL, or self-hosted PostgreSQL instances.
*   **Key Considerations:** Security (network access, credentials), backups, scaling, and connection pooling.

**General Considerations:**
*   **CI/CD:** Implement a CI/CD pipeline (e.g., GitHub Actions, GitLab CI, Jenkins) to automate testing, building, and deployment.
*   **Environment Management:** Separate configurations for development, staging, and production environments.
*   **Monitoring and Logging:** Set up comprehensive logging and monitoring for both frontend and backend to track errors and performance.

## 9. Conclusion

This document has provided a comprehensive technical overview of the Robotics Tournament Management System, detailing its full-stack architecture. It covers the Next.js frontend with TanStack Query for state management, Shadcn UI for components, and Socket.io for client-side real-time communication. The NestJS backend, with its modular structure, Prisma for database interaction, RESTful APIs, and Socket.io server for real-time event handling, has also been thoroughly described.

The integration of these technologies facilitates a robust platform for managing robotics tournaments, offering features from tournament creation and team registration to real-time match control, live scoring, and audience displays. The detailed breakdown of the data model via the Prisma schema and the explanation of real-time data flows aim to provide software engineers with a clear understanding of the system's inner workings, supporting ongoing development and maintenance.

## 10. References

*   **Primary Source Code Repository:** [https://github.com/khanhthanhdev/robotics_manage](https://github.com/khanhthanhdev/robotics_manage)
*   **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
*   **NestJS Documentation:** [https://docs.nestjs.com/](https://docs.nestjs.com/)
*   **TanStack Query Documentation:** [https://tanstack.com/query/latest/docs/react/overview](https://tanstack.com/query/latest/docs/react/overview)
*   **Shadcn UI:** [https://ui.shadcn.com/](https://ui.shadcn.com/)
*   **Prisma Documentation:** [https://www.prisma.io/docs/](https://www.prisma.io/docs/)
*   **Socket.io Documentation:** [https://socket.io/docs/v4/](https://socket.io/docs/v4/)
