import { useLocation, Link, Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const ResidentLayout = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resident/notices/unread-count');
        setUnreadCount(response.data.count);
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };

    fetchUnreadCount();
  }, []);
  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Resident Portal</h2>
        </div>

        <nav className="space-y-1">
          <SidebarLink to="/resident/dashboard" icon="🏠">
            Dashboard
          </SidebarLink>
          <SidebarLink to="/resident/maintenance" icon="🧾">
            Maintenance Requests
          </SidebarLink>
          <SidebarLink to="/resident/notices" icon="📢">
            Notices
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </SidebarLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ResidentLayout;