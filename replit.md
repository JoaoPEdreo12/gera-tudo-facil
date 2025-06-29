# Study Management Application

## Overview

This is a comprehensive study management application built with a modern full-stack architecture. The application helps students organize their studies with features like intelligent scheduling, subject management, flashcards, and progress tracking. It's designed as a Single Page Application (SPA) with a React frontend and Express.js backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM for client-side navigation
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Supabase Auth (referenced in hooks)
- **Session Management**: PostgreSQL session store

### Development Environment
- **Package Manager**: npm
- **Development Server**: Vite dev server with HMR
- **TypeScript**: Strict mode enabled with path mapping
- **Bundling**: esbuild for server-side bundling

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Connection**: Neon serverless connection with WebSocket support
- **Migrations**: Drizzle Kit for schema migrations

### Authentication System
- **Provider**: Supabase Auth integration
- **Context**: React Context API for auth state management
- **Protection**: Route-level authentication guards
- **Session**: Persistent authentication state

### AI Integration
- **Service**: OpenAI GPT-4 integration via Supabase Edge Functions
- **Features**: Study plan generation, concept explanations, flashcard creation
- **Types**: Specialized prompts for different AI assistance types

### Core Features
1. **Dashboard**: Overview of study progress and daily tasks
2. **Schedule Management**: Intelligent study session planning
3. **Subject Management**: Organization of study materials by subject
4. **Flashcards**: Spaced repetition learning system
5. **Progress Tracking**: Detailed analytics and reporting

## Data Flow

### Client-Server Communication
1. React components use custom hooks for data fetching
2. TanStack Query manages caching and synchronization
3. RESTful API endpoints handle CRUD operations
4. Real-time updates through query invalidation

### State Management Flow
1. Server state managed by TanStack Query
2. Local UI state managed by React hooks
3. Authentication state managed by Supabase context
4. Form state managed by React Hook Form

### Database Operations
1. Drizzle ORM provides type-safe database queries
2. Connection pooling via Neon serverless
3. Schema validation with Zod integration
4. Automatic type inference from schema

## External Dependencies

### Core Dependencies
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with class-variance-authority
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography
- **Carousel**: Embla Carousel for interactive components

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript
- **Linting**: ESLint with TypeScript support
- **Styling**: PostCSS with Tailwind plugins

### External Services
- **Database**: Neon PostgreSQL serverless
- **Authentication**: Supabase Auth
- **AI**: OpenAI API via Supabase Edge Functions
- **Development**: Replit integration for development environment

## Deployment Strategy

### Build Process
1. Frontend: Vite builds optimized React bundle
2. Backend: esbuild bundles Express server for production
3. Assets: Static files served from dist/public directory
4. Environment: Separate development and production configurations

### Production Setup
- **Server**: Single Node.js process serving both API and static files
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: Database URL and API keys required
- **Port**: Configurable port binding for deployment platforms

### Development Workflow
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Database**: Local development with push migrations
- **Proxy**: Vite dev server proxies API requests to Express
- **Error Handling**: Runtime error overlay for development

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```