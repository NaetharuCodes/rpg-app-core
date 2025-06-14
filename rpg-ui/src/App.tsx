import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell';
// Placeholder components for now
const HomePage = () => <div className="p-6"><h1 className="text-2xl font-bold">Home Page</h1><p>Welcome to the RPG Adventure Manager!</p></div>;
const AssetsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Assets Library</h1><p>Browse characters, creatures, items, and locations.</p></div>;
const AdventuresPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Adventures</h1><p>Discover and create epic adventures.</p></div>;
const RulesPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Simple D6 Rules</h1><p>Learn the game rules.</p></div>;
const AboutPage = () => <div className="p-6"><h1 className="text-2xl font-bold">About</h1><p>About this RPG platform.</p></div>;
const LoginPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Sign In</h1><p>Sign in to access your content.</p></div>;
const DashboardPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p>Your personal RPG hub.</p></div>;

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/adventures" element={<AdventuresPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes (will add auth guards later) */}
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;