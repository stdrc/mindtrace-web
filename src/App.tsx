import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { ThoughtProvider } from './contexts/ThoughtContext';
import { HiddenToggleProvider } from './contexts/HiddenToggleContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProfileProvider>
          <HiddenToggleProvider>
            <ThoughtProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ThoughtProvider>
          </HiddenToggleProvider>
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
