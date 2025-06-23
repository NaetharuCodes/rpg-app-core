// ASSET IMPORTS
import { AssetsGalleryPage } from "./pages/Assets/AssetGalleryPage";
import { AssetCreatorPage } from "./pages/Assets/AssetCreatorPage";
import { AssetDetailPage } from "./pages/Assets/AssetDetailPage";

// ADVENTURE VIEW IMPORTS
import { AdventureGalleryPage } from "./pages/Adventures/AdventureGalleryPage";
import { AdventureTitlePage } from "./pages/Adventures/AdventureTitlePage";
import { EpisodeTitlePage } from "./pages/Adventures/AdventureEpisodeTitlePage";
import { AdventureScenePage } from "./pages/Adventures/AdventureScenePage";
import { AdventureEpiloguePage } from "./pages/Adventures/AdventureEpiloguePage";

// ADVENTURE CREATE IMPORTS
import { AdventureBuilderOverviewPage } from "./pages/Adventures/AdventureBuilderOverviewPage";
import { AdventureTitleEditor } from "./pages/Adventures/AdventureTitleEditorPage";
import { AdventureSceneEditorPage } from "./pages/Adventures/AdventureSceneEditorPage";
import { AdventureEpilogueEditorPage } from "./pages/Adventures/AdventureEpilogueEditorPage";

// WORLDS IMPORTS
import { WorldsGalleryPage } from "./pages/Worlds/WorldsGalleryPage";

// MISC PAGES IMPORTS
import { HomePage } from "./pages/HomePage/HomePage";
import { RulesPage } from "./pages/RulesPage/RulesPage";
import { AboutPage } from "./pages/AboutPage/AboutPage";
import { FAQPage } from "./pages/FAQPage/FAQPage";

// OTHER IMPORTS
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthCallbackPage } from "./pages/Auth/AuthCallbackPage";
import { AdminLayout } from "./components/AdminLayout/AdminLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell/AppShell";
import { WorldsOverviewPage } from "./pages/Worlds/WorldsOverviewPage";
import { WorldHistoryPage } from "./pages/Worlds/WorldHistoryPage";
import { WorldLorePage } from "./pages/Worlds/WorldLorePage";
import { WorldStoriesPage } from "./pages/Worlds/WorldStoriesPage";

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
    <AuthProvider>
      <Router>
        <AppShell>
          <Routes>
            {/* Auth Pages */}
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            {/* ASSET PAGES */}
            <Route path="/assets" element={<AssetsGalleryPage />} />
            <Route path="/assets/:id" element={<AssetDetailPage />} />
            <Route path="/assets/create" element={<AssetCreatorPage />} />
            {/* ADVENTURE ROUTES */}
            <Route path="/adventures" element={<AdventureGalleryPage />} />
            <Route
              path="/adventures/:adventureId"
              element={<AdventureTitlePage />}
            />
            <Route
              path="/adventures/:adventureId/episodes/:episodeId"
              element={<EpisodeTitlePage />}
            />
            <Route
              path="/adventures/:adventureId/episodes/:episodeId/scenes/:sceneNumber"
              element={<AdventureScenePage />}
            />
            <Route
              path="/adventures/:adventureId/epilogue"
              element={<AdventureEpiloguePage />}
            />
            {/* ADVENTURE CREATOR ROUTES */}
            <Route
              path="/adventures/create"
              element={<AdventureBuilderOverviewPage />}
            />
            <Route
              path="/adventures/:id/edit"
              element={<AdventureBuilderOverviewPage />}
            />
            <Route
              path="/adventures/:id/edit/title"
              element={<AdventureTitleEditor />}
            />
            <Route
              path="/adventures/:id/edit/epilogue"
              element={<AdventureEpilogueEditorPage />}
            />
            <Route
              path="/adventures/:id/edit/episodes/:episodeId/scenes/:sceneId"
              element={<AdventureSceneEditorPage />}
            />
            {/* WORLDS */}
            <Route path="/worlds" element={<WorldsGalleryPage />} />
            <Route path="/worlds/:id" element={<WorldsOverviewPage />} />
            <Route path="/worlds/:id/history" element={<WorldHistoryPage />} />
            <Route path="/worlds/:id/lore" element={<WorldLorePage />} />{" "}
            <Route path="/worlds/:id/stories" element={<WorldStoriesPage />} />
            {/* MISC pages */}
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminLayout />} />
            {/* Protected Routes (will add auth guards later) */}
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </AppShell>
      </Router>
    </AuthProvider>
  );
}

export default App;
