import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error, updateProfile, getDaysSinceBirth } = useUserProfile();
  const navigate = useNavigate();
  
  const [birthDate, setBirthDate] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile?.birth_date) {
      setBirthDate(profile.birth_date);
    }
  }, [profile]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen diary-page">
        <div className="text-center diary-card p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600 mb-4"></div>
          <p className="diary-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(birthDate || null);
      setIsEditing(false);
    } catch (err) {
      // Error is handled by context
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setBirthDate(profile?.birth_date || '');
    setIsEditing(false);
  };

  const daysSinceBirth = getDaysSinceBirth();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="diary-card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="diary-title text-2xl mb-2">Profile Settings</h1>
              <p className="diary-text text-sm opacity-75">
                Manage your personal information and preferences
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block diary-text text-sm font-medium mb-2">
                Email
              </label>
              <div className="input bg-gray-50 cursor-not-allowed">
                {user.email}
              </div>
              <p className="diary-text text-xs opacity-60 mt-1">
                Your email address cannot be changed here
              </p>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block diary-text text-sm font-medium mb-2">
                Birth Date
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="input"
                    max={new Date().toISOString().split('T')[0]}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      isLoading={isSaving}
                      disabled={isSaving}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    {profile?.birth_date ? (
                      <div>
                        <div className="diary-text">
                          {new Date(profile.birth_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        {daysSinceBirth && (
                          <div className="diary-text text-sm opacity-60 mt-1">
                            Day {daysSinceBirth.toLocaleString()} of your life
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="diary-text opacity-60">
                        Not set
                      </div>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    {profile?.birth_date ? 'Edit' : 'Set Birth Date'}
                  </Button>
                </div>
              )}
              <p className="diary-text text-xs opacity-60 mt-1">
                Your birth date is used to calculate life days displayed in the thought timeline
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="diary-card p-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            ← Back to Thoughts
          </Button>
        </div>
      </div>
    </Layout>
  );
} 