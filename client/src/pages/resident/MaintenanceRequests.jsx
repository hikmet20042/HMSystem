import { useState, useEffect } from 'react';
import axios from 'axios';

const RequestList = ({ requests, onViewRequest }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {requests.map((request) => (
          <tr key={request.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {request.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(request.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
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
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <button
                onClick={() => onViewRequest(request)}
                className="text-primary hover:text-primary/80"
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RequestForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: []
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) {
      alert('You can only upload up to 2 images');
      return;
    }
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Submit New Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-input"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="mb-6">
            <label className="form-label" htmlFor="images">
              Images (Optional, max 2)
            </label>
            <input
              type="file"
              id="images"
              className="form-input"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleImageChange}
              max="2"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RequestDetails = ({ request, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Request Details</h2>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">Title</h3>
        <p className="text-gray-900">{request.title}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">Description</h3>
        <p className="text-gray-900">{request.description}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">Status</h3>
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

      {request.images && request.images.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
          <div className="grid grid-cols-2 gap-2">
            {request.images.map((image, index) => (
              
                <img
                  src={image.data && image.data.startsWith('data:image') ? image.data : (typeof image === 'string' && image.startsWith('data:image') ? image : '')}
                  alt={`Request image ${index + 1}`}
                  className="rounded-lg w-full h-32 object-cover cursor-pointer hover:opacity-80"
                />
             
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resident/maintenance-requests');
        setRequests(response.data);
      } catch (err) {
        setError('Failed to fetch maintenance requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSubmitRequest = async (formData) => {
    try {
      // Use FormData for file uploads
      let dataToSend = formData instanceof FormData ? formData : new FormData();
      if (!(formData instanceof FormData)) {
        dataToSend.append('title', formData.title);
        dataToSend.append('description', formData.description);
        if (formData.images) {
          formData.images.forEach((img) => dataToSend.append('images', img));
        }
      }
      const response = await axios.post(
        'http://localhost:5000/api/resident/maintenance-requests',
        dataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setRequests([response.data, ...requests]);
      setShowNewRequestForm(false);
    } catch (err) {
      setError('Failed to submit maintenance request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
        <button
          onClick={() => setShowNewRequestForm(true)}
          className="btn-primary"
        >
          New Request
        </button>
      </div>

      {error ? (
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <RequestList
          requests={requests}
          onViewRequest={(request) => setSelectedRequest(request)}
        />
      )}

      {showNewRequestForm && (
        <RequestForm
          onSubmit={handleSubmitRequest}
          onCancel={() => setShowNewRequestForm(false)}
        />
      )}

      {selectedRequest && (
        <RequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default MaintenanceRequests;