import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Checklist from "./pages/Checklist";
import MyLinks from "./pages/MyLinks";
import AddressAlerts from "./pages/AddressAlerts";
import Guides from "./pages/Guides";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthRoute } from "./components/auth/AuthRoute";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SidebarProvider } from "./contexts/SidebarContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SidebarProvider>
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
              <Route path="/auth/callback" element={<AuthRoute><Auth /></AuthRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

              {/* Customer Routes */}
              <Route path="/" element={<ProtectedRoute customerOnly><Index /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute customerOnly><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute customerOnly><Settings /></ProtectedRoute>} />
              <Route path="/checklist" element={<ProtectedRoute customerOnly><Checklist /></ProtectedRoute>} />
              <Route path="/my-links" element={<ProtectedRoute customerOnly><MyLinks /></ProtectedRoute>} />
              <Route path="/address-alerts" element={<ProtectedRoute customerOnly><AddressAlerts /></ProtectedRoute>} />
              <Route path="/guides" element={<ProtectedRoute customerOnly><Guides /></ProtectedRoute>} />
            </Routes>
            <Toaster />
          </Router>
        </SidebarProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;