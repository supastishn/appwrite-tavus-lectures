import React, { useState, useEffect } from 'react';
import { User, Key, Mail, Save, XCircle, CheckCircle, Loader, LogOut, Pencil } from 'lucide-react';
import { useAppwriteUser } from '../contexts/UserContext';
import { updateUserName, updatePassword, uploadAvatar, updateAvatarId, deleteAvatar, getAvatarUrl } from '../services/auth';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Profile() {
  const { user, refetchUser, handleLogout } = useAppwriteUser();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null; message: string }>({ type: null, message: '' });

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [oldAvatarId, setOldAvatarId] = useState(user?.prefs?.avatarId || '');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      if (user.prefs?.avatarId) {
        setAvatarPreview(getAvatarUrl(user.prefs.avatarId));
        setOldAvatarId(user.prefs.avatarId);
      } else {
        setAvatarPreview('');
        setOldAvatarId('');
      }
    }
  }, [user]);

  // Avatar validation and change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setStatus({ type: 'error', message: 'Only JPEG and PNG images allowed'});
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'Max file size is 5MB'});
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Avatar upload logic
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    try {
      // Upload new avatar
      const newFile = await uploadAvatar(avatarFile);

      // Update user prefs with new avatar ID
      await updateAvatarId(newFile.$id);

      // Delete old avatar
      if (oldAvatarId && oldAvatarId !== newFile.$id) {
        await deleteAvatar(oldAvatarId).catch(console.error);
      }

      setAvatarFile(null);
      setStatus({ type: 'success', message: 'Avatar updated successfully!' });
      refetchUser();
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to update avatar' });
    }
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus({ type: 'loading', message: 'Updating name...' });
    try {
      // If avatar is being changed, upload it first
      if (avatarFile) {
        await handleAvatarUpload();
      }
      await updateUserName(name);
      refetchUser();
      setStatus({ type: 'success', message: 'Name updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update name' });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !currentPassword) return;

    setStatus({ type: 'loading', message: 'Updating password...' });
    try {
      await updatePassword(newPassword, currentPassword);
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setNewPassword('');
      setCurrentPassword('');
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update password' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-start justify-center py-10 font-sans">
      <div className="w-full max-w-3xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Your Profile
            </h1>
            <Link 
              to="/dashboard" 
              className="text-white/80 hover:text-white hover:underline text-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {/* Status Message */}
          {status.type && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              status.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 
              status.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 
              'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
               status.type === 'error' ? <XCircle className="w-5 h-5" /> : 
               <Loader className="w-5 h-5 animate-spin" />}
              <span className="font-medium">{status.message}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
            {/* Profile Info */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <div className="flex flex-col items-center mb-6 relative">
                <div className="relative">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center border-2 border-gray-100">
                      <span className="text-3xl text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}  
                      </span>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer">
                    <Pencil className="w-5 h-5 text-primary" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <button
                  onClick={handleAvatarUpload}
                  disabled={!avatarFile}
                  className={`mt-4 px-3 py-1 text-sm rounded-md ${
                    avatarFile ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  Save Avatar
                </button>
                <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mt-4">
                  {user?.name || 'User'}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email || ''}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Joined</span>
                  <span>
                    {user?.registration 
                      ? new Date(user.registration * 1000).toLocaleDateString() 
                      : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Email Verified</span>
                  <span>
                    {user?.emailVerification 
                      ? 'Yes' : 
                      <span className="text-red-500">No</span>}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full mt-8 py-2 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
            
            {/* Update Forms */}
            <div>
              {/* Update Name Form */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Update Profile Info
                </h3>
                
                <form onSubmit={handleNameUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
              
              {/* Update Password Form */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Change Password
                </h3>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter new password"
                      required
                      minLength={8}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
