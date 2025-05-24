import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import StaffManagement from './pages/admin/building/StaffManagement'
import { AuthProvider } from './context/AuthContext'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'
import StaffLayout from './pages/staff/StaffLayout'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './pages/admin/Dashboard'
import HomeSummary from './pages/admin/building/HomeSummary'
import MaintenanceRequests from './pages/admin/building/MaintenanceRequests'
import NoticeManagement from './pages/admin/building/NoticeManagement'
import ApartmentManagement from './pages/admin/building/ApartmentManagement'
import StaffDashboard from './pages/staff/Dashboard'
import './App.css'
import ResidentManagement from './pages/admin/building/ResidentManagement'
import ResidentDashboard from './pages/resident/Dashboard'
import ResidentMaintenanceRequests from './pages/resident/MaintenanceRequests'
import ResidentNotices from './pages/resident/Notices'
import ResidentLayout from './pages/resident/ResidentLayout'
import Home from './pages/home/Home'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home/>} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="buildings/:buildingName" element={<AdminLayout />}>
                <Route path="staff" element={<StaffManagement />} />
                <Route path="summary" element={<HomeSummary />} />
                <Route path="maintenance" element={<MaintenanceRequests />} />
                <Route path="notices" element={<NoticeManagement />} />
                <Route path="apartments" element={<ApartmentManagement />} />
                <Route path="residents" element={<ResidentManagement />} />
              </Route>
            </Route>

            {/* Staff Routes */}
            <Route path="/staff" element={<StaffLayout />}>
              <Route path="dashboard" element={<StaffDashboard />} />
            </Route>

            {/* Resident Routes */}
            <Route path="/resident" element={<ResidentLayout />}>
              <Route path="dashboard" element={<ResidentDashboard />} />
              <Route path="maintenance" element={<ResidentMaintenanceRequests />} />
              <Route path="notices" element={<ResidentNotices />} />
            </Route>

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
