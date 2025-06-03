import { storage } from '../lib/appwrite';

export async function deleteAvatar(oldAvatarId: string) {
  if (!oldAvatarId) return;
  
  try {
    await storage.deleteFile(
      import.meta.env.VITE_AVATAR_BUCKET_ID,
      oldAvatarId
    );
  } catch (error: any) {
    // Don't handle 404 errors - file might already be deleted
    if (error.code === 404) return; 
    
    console.error('Error deleting old avatar:', error);
    // Throw other errors to be handled upstream
    throw error;
  }
}
