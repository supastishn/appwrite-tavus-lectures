
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
  rating?: number;
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

export const updateLessonRating = async (
  lessonId: string, 
  rating: number
): Promise<void> => {
  try {
    await databases.updateDocument(
      LESSONS_DB,
      LESSONS_COLLECTION,
      lessonId,
      { rating }
    );
  } catch (err) {
    throw new Error(
      `Failed to update rating: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
  }
};

/**
 * Fetch a lesson by its Tavus conversation id (tavusId).
 * Returns the lesson document or throws if not found.
 */
export const getLessonByConversationId = async (conversationId: string): Promise<Lesson | null> => {
  try {
    const query = [Query.equal('tavusId', conversationId)];
    const result = await databases.listDocuments(LESSONS_DB, LESSONS_COLLECTION, query);
    if (result.documents.length > 0) {
      return result.documents[0] as unknown as Lesson;
    }
    return null;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to fetch lesson by conversation id: ${err.message}`);
    }
    throw new Error('Unknown error fetching lesson by conversation id');
  }
};
