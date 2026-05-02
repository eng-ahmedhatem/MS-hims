import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TrackTicket from './pages/TrackTicket';
import TicketsList from './pages/TicketsList';
import TicketDetail from './pages/TicketDetail';
import ManageManagers from './pages/ManageManagers';
import ManageTechnicians from './pages/ManageTechnicians';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NewTicket from './pages/NewTicket';
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/track" element={<TrackTicket />} />
<Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
  <Route index element={<Dashboard />} />
  <Route path="tickets" element={<TicketsList />} />
  <Route path="tickets/:id" element={<TicketDetail />} />
  <Route path="tickets/new" element={<NewTicket />} />   {/* الجديد */}
  <Route path="managers" element={<ManageManagers />} />
  <Route path="technicians" element={<ManageTechnicians />} />
  <Route path="reports" element={<Reports />} />
  <Route path="settings" element={<Settings />} />
</Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;