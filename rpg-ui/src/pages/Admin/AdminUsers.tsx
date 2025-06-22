import { useEffect, useState } from "react";
import {
  Search,
  User as UserIcon,
  UserCheck,
  UserX,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/Card/Card";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import type { User } from "@/services/api";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_active: !isActive }),
        }
      );

      if (response.ok) {
        // Refresh the user list
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const promoteToAdmin = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/users/${userId}/promote`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Refresh the user list
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to promote user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="text-sm text-muted-foreground">
          {users.length} total users
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Users List */}
      <Card variant="elevated">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={user.is_active ? "green" : "destructive"}
                        size="sm"
                      >
                        {user.is_active ? "Active" : "Banned"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={user.is_admin ? "horror" : "secondary"}
                        size="sm"
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={user.is_active ? UserX : UserCheck}
                          onClick={() =>
                            toggleUserStatus(user.id, user.is_active)
                          }
                          className={
                            user.is_active ? "text-red-600" : "text-green-600"
                          }
                        >
                          {user.is_active ? "Ban" : "Unban"}
                        </Button>
                        {!user.is_admin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={Shield}
                            onClick={() => promoteToAdmin(user.id)}
                          >
                            Make Admin
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
