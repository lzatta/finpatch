import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './app/layout';
import DashboardPage from './app/dashboard/page';
import TransactionsPage from './app/transactions/page';
import GoalsPage from './app/goals/page';
import ChallengesPage from './app/challenges/page';
import AiAssistantPage from './app/ai-assistant/page';
import FamilyPage from './app/family/page';
import ProfilePage from './app/profile/page';
import LoginPage from './app/login/page';
import RegisterPage from './app/register/page';
import PlansPage from './app/onboarding/plans/page';
import ProtectedRoute from './components/auth/protected-route';
import PublicRoute from './components/auth/public-route';
import ProtectedFeatureRoute from './components/auth/ProtectedFeatureRoute';

function App() {
  return (
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        
        <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route
            path="/family"
            element={
              <ProtectedFeatureRoute feature="family">
                <FamilyPage />
              </ProtectedFeatureRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding/plans" element={<PlansPage />} />
          <Route path="/billing/plans" element={<PlansPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;
