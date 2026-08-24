This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Clerk Authentication Setup

This frontend uses Clerk for authentication and shares the **same Clerk application** as the Express backend.

### Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # SAME as backend
CLERK_SECRET_KEY=sk_test_...                    # SAME as backend
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_API_URL=http://localhost:2000
```

> **IMPORTANT**: Frontend and backend MUST use the SAME Clerk application keys (publishable + secret). If keys don't match (dev vs prod instance, or different Clerk apps), `requireAuth()` on Express will reject every request with 401 even though sign-in succeeds on the frontend.

### Manual Testing Checklist

1. **Start both servers:**
   - Backend: `cd ../backend && bun run dev` (runs on port 2000)
   - Frontend: `bun run dev` (runs on port 3000)

2. **Sign up via Email:**
   - Go to http://localhost:3000/sign-up
   - Enter email, verify code, set password
   - Should redirect to `/`

3. **Sign up via Google:**
   - Go to http://localhost:3000/sign-up
   - Click "Continue with Google"
   - Complete OAuth flow
   - Should redirect to `/`

4. **Sign up via GitHub:**
   - Go to http://localhost:3000/sign-up
   - Click "Continue with GitHub"
   - Complete OAuth flow
   - Should redirect to `/`

5. **Verify token works with Express backend:**
   - While signed in, visit http://localhost:3000/protected-example (Server Component)
   - Or visit http://localhost:3000/client-api-example and click "Fetch Protected Data" (Client Component)
   - Both should display user data from `GET /protected` on the Express backend (port 2000)
   - If you get 401, check that both frontend and backend use the EXACT same Clerk keys

### Project Structure

- `middleware.ts` - Clerk auth middleware protecting all routes except `/`, `/sign-in`, `/sign-up`
- `app/layout.tsx` - Wrapped with `<ClerkProvider appearance={{ theme: shadcn }}>`
- `app/sign-in/[[...sign-in]]/page.tsx` - Sign in page
- `app/sign-up/[[...sign-up]]/page.tsx` - Sign up page
- `lib/api.ts` - Typed fetch wrapper with Clerk token attachment
- `app/protected-example/page.tsx` - Server Component example calling protected API
- `app/client-api-example/page.tsx` - Client Component example calling protected API

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.