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
