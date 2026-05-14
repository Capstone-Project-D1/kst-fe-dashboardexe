import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ROUTES } from "./routes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "@/pages/login/Login";
import Register from "@/pages/register/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import DashboardLayout from "@/layouts/dashboardLayout/DashboardLayout";

// Helper component for pages that aren't created yet
const DummyPage = ({ title }: { title: string }) => (
  <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
    <p className="text-gray-500">Halaman ini sedang dalam pengembangan.</p>
  </div>
);

export const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.AUTH_LOGIN} element={<Login />} />
          <Route path={ROUTES.AUTH_REGISTER} element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD.substring(1)} element={<Dashboard />} />
            <Route path={ROUTES.TRACKER_INOVASI.substring(1)} element={<DummyPage title="Tracker Inovasi" />} />
            <Route path={ROUTES.PRODUKSI.substring(1)} element={<DummyPage title="Produksi" />} />
            <Route path={ROUTES.STOK_OPNAME.substring(1)} element={<DummyPage title="Stok Opname" />} />
            <Route path={ROUTES.BOOKLIST_ATP.substring(1)} element={<DummyPage title="Booklist ATP" />} />
            <Route path={ROUTES.PERTANIAN.substring(1)} element={<DummyPage title="Pertanian" />} />
            <Route path={ROUTES.PETERNAKAN.substring(1)} element={<DummyPage title="Peternakan" />} />
            <Route path={ROUTES.KONSERVASI.substring(1)} element={<DummyPage title="Konservasi" />} />
            <Route path={ROUTES.PELAYANAN_AKADEMIK.substring(1)} element={<DummyPage title="Pelayanan Akademik" />} />
            <Route path={ROUTES.KEMITRAAN.substring(1)} element={<DummyPage title="Kemitraan" />} />
            <Route path={ROUTES.PROFILE.substring(1)} element={<DummyPage title="Profil" />} />
            <Route path={ROUTES.CHANGE_PASSWORD.substring(1)} element={<DummyPage title="Ganti Password" />} />
          </Route>

          {/* Default/Catch-all Route */}
          <Route path="*" element={<Navigate to={ROUTES.AUTH_LOGIN} replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};
