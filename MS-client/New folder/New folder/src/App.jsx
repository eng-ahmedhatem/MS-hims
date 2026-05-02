import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import CreateTicket from './pages/CreateTicket';
import TrackTicket from './pages/TrackTicket';
import Dashboard from './pages/Dashboard';
import TicketsList from './pages/TicketsList';
import TicketDetail from './pages/TicketDetail';
import NewTicket from './pages/NewTicket';
import ManageManagers from './pages/ManageManagers';
import ManageTechnicians from './pages/ManageTechnicians';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-lg">
        جاري التحميل...
      </div>
    );
  }
  return user ? children : <Navigate to="/" replace />;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-lg">
        جاري التحميل...
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* الصفحة الرئيسية العامة (غير مسموح للمستخدمين المسجلين) */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <HomePage />
              </PublicOnlyRoute>
            }
          />
          {/* تسجيل الدخول */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          {/* صفحات عامة بدون قيود */}
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/track" element={<TrackTicket />} />

          {/* لوحة التحكم (بعد تسجيل الدخول) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tickets" element={<TicketsList />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="tickets/new" element={<NewTicket />} />
            <Route path="managers" element={<ManageManagers />} />
            <Route path="technicians" element={<ManageTechnicians />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* أي مسار غير معروف */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;