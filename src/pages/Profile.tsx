import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
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
      <div className="h-full modern-page flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col min-h-0 scrollable-content">
          <div className="w-full mx-auto px-3 py-4 sm:px-6 sm:py-6 md:px-8 flex-1 flex flex-col min-h-0 content-container">
            <div className="flex items-center justify-center flex-1">
              <div className="text-center modern-card p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600 mb-4"></div>
                <p className="modern-text">Loading your profile...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(birthDate || null);
      setIsEditing(false);
    } catch {
      // Error is handled by context
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setBirthDate(profile?.birth_date || '');
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const daysSinceBirth = getDaysSinceBirth();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="modern-card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="modern-title text-2xl mb-2">Profile</h1>
              <p className="modern-text text-sm opacity-75">
                Manage your personal information and preferences
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-danger border border-danger text-danger px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block modern-text text-sm font-medium mb-2">
                Email
              </label>
              <div className="input bg-interactive cursor-not-allowed select-none">
                {user.email}
              </div>
              <p className="modern-text text-xs opacity-60 mt-1">
                Your email address cannot be changed here
              </p>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block modern-text text-sm font-medium mb-2">
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
                        <div className="modern-text">
                          {new Date(profile.birth_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        {daysSinceBirth && (
                          <div className="modern-text text-sm opacity-60 mt-1">
                            Day {daysSinceBirth.toLocaleString()} of your life
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="modern-text opacity-60">
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
              <p className="modern-text text-xs opacity-60 mt-1">
                Your birth date is used to calculate life days displayed in the thought timeline
              </p>
            </div>

            {/* Account Actions */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="modern-text text-sm font-medium mb-1">
                    Account Actions
                  </div>
                  <div className="modern-text text-xs opacity-60">
                    Sign out of your account
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
} 