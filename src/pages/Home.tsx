import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';
import ThoughtList from '../components/Thought/ThoughtList';
import ThoughtInput from '../components/Thought/ThoughtInput';

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen diary-page">
        <div className="text-center diary-card p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600 mb-4"></div>
          <p className="diary-text">Loading your thoughts...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Input card at top */}
        <div className="diary-card p-3 sm:p-4 md:p-6">
          <ThoughtInput />
        </div>
        
        {/* Thought List below */}
        <ThoughtList />
      </div>
    </Layout>
  );
} 