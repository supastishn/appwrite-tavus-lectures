import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);

  const databases = new Databases(client);

  try {
    const { topic, userId, documentId, replicaId, personaId = '' } = JSON.parse(req.bodyRaw || '{}');
    
    if (!topic || !userId || !documentId || !replicaId) {
      return res.json({ error: 'Missing required fields' }, 400);
    }

    log(`Initiating Tavus for document: ${documentId}`);
    
    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAVUS_API_KEY,
      },
      body: JSON.stringify({
        replica_id: replicaId,
        persona_id: personaId,
        callback_url: process.env.TAVUS_WEBHOOK_URL,
        conversation_name: `LearnAI Lesson: ${topic}`,
        conversational_context: `Explain ${topic} in an educational lesson format for beginners in a concise 2 min video.`,
        custom_greeting: `Let's learn about ${topic} today!`,
        properties: {
          max_call_duration: 120,
          participant_left_timeout: 60,
          participant_absent_timeout: 180,
          enable_recording: true,
          enable_closed_captions: true,
          apply_greenscreen: false,
          language: "english"
        }
      })
    });

    const data = await tavusResponse.json();
    
    if (!tavusResponse.ok) {
      throw new Error(`Tavus API error: ${data.error || data.message || 'Unknown error'}`);
    }

    log(`Tavus conversation initiated: ${data.conversation_id}`);

    // Update the existing document with Tavus info
    await databases.updateDocument(
      'learnai_db',
      'lessons',
      documentId,
      {
        tavusId: data.conversation_id,
        conversationUrl: data.conversation_url,
        status: 'processing'
      }
    );

    return res.json({ 
      status: 'processing',
      tavusId: data.conversation_id
    });

  } catch (err) {
    error(err.message);
    if (documentId) {
      try {
        await databases.updateDocument(
          'learnai_db',
          'lessons',
          documentId,
          { 
            status: 'failed',
            error: err.message.substring(0, 255)
          }
        );
      } catch (updateErr) {
        error(`Failed to update lesson as failed: ${updateErr.message}`);
      }
    }
    return res.json({ 
      error: "Internal Server Error",
      details: err.message 
    }, 500);
  }
};
