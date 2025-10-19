import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FriendProvider } from "./contexts/FriendContext";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import LandingPage from "./routes/LandingPage";
import DashboardPage from "./routes/DashboardPage";
import MatesPage from "./routes/MatesPage";
import AgendaPage from "./routes/AgendaPage";
import NotificationsPage from "./routes/NotificationsPage";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600 font-medium">Loading Moovle...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LandingPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="mates" element={<MatesPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FriendProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FriendProvider>
    </AuthProvider>
  );
}
