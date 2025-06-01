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
