# Appwrite React + Tavus Implementation Plan

## 1. Enhance Appwrite Setup
- Modify `src/lib/appwrite.ts` to include Storage and Functions
- Use existing environment variables from .env

## 2. Create Services
- `src/services/auth.ts`: Authentication functions
- `src/services/lessons.ts`: Lesson creation and retrieval

## 3. Build React Components
- `src/components/LessonForm.tsx`: Lesson topic input
- `src/components/VideoPlayer.tsx`: Video playback with interactions
- `src/pages/Dashboard.tsx`: User lesson dashboard

## 4. Implement Serverless Functions
- `functions/generateLesson.js`: Lesson generation logic
- `functions/tavusWebhook.js`: Tavus callback handler
- `appwrite.json`: Function deployment config

## 5. Update Main App
- Modify `src/App.tsx` to include new:
  - Dashboard page for authenticated users
  - LessonForm component

## Implementation Details

### Appwrite Setup Update (src/lib/appwrite.ts)
```typescript
import { Client, Account, Databases, Storage, Functions } from 'appwrite';

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("tavus-lectures");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
```

### Authentication Service (src/services/auth.ts)
```typescript
import { account } from '../lib/appwrite';

export const login = async (email: string, password: string) => {
    return await account.createEmailSession(email, password);
};

export const signup = async (email: string, password: string, name: string) => {
    await account.create('unique()', email, password, name);
    return login(email, password);
};

export const getCurrentUser = async () => {
    return await account.get();
};
```

### Lesson Service (src/services/lessons.ts)
```typescript
import { functions, databases } from '../lib/appwrite';

const LESSONS_DB = 'learnai_db';
const LESSONS_COLLECTION = 'lessons';

export const createLesson = async (topic: string, userId: string) => {
    const execution = await functions.createExecution(
        'generateLesson',
        JSON.stringify({ topic, userId })
    );
    return JSON.parse(execution.response);
};

export const getUserLessons = async (userId: string) => {
    return databases.listDocuments(
        LESSONS_DB,
        LESSONS_COLLECTION,
        [`equal("userId", "${userId}")`]
    );
};
```

### Serverless Function Config (appwrite.json)
```json
{
  "functions": [
    {
      "name": "generateLesson",
      "runtime": "node-18.0",
      "path": "functions/generateLesson",
      "execute": ["users"],
      "vars": {
        "APPWRITE_ENDPOINT": "https://fra.cloud.appwrite.io/v1",
        "APPWRITE_PROJECT_ID": "tavus-lectures",
        "APPWRITE_API_KEY": "YOUR_API_KEY",
        "TAVUS_API_KEY": "YOUR_TAVUS_KEY",
        "OPENAI_API_KEY": "YOUR_OPENAI_KEY"
      }
    },
    {
      "name": "tavusWebhook",
      "runtime": "node-18.0",
      "path": "functions/tavusWebhook",
      "execute": ["users"],
      "vars": {
        "APPWRITE_ENDPOINT": "https://fra.cloud.appwrite.io/v1",
        "APPWRITE_PROJECT_ID": "tavus-lectures",
        "APPWRITE_API_KEY": "YOUR_API_KEY"
      }
    }
  ]
}
```

### Deployment Steps
1. Create Appwrite database "learnai_db" with collection "lessons"
2. Add fields: userId(string), topic(string), tavusId(string), 
   videoUrl(string), status(string)
3. Set environment variables in Appwrite Dashboard
4. Deploy functions using Appwrite CLI:
   ```bash
   appwrite deploy function
   ```

## Next Steps
1. Implement the React components as described
2. Handle Tavus webhook callback
3. Update App.tsx to use Dashboard component
