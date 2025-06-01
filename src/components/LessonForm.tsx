import React, { useState } from 'react';
import { createLesson } from '../services/lessons';
import { Models } from 'appwrite';
import { useAppwriteUser } from '../contexts/UserContext';

export default function LessonForm({ onLessonCreated }: { onLessonCreated: (lesson: Models.Lesson) => void }) {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAppwriteUser();

    const [replicaId, setReplicaId] = useState('r79e1c033f');
    const [personaId, setPersonaId] = useState('');

    // Available options
    const replicaOptions = [
      { value: 'r79e1c033f', label: 'Default Replica' },
      // Add other replica options here
    ];
    
    const personaOptions = [
      { value: 'p88964a7', label: 'Teacher Persona' },
      // Add other persona options here
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const lesson = await createLesson(topic, user.$id, replicaId, personaId);
            onLessonCreated(lesson);
            setTopic('');
            // Add notification
            alert("Lesson created! It may take a few minutes to process.");
        } catch (err) {
            console.error('Failed to create lesson:', err);
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setError(`Failed to create lesson: ${msg}`);
            // Keep topic for retry
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="topic" className="block text-sm font-semibold text-gray-700">Lesson Topic</label>
                <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-xl shadow-inner focus:border-primary focus:ring-2 focus:ring-primary-light bg-white/70 transition px-4 py-3"
                    required
                />
            </div>
            <div>
                <label htmlFor="replica" className="block text-sm font-semibold text-gray-700">Replica</label>
                <select
                  id="replica"
                  value={replicaId}
                  onChange={(e) => setReplicaId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-xl shadow-inner focus:border-primary focus:ring-2 focus:ring-primary-light bg-white/70 transition px-4 py-3 text-lg"
                  required
                >
                  {replicaOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
            </div>
            <div>
                <label htmlFor="persona" className="block text-sm font-semibold text-gray-700">Persona (Optional)</label>
                <select
                  id="persona"
                  value={personaId}
                  onChange={(e) => setPersonaId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-xl shadow-inner focus:border-primary focus:ring-2 focus:ring-primary-light bg-white/70 transition px-4 py-3 text-lg"
                >
                  <option value="">No persona</option>
                  {personaOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-primary via-accent to-primary-dark text-white rounded-xl hover:scale-[1.03] hover:shadow-lg transition-all duration-200 font-semibold text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Creating...' : 'Create Lesson'}
            </button>
        </form>
    );
}
