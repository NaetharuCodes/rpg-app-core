import { useEffect, useState } from "react";
import { Users, Package, Map, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssets: 0,
    totalAdventures: 0,
    pendingContent: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalUsers: data.total_users,
            totalAssets: data.total_assets,
            totalAdventures: data.total_adventures,
            pendingContent: data.recent_registrations,
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="elevated" className="text-center">
          <CardContent className="p-6">
            <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="text-center">
          <CardContent className="p-6">
            <Package className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <div className="text-sm text-muted-foreground">Assets</div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="text-center">
          <CardContent className="p-6">
            <Map className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">{stats.totalAdventures}</div>
            <div className="text-sm text-muted-foreground">Adventures</div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">{stats.pendingContent}</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-semibold">Content Management</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Review and approve user-generated content
            </p>
            <Link to="/admin/content">
              <Button variant="primary">Review Content</Button>
            </Link>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-semibold">User Management</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage user accounts and permissions
            </p>
            <Link to="/admin/users">
              <Button variant="primary">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
