import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell';
import { HomePage } from './pages/HomePage/HomePage';
import { RulesPage } from './pages/RulesPage/RulesPage';
import { AssetCreatorPage } from './pages/AssetCreatorPage/AssetCreatorPage';
import { AssetsGalleryPage } from './pages/AssetGalleryPage/AssetGalleryPage';


// Placeholder components for now

const AdventuresPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Adventures</h1><p>Discover and create epic adventures.</p></div>;
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
          <Route path="/assets" element={<AssetsGalleryPage />} />
          <Route path="/assets/create" element={<AssetCreatorPage />} />
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