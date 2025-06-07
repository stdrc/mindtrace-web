import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
    } catch (err) {
      setError((err as Error).message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center diary-page p-4">
      <div className="app-container">
        <div className="diary-card p-6 sm:p-8 w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="diary-title text-3xl mb-2">MindTrace</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block diary-text text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block diary-text text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                autoComplete="off"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="diary-text text-sm opacity-60">
              Account access is managed by the administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 