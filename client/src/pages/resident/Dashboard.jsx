import { useState, useEffect } from 'react';
import axios from 'axios';

const InfoCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center space-x-3 mb-2">
      <span className="text-xl">{icon}</span>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    </div>
    <p className="text-xl font-semibold text-gray-900">{value}</p>
  </div>
);

const RequestList = ({ requests }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-gray-900 font-medium mb-4">Recent Maintenance Requests</h3>
    {requests.length === 0 ? (
      <p className="text-gray-500">No requests to display</p>
    ) : (
      <div className="space-y-3">
        {requests.map((request) => (
          <div key={request.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{request.title}</p>
              <p className="text-xs text-gray-500">
                Submitted on {new Date(request.date).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                request.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : request.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {request.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const NoticeList = ({ notices }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-gray-900 font-medium mb-4">Recent Notices</h3>
    {notices.length === 0 ? (
      <p className="text-gray-500">No notices to display</p>
    ) : (
      <div className="space-y-3">
        {notices.map((notice) => (
          <div key={notice.id} className="border-b border-gray-200 pb-3 last:border-0">
            <p className="text-sm font-medium text-gray-900">{notice.title}</p>
            <p className="text-xs text-gray-500">
              From: {notice.sender} - {new Date(notice.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [residentInfo, setResidentInfo] = useState(null);
  const [requests, setRequests] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be separate API endpoints
        const [infoResponse, requestsResponse, noticesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/resident/info'),
          axios.get('http://localhost:5000/api/resident/maintenance-requests'),
          axios.get('http://localhost:5000/api/resident/notices')
        ]);

        setResidentInfo(infoResponse.data);
        setRequests(requestsResponse.data);
        setNotices(noticesResponse.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {residentInfo?.name}</h1>

      {/* Resident Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          icon="🏢"
          title="Apartment"
          value={`${residentInfo?.apartmentNumber}`}
        />
        <InfoCard
          icon="📍"
          title="Floor"
          value={residentInfo?.floor}
        />
        <InfoCard
          icon="💰"
          title="Next Payment Due"
          value={residentInfo?.nextPaymentDue || 'No payment due'}
        />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequestList requests={requests} />
        <NoticeList notices={notices} />
      </div>
    </div>
  );
};

export default Dashboard;