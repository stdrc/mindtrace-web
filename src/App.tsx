import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThoughtProvider } from './contexts/ThoughtContext';
import { HiddenToggleProvider } from './contexts/HiddenToggleContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <HiddenToggleProvider>
          <ThoughtProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ThoughtProvider>
        </HiddenToggleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
