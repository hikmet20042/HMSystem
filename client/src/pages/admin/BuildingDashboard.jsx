import { useState } from 'react';
import { useParams, Link, Outlet, useLocation } from 'react-router-dom';


const BuildingDashboard = () => {
  
  const [building, setBuilding] = useState(null); // This will be populated from API

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{building?.name || 'Building Dashboard'}</h2>
          <p className="text-sm text-gray-500">{building?.address}</p>
        </div>

        
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default BuildingDashboard;