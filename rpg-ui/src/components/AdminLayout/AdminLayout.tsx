import { Navigate, Routes, Route } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminDashboard } from "@/pages/Admin/AdminDashboard";
import { AdminUsers } from "@/pages/Admin/AdminUsers";
import { AdminContent } from "@/pages/Admin/AdminContent";

export function AdminLayout() {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    console.log("you are not admin");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header/Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {/* Admin nav tabs */}
        </div>
      </div>

      {/* Admin Routes */}
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="content" element={<AdminContent />} />
        {/* <Route path="analytics" element={<AdminAnalytics />} /> */}
      </Routes>
    </div>
  );
}
