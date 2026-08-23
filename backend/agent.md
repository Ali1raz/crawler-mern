# AI Agent Instructions for Backend Project

## Project Overview
Express.js + TypeScript backend API with standard middleware setup.

## Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Dev Tool**: tsx (for hot reload)
- **Build**: tsc (outputs to dist/)

## Key Commands
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Compile TypeScript to dist/
npm start        # Run production build
```

## Project Structure
```
backend/
├── src/
│   └── index.ts          # Entry point
├── dist/                 # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── agent.md
```

## Code Conventions
- Use ES modules (`import`/`export`)
- Strict TypeScript enabled
- Error handling middleware at end
- Environment variables via dotenv
- Helmet, CORS, Morgan for security/logging
- Health check at `/health`

## Adding New Routes
1. Create route file in `src/routes/`
2. Import and mount in `index.ts`
3. Follow REST conventions

## Middleware Order (important)
1. Helmet (security headers)
2. CORS (cross-origin)
3. Morgan (logging)
4. Body parsers (json, urlencoded)
5. Routes
6. 404 handler
7. Error handler

## Environment Variables
Create `.env` file:
```
PORT=3000
NODE_ENV=development
```

## Testing
- No test framework configured yet
- Add vitest/jest when needed

## Deployment
- Build: `npm run build`
- Run: `npm start` (uses dist/index.js)
- Ensure NODE_ENV=production