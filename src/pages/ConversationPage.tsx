import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonByConversationId } from '../services/lessons';

const ConversationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversationUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          setError('No conversation id provided.');
          setLoading(false);
          return;
        }
        const lesson = await getLessonByConversationId(id);
        if (lesson && lesson.conversationUrl) {
          setConversationUrl(lesson.conversationUrl);
        } else {
          setError('Conversation not found or has no URL.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchConversationUrl();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700 dark:text-gray-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <h1 className="text-lg font-bold text-primary-dark dark:text-primary-light">
            Live Lesson Session
          </h1>
          <span className="ml-2 text-gray-500 text-xs">ID: {id}</span>
        </div>
        <div 
          ref={containerRef} 
          className="relative flex-1 w-full"
        >
          {!conversationUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <p className="text-gray-500 dark:text-gray-300">Loading conversation...</p>
            </div>
          )}
          {conversationUrl && (
            <p className="text-center p-4">
              DailyJS SDK removed. Video functionality unavailable.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
