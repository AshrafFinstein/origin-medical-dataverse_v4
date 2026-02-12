# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dataverse Platform is a Nuxt 3 application for validation, grading, and clinical studies. It provides data labeling (DL) and clinical evaluation (CE) session management with role-based access control.

**Tech Stack:** Nuxt 3, tRPC, Prisma, TypeScript, Auth0, AWS S3, Tailwind CSS, Naive UI

## Development Commands

### Setup
```bash
npm install                           # Install dependencies
docker compose -f docker-compose-db.yml up  # Start Postgres database
npx prisma generate                   # Generate Prisma client types
npx prisma migrate dev                # Run database migrations
npx prisma db seed                    # Seed database with sample data
```

### Development
```bash
npm run dev                           # Start dev server
npm run build                         # Build for production
npm run start                         # Start production server
npm run lint                          # Run ESLint
npm run lint:fix                      # Fix ESLint errors
npm run typecheck                     # Run TypeScript type checking
npm test:unit                         # Run Vitest unit tests
```

### Prisma
```bash
npx prisma migrate dev                # Create and apply migration
npx prisma generate                   # Generate Prisma client
npx prisma db seed                    # Seed database
npx prisma studio                     # Open Prisma Studio GUI
npm run prisma:migrate:dev            # Migrate + inline for Nuxt
npm run prisma:generate               # Generate + inline for Nuxt
```

### Data Migration
```bash
npm run data:populate                 # Run data migration script
```

## Architecture

### High-Level Structure

```
server/
├── api/                              # Nuxt server routes (REST endpoints)
├── trpc/                             # tRPC API layer
│   ├── routers/                      # tRPC routers (API endpoints)
│   ├── context.ts                    # Request context (user session)
│   └── trpc.ts                       # tRPC setup, middleware, RBAC
├── services/                         # Business logic layer
├── infrastructures/                  # Data access layer
│   ├── database/repositories/        # Prisma repositories
│   ├── auth0/repositories/           # Auth0 user management
│   └── cloud/repositories/           # S3 file storage
├── middleware/                       # Server middleware
└── di.ts                             # Dependency injection container

pages/                                # Nuxt pages (routes)
components/                           # Vue components
composables/                          # Vue composables
```

### Dependency Injection

The application uses `@owja/ioc` for dependency injection. All repositories are registered in `server/di.ts` with their interfaces and implementations. Services receive dependencies through the DI container.

```typescript
// Example: Resolving a repository
import { resolve, TOKEN } from '~/server/di'
const projectRepo = resolve(TOKEN.projectRepository)
```

### tRPC API Layer

tRPC provides type-safe APIs between client and server:

- **Routers** in `server/trpc/routers/` define API endpoints
- **Protected procedures** enforce authentication and role-based permissions
- **Public procedures** are accessible without authentication
- **Context** (`server/trpc/context.ts`) provides user session info

#### Role-Based Access Control (RBAC)

Permissions are enforced via `pathAbilityMap` in `server/trpc/trpc.ts`. Each tRPC route maps to a module and action (e.g., `epic.create` → Module.EPIC + Action.CREATE). The `isAuthed` middleware checks if the user has the required permission by querying `roleModuleActionMapping` table.

### Repository Pattern

All data access goes through repository interfaces:
- **Database repositories** use Prisma Client (`server/infrastructures/database/repositories/`)
- **Auth0 repository** manages users (`server/infrastructures/auth0/repositories/`)
- **S3 repository** handles file storage (`server/infrastructures/cloud/repositories/`)

Repositories are injected into services via DI, making them easily testable.

### Key Domain Concepts

- **Epic**: Top-level organizational unit
- **Project**: Contains sessions, belongs to an epic
- **Session**: Two types - Data Labeling (DL) and Clinical Evaluation (CE)
- **Label**: Classification tags for data labeling sessions
- **Taxonomy**: Hierarchical classification system for annotations
- **Structure**: Anatomical/organizational structure definitions for CE sessions
- **ExtractedResource**: Files/resources linked to sessions
- **Annotation**: User annotations on taxonomies within sessions

### Database Transactions

Use `withTransaction` from `server/infrastructures/database/transaction.ts` to wrap multiple database operations in a Prisma transaction.

### Testing

- Unit tests use Vitest with jsdom environment
- Test files are co-located with source files (e.g., `auth0.service.test.ts`)
- Run single test file: `npx vitest run server/services/auth0.service.test.ts`

### Environment Variables

Required variables (see `.env.example`):
- Auth0 configuration (domain, client ID/secret, audience)
- AWS S3 buckets and regions
- Database connection string (automatically set by Docker)

### Logging

Winston logger configured in `server/logger.ts` with daily rotating files. Use `logger.info()`, `logger.error()`, etc. throughout server code.

### Client-Side

- **Composables** in `composables/` provide reusable Vue logic
- **tRPC client** auto-configured via `trpc-nuxt` plugin
- **Naive UI** component library for UI elements
- **Tailwind CSS** for styling
