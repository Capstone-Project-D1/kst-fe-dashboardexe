import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Welcome, {user?.name}!</h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Member Since:</strong>{" "}
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString("id-ID")}
            </p>
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24</div>
              <p className="text-gray-600">Total Projects</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,240</div>
              <p className="text-gray-600">Total Users</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
