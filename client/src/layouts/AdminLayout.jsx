import { Outlet, useNavigate, useParams, useLocation,Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';


const SidebarLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <span className="text-xl">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'buildingAdmin' && user.role !== 'superAdmin')) {
      navigate('/login');
    }
  }, [user, navigate]);
  const buildingName = useParams().buildingName;
  return (
    <div className="bg-gray-50 flex h-full">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg h-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-primary">HMSS Admin</h2>
        </div>
        <nav className="mt-4">
          
          {/* Navigation items will be added here */}
          
          <SidebarLink to={`/admin/buildings/${buildingName}/summary`} icon="🏠">
            Home Summary
          </SidebarLink>
          <SidebarLink to={`/admin/buildings/${buildingName}/maintenance`} icon="🧾">
            Maintenance Requests
          </SidebarLink>
          <SidebarLink to={`/admin/buildings/${buildingName}/notices`} icon="📢">
            Notice Management
          </SidebarLink>
          <SidebarLink to={`/admin/buildings/${buildingName}/apartments`} icon="🏢">
            Apartments Management
          </SidebarLink>
          <SidebarLink to={`/admin/buildings/${buildingName}/residents`} icon="👤">
            Resident Management
          </SidebarLink>
          <SidebarLink to={`/admin/buildings/${buildingName}/staff`} icon="👤">
            Staff Management
          </SidebarLink>
        
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="p-8 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;