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
    <div className="h-full modern-page flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col min-h-0 scrollable-content">
        <div className="w-full mx-auto px-3 py-4 sm:px-6 sm:py-6 md:px-8 flex-1 flex flex-col min-h-0 content-container">
          <div className="flex items-center justify-center flex-1">
            <div>
              <div className="modern-card p-6 sm:p-8 w-full max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <div className="mb-1">
                    <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                      <img 
                        src="/logo-transparent.svg" 
                        alt="MindTrace Logo" 
                        className="w-18 h-18"
                      />
                    </div>
                  </div>
                  <h1 className="website-title text-3xl mb-2">MindTrace</h1>
                </div>

                {error && (
                  <div className="bg-danger border border-danger text-danger px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block modern-text text-sm font-medium mb-2">
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
                    <label htmlFor="password" className="block modern-text text-sm font-medium mb-2">
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

                <div className="text-center">
                  <p className="modern-text text-sm opacity-0 h-0">
                    Account access is managed by the administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 