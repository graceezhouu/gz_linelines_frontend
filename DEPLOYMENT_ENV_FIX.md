# Environment Variable Configuration Guide

## Frontend Environment Variables

### Local Development (.env file):
```
VITE_API_BASE_URL=http://localhost:8000
```

### Production Deployment (Render Environment Variables):
```
VITE_API_BASE_URL=https://linelens.onrender.com
```

⚠️ **IMPORTANT**: Do NOT include `/api` at the end of the URL!

## How to Fix on Render:

1. Go to your Render dashboard
2. Select your frontend service
3. Navigate to "Environment" tab
4. Edit the `VITE_API_BASE_URL` variable
5. Remove `/api` from the end of the URL
6. Save and redeploy

## Expected Results:

✅ **Correct API calls:**
- `https://linelens.onrender.com/api/QueueStatus/_getAllQueues`
- `https://linelens.onrender.com/api/QueueStatus/createQueue`

❌ **Wrong API calls (current issue):**
- `https://linelens.onrender.com/api/api/QueueStatus/_getAllQueues`
- `https://linelens.onrender.com/api/api/QueueStatus/createQueue`
