import { useState, useEffect } from 'react';
import axios from 'axios';

const RequestCard = ({ request, onViewRequest }) => (
  <div
    onClick={() => onViewRequest(request)}
    className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow min-w-full"
  >
    <div className="flex flex-col items-center justify-between mb-4 gap-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
        <p className="text-sm text-gray-500">
          Apt {request.apartmentNumber} - Floor {request.floor}
        </p>
      </div>
      <span
        className={`px-2 py-1 text-xs rounded-full ${request.status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : request.status === 'in_progress'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
          }`}
      >
        {request.status.replace('_', ' ')}
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-2">
      Submitted: {new Date(request.submissionDate).toLocaleDateString()}
    </p>
  </div>
);

const RequestModal = ({ request, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(request.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(request.id, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold">{request.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Apartment Info</h3>
            <p className="text-gray-900">Apt {request.apartmentNumber} - Floor {request.floor}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
            <p className="text-gray-900">{request.contactNumber}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
          </div>

          {request.images && request.images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {request.images.map((image, index) => (
                  <img
                    key={index}
                    src={`data:image/jpeg;base64,${image}`}
                alt={`Request image ${index + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="status">
              Update Status
            </label>
            <select
              id="status"
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    resolvedRequests: 0
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/staff/requests')
        ]);
        
        setRequests(requestsRes.data);
        
        // Calculate statistics
        const total = requestsRes.data.length;
        const pending = requestsRes.data.filter(r => r.status === 'pending').length;
        const resolved = requestsRes.data.filter(r => r.status === 'resolved').length;
        
        setStats({
          totalRequests: total,
          pendingRequests: pending,
          resolvedRequests: resolved
        });
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/staff/requests/${requestId}`, {
        status: newStatus
      });
      setRequests(requests.map(request =>
        request.id === requestId ? { ...request, status: newStatus } : request
      ));
    } catch (err) {
      setError('Failed to update request status');
    }
  };

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Resolved Requests</h3>
          <p className="text-3xl font-bold text-green-600">{stats.resolvedRequests}</p>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Assigned Maintenance Requests</h1>
      
      {requests.length === 0 ? (
        <div className="text-center text-gray-500 p-4 bg-white rounded-lg shadow-md">
          No maintenance requests assigned to you
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onViewRequest={setSelectedRequest}
            />
          ))}
        </div>
      )}

      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default Dashboard;