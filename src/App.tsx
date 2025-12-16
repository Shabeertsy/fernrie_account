import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Partners from './pages/Partners';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Todo from './pages/Todo';
import Settings from './pages/Settings';
import Login from './pages/Login';
import CompanyAccounts from './pages/CompanyAccounts';
import TransactionDetail from './pages/TransactionDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="billing" element={<Billing />} />
            <Route path="partners" element={<Partners />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientDetails />} />
            <Route path="todo" element={<Todo />} />
            <Route path="settings" element={<Settings />} />
            <Route path="company-accounts" element={<CompanyAccounts />} />
            <Route path="company-accounts/:id" element={<TransactionDetail />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
