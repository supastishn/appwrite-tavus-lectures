import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);
  
  const databases = new Databases(client);
  
  try {
    const payload = JSON.parse(req.bodyRaw || '{}');
    
    // Improve compatibility with Tavus response format
    const conversationId = payload.id || payload.conversation_id;
    if (!conversationId) {
      return res.json({ error: 'Invalid webhook payload' }, 400);
    }

    log(`Processing webhook for conversation: ${conversationId}`);

    // Query lessons by tavusId
    const matchingLessons = await databases.listDocuments(
      'learnai_db',
      'lessons',
      [Query.equal('tavusId', conversationId)]
    );
    if (matchingLessons.documents.length === 0) {
      error(`No lesson found for Tavus ID: ${conversationId}`);
      return res.json({ success: true }); // Acknowledge to prevent retries
    }
    const matchingLesson = matchingLessons.documents[0];
    const documentId = matchingLesson.$id;

    // Handle ended status update
    if (payload.status === 'ended') {
      await databases.updateDocument(
        'learnai_db',
        'lessons',
        documentId,
        { status: 'ended' }
      );
      return res.json({ success: true });
    }

    // Handle processing status update
    if (payload.status === 'processing') {
      await databases.updateDocument(
        'learnai_db',
        'lessons',
        documentId,
        { status: 'processing' }
      );
      return res.json({ success: true });
    }

    // Handle completed status with video_url
    if (payload.video_url) {
      await databases.updateDocument(
        'learnai_db',
        'lessons',
        documentId, 
        {
          videoUrl: payload.video_url,
          status: 'completed'
        }
      );
      return res.json({ success: true });
    }

    // If neither, just acknowledge
    return res.json({ success: true });
    
  } catch (err) {
    error(`Webhook processing failed: ${err.message}`);
    return res.json({ 
      error: "Internal Server Error",
      details: err.message 
    }, 500);
  }
};
