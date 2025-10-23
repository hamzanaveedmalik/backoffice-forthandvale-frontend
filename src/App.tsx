import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Samples from './pages/Samples';
import Quotes from './pages/Quotes';
import Orders from './pages/Orders';
import Shipping from './pages/Shipping';
import Users from './pages/Users';
import Costing from './pages/Costing';
import Pricing from './pages/Pricing';
import Billing from './pages/Billing';
import ProtectedRoute from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="dashboard"
              element={
                <RoleProtectedRoute requiredPermission="canViewDashboard">
                  <Dashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="leads"
              element={
                <RoleProtectedRoute requiredPermission="canViewDashboard">
                  <Leads />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="samples"
              element={
                <RoleProtectedRoute requiredPermission="canViewDashboard">
                  <Samples />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="quotes"
              element={
                <RoleProtectedRoute requiredPermission="canViewDashboard">
                  <Quotes />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="costing"
              element={
                <RoleProtectedRoute requiredPermission="canViewDashboard">
                  <Costing />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="pricing"
              element={
                <RoleProtectedRoute requiredPermission="canViewDashboard">
                  <Pricing />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="billing"
              element={
                <RoleProtectedRoute requiredPermission="canViewDashboard">
                  <Billing />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <RoleProtectedRoute requiredPermission="canViewOrders">
                  <Orders />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="shipping"
              element={
                <RoleProtectedRoute requiredPermission="canViewShipping">
                  <Shipping />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <RoleProtectedRoute requiredPermission="canManageUsers">
                  <Users />
                </RoleProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
