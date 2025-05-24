import { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ title, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className={`text-2xl font-semibold ${color}`}>{value}</p>
  </div>
);

const RequestList = ({ requests, title }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-gray-900 font-medium mb-4">{title}</h3>
    {requests.length === 0 ? (
      <p className="text-gray-500">No requests to display</p>
    ) : (
      <div className="space-y-3">
        {requests.map((request) => (
          <div key={request.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{request.title}</p>
              <p className="text-sm text-gray-500">
                Apartment {request.resident.apartmentNumber} - {request.resident.fullName}
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
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-gray-900 font-medium mb-4">Recent Notices</h3>
    {notices.length === 0 ? (
      <p className="text-gray-500">No notices to display</p>
    ) : (
      <div className="space-y-3">
        {notices.map((notice) => (
          <div key={notice.id} className="border-b border-gray-200 pb-3 last:border-0">
            <p className="text-sm font-medium text-gray-900">{notice.title}</p>
            <p className="text-xs text-gray-400">{new Date(notice.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const HomeSummary = () => {
  const  buildingId  = localStorage.getItem('buildingId');
  const [stats, setStats] = useState({
    totalResidents: 0,
    vacantApartments: 0,
    totalApartments: 0,
    occupiedApartments: 0,
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    noticesCount: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats, requests and notices using the middleware
        const [statsRes, requestsRes, noticesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/stats`,{
            params: {
              buildingId: buildingId,
            },
          }),
          axios.get(`http://localhost:5000/api/requests/recent`,{
            params: {
              buildingId: buildingId,
            },
          }),
          axios.get(`http://localhost:5000/api/notices/recent`,{
            params: {
              buildingId: buildingId,
            },
          })
        ]);
        
        setStats(statsRes.data);
        setRecentRequests(requestsRes.data);
        setRecentNotices(noticesRes.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [buildingId]);

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
      <h1 className="text-2xl font-bold text-gray-900">Building Summary</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Residents"
          value={stats.totalResidents}
          color="text-gray-900"
        />
        <StatCard
          title="Vacant Apartments"
          value={stats.vacantApartments}
          color="text-yellow-600"
        />
        <StatCard
          title="Occupied Apartments"
          value={stats.occupiedApartments}
          color="text-blue-600"
        />
        <StatCard
          title="Total Apartments"
          value={stats.totalApartments}
          color="text-green-600"
        />
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          color="text-gray-900"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          color="text-yellow-600"
        />
        <StatCard
          title="In Progress Requests"
          value={stats.inProgressRequests}
          color="text-blue-600"
        />
        <StatCard
          title="Completed Requests"
          value={stats.completedRequests}
          color="text-green-600"
        />
        <StatCard
          title="Notices Count"
          value={stats.noticesCount}
          color="text-purple-600"
        />
      </div>

      {/* Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequestList
          requests={recentRequests}
          title="Recent Maintenance Requests"
        />
        <NoticeList notices={recentNotices} />
      </div>
    </div>
  );
};

export default HomeSummary;