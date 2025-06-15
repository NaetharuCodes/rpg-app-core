import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell/AppShell";
import { HomePage } from "./pages/HomePage/HomePage";
import { RulesPage } from "./pages/RulesPage/RulesPage";
import { AssetCreatorPage } from "./pages/AssetCreatorPage/AssetCreatorPage";
import { AssetsGalleryPage } from "./pages/AssetGalleryPage/AssetGalleryPage";
import { AdventureTitlePage } from "./pages/Adventures/AdventureTitlePage";
import { AdventureScenePage } from "./pages/Adventures/AdventureScenePage";
import { AdventureEpiloguePage } from "./pages/Adventures/AdventureEpiloguePage";
import { AboutPage } from "./pages/AboutPage/AboutPage";
import { FAQPage } from "./pages/FAQPage/FAQPage";
import { AdventureGalleryPage } from "./pages/Adventures/AdventureGalleryPage";
import { AdventureBuilderOverviewPage } from "./pages/Adventures/AdventureBuilderOverviewPage";
import { AdventureTitleEditor } from "./pages/Adventures/AdventureTitleEditorPage";
import { AdventureSceneEditorPage } from "./pages/Adventures/AdventureSceneEditorPage";
import { AdventureEpilogueEditorPage } from "./pages/Adventures/AdventureEpilogueEditorPage";

// Placeholders
const LoginPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Sign In</h1>
    <p>Sign in to access your content.</p>
  </div>
);
const DashboardPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p>Your personal RPG hub.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/assets" element={<AssetsGalleryPage />} />
          <Route path="/assets/create" element={<AssetCreatorPage />} />
          <Route path="/adventures" element={<AdventureGalleryPage />} />
          <Route
            path="/adventures/:adventureId"
            element={<AdventureTitlePage />}
          />
          <Route
            path="/adventures/:adventureId/scenes/:sceneNumber"
            element={<AdventureScenePage />}
          />
          <Route
            path="/adventures/:adventureId/epilogue"
            element={<AdventureEpiloguePage />}
          />
          <Route
            path="/adventures/builder"
            element={<AdventureBuilderOverviewPage />}
          />
          <Route
            path="/adventures/builder/title/:adventureId"
            element={<AdventureTitleEditor />}
          />
          <Route
            path="/adventures/builder/epilogue"
            element={<AdventureEpilogueEditorPage />}
          />
          <Route
            path="/adventures/builder/scene/:adventureId"
            element={<AdventureSceneEditorPage />}
          />

          {/* MISC pages */}
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />

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
