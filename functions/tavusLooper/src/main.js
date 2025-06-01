import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('tavus-lectures')
    .setKey(req.headers['x-appwrite-key']);
  
  const databases = new Databases(client);

  try {
    // Fetch all ended conversations from Tavus API with pagination
    let allConversations = [];
    let page = 1;
    const perPage = 100;  // Confirming we're fetching 100 records per page
    
    while (true) {
      // Explicitly using limit=100 in the request
      const tavusResponse = await fetch(`https://tavusapi.com/v2/conversations?status=ended&page=${page}&limit=${perPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.TAVUS_API_KEY,
        },
      });

      if (!tavusResponse.ok) {
        const body = await tavusResponse.text();
        throw new Error(`Tavus API error: ${tavusResponse.status} - ${body}`);
      }

      const data = await tavusResponse.json();
      allConversations = [...allConversations, ...(data?.data || [])];
      
      // Debug log showing page size and total count
      log(`Fetched page ${page}: ${data.data.length}/${perPage} conversations. Total: ${allConversations.length}`);
      
      // Check if we've received all pages
      if (data.total_count <= (page * perPage)) {
        break;
      }
      
      page++;
    }

    log(`Received ${allConversations.length} ended conversations from Tavus after fetching ${page} pages`);

    // Sequential processing instead of Promise.all
    let totalUpdated = 0;
    for (const conv of allConversations) {
      try {
        log(`Processing conversation: ${conv.conversation_id}`);
        const lessons = await databases.listDocuments(
          'learnai_db',
          'lessons',
          [
            Query.equal('tavusId', conv.conversation_id),
            Query.notEqual('status', 'ended')
          ]
        );

        log(`Found ${lessons.documents.length} lessons for conversation ${conv.conversation_id}`);

        for (const lesson of lessons.documents) {
          try {
            log(`Updating lesson ${lesson.$id} status to 'ended'`);
            await databases.updateDocument(
              'learnai_db',
              'lessons',
              lesson.$id,
              { status: 'ended' }
            );
            totalUpdated++;
          } catch (updateErr) {
            error(`Update failed for lesson ${lesson.$id}: ${updateErr.message}`);
          }
        }
      } catch (err) {
        error(`Failed processing conversation ${conv.conversation_id}: ${err.message}`);
      }
    }

    log(`Updated ${totalUpdated} lessons to 'ended' status`);
    return res.json({ updated: totalUpdated });

  } catch (err) {
    error(`Looper failed: ${err.message}`);
    return res.json({ error: err.message }, 500);
  }
};
