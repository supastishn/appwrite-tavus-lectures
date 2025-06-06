import React, { useState, useEffect } from 'react';
import { createLesson, getUserLessons, deleteLesson, Lesson, updateLessonRating } from '../services/lessons';
import { Models } from 'appwrite';
import { useAppwriteUser } from '../contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Play, Clock, CheckCircle, XCircle, User, Brain, Sparkles, BookOpen, Trash2, LogOut } from 'lucide-react';
import AloCard from '../components/AloCard';

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { user, handleLogout } = useAppwriteUser();
  const navigate = useNavigate();

  // Add state for replica and persona selection
  const [replicaId, setReplicaId] = useState('r79e1c033f');
  const [personaId, setPersonaId] = useState('');

  // Modal state for delete confirmation
  const [deleteModal, setDeleteModal] = useState<{open: boolean; lessonId: string | null}>({
    open: false,
    lessonId: null,
  });

  const confirmDelete = async () => {
    if (deleteModal.lessonId) {
      await handleDeleteLesson(deleteModal.lessonId);
      setDeleteModal({ open: false, lessonId: null });
    }
  };

  const replicaOptions = [
    { value: 'r79e1c033f', label: 'Default Replica' },
    // Add other replica options here
  ];

  const personaOptions = [
    { value: 'p88964a7', label: 'Teacher Persona' },
    // Add other persona options here
  ];

  // StarRating component for lesson ratings
  const StarRating = ({ 
    lessonId,
    currentRating,
    onChange
  }: {
    lessonId: string;
    currentRating: number;
    onChange: (newRating: number) => void;
  }) => {
    const [rating, setRating] = useState(currentRating);
    const [tempRating, setTempRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleRate = async (newRating: number) => {
      setLoading(true);
      try {
        await updateLessonRating(lessonId, newRating);
        setRating(newRating);
        onChange(newRating);
      } catch (err) {
        console.error('Rating update failed:', err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex items-center mt-2">
        <span className="text-sm font-medium text-gray-600 mr-2">Rating:</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setTempRating(star)}
              onMouseLeave={() => setTempRating(0)}
              disabled={loading}
              className="text-xl focus:outline-none disabled:opacity-50"
              aria-label={`Rate ${star} stars`}
            >
              {star <= (tempRating || rating) ? (
                <span className="text-amber-400">★</span>
              ) : (
                <span className="text-gray-300">☆</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Helper to refresh lessons after rating
  const refreshLessons = async () => {
    if (user) {
      const userLessons = await getUserLessons(user.$id);
      setLessons(userLessons);
    }
  };

  useEffect(() => {
    const fetchLessons = async () => {
      if (user) {
        try {
          const userLessons = await getUserLessons(user.$id);
          setLessons(userLessons);
        } catch (err) {
          // Optionally handle error
        }
      }
    };
    fetchLessons();

    // Refresh lessons every 30 seconds
    const interval = setInterval(fetchLessons, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
        const newLesson = await createLesson(topic, user.$id, replicaId, personaId);
        setTopic(''); // Reset topic on success
        setLessons((prev) => [newLesson, ...prev]); // Add new lesson to list

        // Add redirect to Tavus conversation
        if (newLesson.conversationUrl) {
          window.open(newLesson.conversationUrl, '_blank');
        }
    } catch (err) {
        console.error('Failed to create lesson:', err);
        setError('Failed to create lesson. Please try again. ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLesson(lessonId);
      setLessons((prev) => prev.filter(lesson => lesson.$id !== lessonId));
    } catch (err) {
      console.error('Failed to delete lesson:', err);
      // Optionally show error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header with Profile Icon */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Dashboard</span>
            <span className="text-gray-400 text-base">|</span>
            <span className="text-indigo-500 font-normal">Welcome {user?.name}</span>
          </h1>
          <Link 
            to="/profile" 
            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full transition"
            title="Go to Profile"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Lesson Panel */}
          <div className="lg:col-span-1">
            <AloCard>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Lesson</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    What would you like to learn about?
                  </label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Machine Learning Basics, Spanish Grammar..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:border-primary focus:ring-2 focus:ring-primary-light bg-white/70 transition dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="replica" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Choose Instructor
                  </label>
                  <select
                    id="replica"
                    value={replicaId}
                    onChange={(e) => setReplicaId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:border-primary focus:ring-2 focus:ring-primary-light bg-white/70 transition dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    required
                  >
                    {replicaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="persona" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Teaching Style (Optional)
                  </label>
                  <select
                    id="persona"
                    value={personaId}
                    onChange={(e) => setPersonaId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:border-primary focus:ring-2 focus:ring-primary-light bg-white/70 transition dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  >
                    <option value="">Standard approach</option>
                    {personaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium dark:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Lesson</span>
                    </>
                  )}
                </button>
              </form>
            </AloCard>
          </div>

          {/* Lessons Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Your Lessons</h3>
              <span className="text-sm text-gray-500">{lessons.length} total</span>
            </div>

            {lessons.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No lessons yet</h4>
                <p className="text-gray-500 dark:text-gray-300 mb-6">Create your first AI-powered lesson to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lessons.map(lesson => {
                  const getStatusIcon = (status: string) => {
                    switch (status) {
                      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
                      case 'processing': return <Clock className="w-5 h-5 text-blue-600" />;
                      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
                      default: return <Clock className="w-5 h-5 text-gray-400" />;
                    }
                  };

                  const getStatusStyle = (status: string) => {
                    switch (status) {
                      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
                      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
                      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
                      default: return 'bg-gray-50 text-gray-700 border-gray-200';
                    }
                  };

                  return (
                    <AloCard key={lesson.$id} className="hover:shadow-lg transition-shadow p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">{lesson.topic}</h4>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(lesson.status)}
                          <button
                            onClick={() => setDeleteModal({ open: true, lessonId: lesson.$id })}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete lesson"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(lesson.status)} mb-4`}>
                        {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                      </div>

                      {/* Star rating for completed lessons */}
                      {lesson.status === 'completed' && lesson.videoUrl && (
                        <div className="mt-3">
                          <StarRating
                            lessonId={lesson.$id}
                            currentRating={lesson.rating || 0}
                            onChange={() => refreshLessons()}
                          />
                        </div>
                      )}

                      <div className="space-y-3">
                        {lesson.conversationUrl && !lesson.videoUrl && lesson.status === 'processing' && (
                          <a
                            href={`/conversation/${lesson.tavusId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Join Live Session</span>
                          </a>
                        )}

                        {lesson.videoUrl && lesson.status === 'completed' && (
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            <span>Watch Lesson</span>
                          </a>
                        )}
                      </div>
                    </AloCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    {/* Modal for delete confirmation */}
    {deleteModal.open && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this lesson? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal({ open: false, lessonId: null })}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-xl transition"
            >
              Delete Lesson
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
