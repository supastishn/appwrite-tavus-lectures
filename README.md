# appwrite-tavus-lectures

---

## Changelog & Key Improvements

### Core Functionality Changes
1. **DailyJS Removal**
   - Removed DailyJS SDK and video integration
   - Replaced with Tavus SDK for live lesson sessions

2. **User Profile System**
   - Added profile picture management using Appwrite storage
   - Created avatar deletion utility
   - Added "avatars" storage bucket
   - Full profile page with name/password updating capabilities

### UI Improvements
1. **Dark Mode Implementation**
   - Added theme-aware interface throughout
   - Created dark mode variants for all components
   - Added theme-aware circle images to landing page

2. **Navigation Enhancements**
   - Added profile link to navbar
   - Removed logout button from dashboard
   - Added global navigation system

3. **Modals and UX**
   - Added stylish delete confirmation modal
   - Simplified dashboard header navigation

### Video/Session Handling
1. **Tavus Integration**
   - Embedded Tavus SDK for live lessons
   - Added robust loading/error handling
   - Created conversation route (`/conversation/:id`)

### Security and Maintenance
1. **Security Updates**
   - Removed hardcoded env vars from appwrite.json
   - Added documentation for secure setup
   - Cleaned unused dependencies

2. **Bug Fixes**
   - Fixed issues with Dashboard component JSX
   - Resolved duplicate React imports

### New Features
1. **Content Rating System**
   - Added lesson rating for completed lessons
   - Star-based UI for user feedback

2. **Routing**
   - Added SPA-friendly redirects
   - Created dedicated conversation view

### Visual Design
- New favicon and UI assets
- Responsive design enhancements
- Refined landing page with theme elements
- Gradient effects and card shadows

---

The site evolved from a basic prototype to a production-ready application with user profiles, secure backend integration, comprehensive theme support, and professional UI components—all focused around the core Tavus video lesson functionality.

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

Bolt project: 

