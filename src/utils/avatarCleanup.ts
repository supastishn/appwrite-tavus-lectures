import { storage, account } from '../lib/appwrite';
import { deleteAvatar } from '../services/auth';

export async function cleanOrphanedAvatars() {
  // This could be a cron job in backend
  // Currently being called when user uploads new avatar
}
