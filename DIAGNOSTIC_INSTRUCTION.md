# CORS Preflight Redirect Issue - Diagnostic Instructions

## Problem

The preflight OPTIONS request receives a redirect, which is forbidden for preflight requests. Error: "Redirect is not allowed for a preflight request".

## Root Causes

1. Client sends request to URL with double slash (e.g., `//api/notify-card`)
2. Vercel automatically redirects routes
3. Server incorrectly handles OPTIONS requests, returning 308 status
4. Conflict between `cors()` middleware and manual OPTIONS handler

## Solution Steps

### 1. Check for Double Slashes in Client Fetch URLs

- Ensure client-side fetch calls use correct URLs without double slashes
- Example: Use `/api/notify-card` instead of `//api/notify-card`

### 2. Diagnose URL Construction in AddCardModal.jsx

- The issue was found in `client/src/components/checkout/left/components/AddCardModal.jsx` line 108
- URL construction: `${import.meta.env.VITE_API_URL}/api/notify-card`
- Environment variable: `VITE_API_URL=https://test-backend-theta-ruddy.vercel.app`
- This should produce: `https://test-backend-theta-ruddy.vercel.app/api/notify-card`
- Check if there are any runtime modifications or proxy configurations that might add extra slashes

### 3. Simplify CORS Configuration

- Remove complex CORS configuration
- Use only `cors()` middleware and `app.options("*", cors())`
- Eliminate manual OPTIONS handlers that conflict with CORS

### 4. Verify No Route Redirects

- Ensure server routes don't redirect OPTIONS requests
- Check that paths are correctly matched without redirects

### 5. Check Vercel Configuration

- Verify Vercel is not redirecting the path
- Check Vercel's rewrites and redirects configuration

## Recommended Server Code Pattern

```javascript
import express from "express";
import cors from "cors";

const app = express();

// Simple CORS setup
app.use(
  cors({
    origin: ["https://your-frontend-domain.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle all OPTIONS requests with CORS
app.options("*", cors());

// Your routes here
app.post("/api/notify-card", async (req, res) => {
  // Your route logic
});
```
