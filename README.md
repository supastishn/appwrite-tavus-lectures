appwrite-tavus-lectures

---

# Environment Variable Setup

## Required Environment Variables
The following server-side variables should be configured in **Appwrite Console**:

| Variable Name            | Required For               | Description                          |
|--------------------------|----------------------------|--------------------------------------|
| `APPWRITE_ENDPOINT`      | All functions              | Appwrite API endpoint                |
| `APPWRITE_PROJECT_ID`    | All functions              | Appwrite project ID                  |
| `APPWRITE_API_KEY`       | All functions              | Appwrite API secret key              |
| `TAVUS_API_KEY`          | generateLesson, tavusLooper| Tavus API key                        |
| `TAVUS_WEBHOOK_URL`      | generateLesson             | Your deployed tavusWebhook URL       |

**Add these in Appwrite Console:**
1. Go to your Appwrite project
2. Navigate to Settings > Environment Variables
3. Add each key-value pair

## Frontend Environment Variables
Create `.env` file in project root:
```env
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_ENDPOINT=your-api-endpoint
```

---

# Use of other coding tools

Aside from Bolt.new, this project uses: 

- Manual code editing
- Github Copilot for AI code suggestions (autocompletion) 
