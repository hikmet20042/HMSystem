import { Link, Outlet, useLocation } from 'react-router-dom';

const StaffLayout = () => {
  return (
    <div className="flex h-full">
    {/* Left Sidebar */}
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Resident Portal</h2>
    </div>

    <nav className="space-y-1">
      <SidebarLink to="/staff/dashboard" icon="🏠">
        Dashboard
      </SidebarLink>
      <SidebarLink to="/staff/details" icon="🧾">
        Requests Detailed
      </SidebarLink>
      
    </nav>
  </div>
    
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <Outlet />
      </div>
    
    </div>
  );
};
const SidebarLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center text-left space-x-2 px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <span className="text-xl">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default StaffLayout;