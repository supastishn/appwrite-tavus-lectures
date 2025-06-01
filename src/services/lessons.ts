
import { functions, databases, Permission } from '../lib/appwrite';
import { ID, Permission as AppwritePermission, Query } from 'appwrite';

const LESSONS_DB = 'learnai_db';
const LESSONS_COLLECTION = 'lessons';

export interface Lesson {
  $id: string;
  userId: string;
  topic: string;
  videoUrl: string;
  status: 'pending' | 'processing' | 'ended' | 'completed' | 'failed';
  createdAt: string;
  tavusId: string;
  conversationUrl: string;
}

export const createLesson = async (topic: string, userId: string, replicaId: string, personaId: string = ""): Promise<Lesson> => {
  try {
    // FIRST: Create initial lesson document
    const lessonDoc = await databases.createDocument(
      LESSONS_DB,
      LESSONS_COLLECTION,
      ID.unique(),
      {
        userId,
        topic,
        status: 'pending',
        tavusId: '',
        conversationUrl: '',
        videoUrl: ''
      }
    ) as unknown as Lesson;

    try {
      // SECOND: Initiate Tavus generation
      await functions.createExecution(
        'generateLesson',
        JSON.stringify({ 
          topic, 
          userId,
          documentId: lessonDoc.$id,
          replicaId,
          personaId
        })
      );
    } catch (funcErr: any) {
      // If function fails, update doc to failed state
      await databases.updateDocument(
        LESSONS_DB,
        LESSONS_COLLECTION,
        lessonDoc.$id,
        { status: 'failed' }
      );
      throw new Error(`Function failed: ${funcErr.message}`);
    }

    return lessonDoc;
  } catch (err: any) {
    throw new Error(`Lesson creation failed: ${err.message}`);
  }
};

export const getUserLessons = async (userId: string): Promise<Lesson[]> => {
  try {
    const query = [Query.equal('userId', userId)];
    return (
      await databases.listDocuments(LESSONS_DB, LESSONS_COLLECTION, query)
    ).documents as unknown as Lesson[];
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to fetch lessons: ${err.message}`);
    }
    throw new Error('Unknown error fetching lessons');
  }
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  try {
    await databases.deleteDocument(LESSONS_DB, LESSONS_COLLECTION, lessonId);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to delete lesson: ${err.message}`);
    }
    throw new Error('Unknown error deleting lesson');
  }
};
