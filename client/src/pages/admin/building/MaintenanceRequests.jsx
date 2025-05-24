import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RequestTable = ({ requests, onViewRequest }) => (
  <div className="bg-white shadow rounded-lg overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Apartment
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Resident
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              {request.apartmentNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {request.residentName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(request.submissionDate).toLocaleDateString()}
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
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

const RequestModal = ({ request, onClose, onUpdateStatus, staffMembers }) => {
  const [status, setStatus] = useState(request.status);
  const [assignedStaff, setAssignedStaff] = useState(request.assignedStaffId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(request.id, { status, assignedStaffId: assignedStaff });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{request.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Apartment</p>
            <p className="font-medium">{request.apartmentNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Resident</p>
            <p className="font-medium">{request.residentName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact Number</p>
            <p className="font-medium">{request.contactNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Submission Date</p>
            <p className="font-medium">
              {new Date(request.submissionDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-gray-700">{request.description}</p>
        </div>

        {request.images && request.images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Attached Images</p>
            <div className="grid grid-cols-2 gap-2">
              {request.images.map((image, index) => (
                <img
                src={`data:image/jpeg;base64,${image}`}
                alt={`Request image ${index + 1}`}
                  className="rounded-lg w-full h-48 object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="staff">
              Assign Staff Member
            </label>
            <select
              id="staff"
              className="form-input"
              value={assignedStaff}
              onChange={(e) => setAssignedStaff(e.target.value)}
            >
              <option value="">Select Staff Member</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} {staff.surname}
                </option>
              ))}
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
              Update Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MaintenanceRequests = () => {
  const  buildingId  = localStorage.getItem('buildingId');
  const [requests, setRequests] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    apartment: '',
    resident: '',
    date: '',
    title: ''
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/requests?buildingId=${buildingId}`);
        setRequests(
          response.data.map(request => ({
            id: request._id || request.id,
            title: request.title,
            apartmentNumber: request.apartmentNumber,
            residentName: request.residentName,
            contactNumber: request.contactNumber,
            submissionDate: request.createdAt || request.submissionDate,
            status: request.status,
            description: request.description,
            images: request.images?.map(img => img.data ? img.data : `data:${img.contentType};base64,${img.data}`) || [],
            assignedStaffId: request.assignedStaffId || '',
          }))
        );
      } catch (err) {
        setRequests([]);
      }
    };
    fetchRequests();
  }, [buildingId]);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/staff?buildingId=${buildingId}`);
        setStaffMembers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStaffMembers();
  }, []);

  const handleUpdateStatus = async (requestId, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${requestId}/status`, updates);
      setRequests(requests.map((request) =>
        request.id === requestId ? { ...request, ...updates } : request
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
        <button
          className="btn-primary"
        >
          Add New Request
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.title}
              onChange={(e) => setFilters({...filters, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apartment</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.apartment}
              onChange={(e) => setFilters({...filters, apartment: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resident</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.resident}
              onChange={(e) => setFilters({...filters, resident: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
            />
          </div>

        </div>
      
      
      <RequestTable
          requests={requests.filter(request => {
            return (
              (filters.status === '' || request.status === filters.status) &&
              (filters.apartment === '' || request.apartmentNumber.includes(filters.apartment)) &&
              (filters.resident === '' || request.residentName.includes(filters.resident)) &&
              (filters.date === '' || new Date(request.submissionDate).toLocaleDateString() === new Date(filters.date).toLocaleDateString()) &&
              (filters.title === '' || request.title.toLowerCase().includes(filters.title.toLowerCase())) 
            );
          })}
          onViewRequest={setSelectedRequest}
        />
      
      {selectedRequest &&
        <RequestModal
          request={selectedRequest}
          staffMembers={staffMembers}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      }
      
    </div>
  );
};

export default MaintenanceRequests;