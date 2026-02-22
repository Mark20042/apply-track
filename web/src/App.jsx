import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute, GuestRoute } from "@/components/ProtectedRoute";

import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import AllJobs from "./pages/user/AllJobs";
import Profile from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<RootLayout />}>
              <Route path="/" element={<Landing />} />
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                }
              />
            </Route>

            {/* User dashboard — requires auth */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/jobs" element={<AllJobs />} />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>

            {/* Admin panel — requires auth + isAdmin */}
            <Route
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
