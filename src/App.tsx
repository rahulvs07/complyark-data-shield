
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/use-theme";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import RequestPage from "@/pages/RequestPage";
import Notices from "@/pages/Notices";
import DataRequests from "@/pages/DataRequests";
import Grievances from "@/pages/Grievances";
import Documents from "@/pages/Documents";

// Admin Pages
import OrganisationsAdmin from "@/pages/admin/Organisations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/notices"
                element={
                  <ProtectedRoute>
                    <Notices />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/data-requests"
                element={
                  <ProtectedRoute>
                    <DataRequests />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/grievances"
                element={
                  <ProtectedRoute>
                    <Grievances />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />
              
              {/* System Admin Routes */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/organisations" replace />}
              />
              <Route
                path="/admin/organisations"
                element={
                  <ProtectedRoute allowedRoles={["system-admin"]}>
                    <OrganisationsAdmin />
                  </ProtectedRoute>
                }
              />
              
              {/* External Request Page (accessible without login) */}
              <Route path="/request-page/:orgIdEncoded" element={<RequestPage />} />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
