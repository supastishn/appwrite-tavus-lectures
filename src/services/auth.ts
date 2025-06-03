import { account } from '../lib/appwrite';
import { ID } from 'appwrite';
import { storage } from '../lib/appwrite';

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

export const logout = async () => {
    return await account.deleteSession('current');
};

// Add these new methods:
export const updateUserName = async (name: string) => {
  return await account.updateName(name);
};

export const updatePassword = async (password: string, oldPassword: string) => {
  return await account.updatePassword(password, oldPassword);
};

// Avatar services
export const uploadAvatar = async (file: File) => {
  return storage.createFile(
    import.meta.env.VITE_AVATAR_BUCKET_ID!,
    ID.unique(),
    file
  );
};

export const deleteAvatar = async (avatarId: string) => {
  try {
    await storage.deleteFile(
      import.meta.env.VITE_AVATAR_BUCKET_ID!,
      avatarId
    );
  } catch (error: any) {
    // Handle specific error codes
    if (error.code !== 404) {
      throw error;
    }
  }
};

export const getAvatarUrl = (avatarId: string) => {
  return storage.getFileView(
    import.meta.env.VITE_AVATAR_BUCKET_ID!,
    avatarId
  ).href;
};

export const updateAvatarId = async (avatarId: string) => {
  return account.updatePrefs({ avatarId });
};
