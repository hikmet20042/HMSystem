import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResidentList = ({ residents, onEdit, onDelete }) => (
  <div className="bg-white shadow rounded-lg overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Phone
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Resident Code
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {residents.map((resident) => (
          <tr key={resident._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {resident.fullName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {resident.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {resident.phone}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {resident.residentCode}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => onEdit(resident)}
                  className="px-3 py-1 border border-primary rounded text-primary hover:text-primary/80 hover:bg-primary/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(resident)}
                  className="px-3 py-1 border border-red-600 rounded text-red-600 hover:text-red-800 hover:bg-red-600/5"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ResidentForm = ({ resident, onSubmit, onCancel, error, setError }) => {
  const [formData, setFormData] = useState({
    name: resident?.fullName || '',
    email: resident?.email || '',
    phoneNumber: resident?.phone || '',
    residentCode: resident?.residentCode || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message?.includes('already')) {
        setError('Resident code already exists');
      } else {
        setError('Failed to save resident');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {resident ? 'Edit' : 'Add'} Resident
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`form-input ${error ? 'border-red-500' : ''}`}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setError('');
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div className="mb-6">
            <label className="form-label" htmlFor="residentCode">
              Resident Code
            </label>
            <input
              type="text"
              id="residentCode"
              className="form-input"
              value={formData.residentCode}
              onChange={(e) => setFormData({ ...formData, residentCode: e.target.value })}
              required
              disabled
            />
          </div>

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {resident ? 'Update' : 'Add'} Resident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResidentManagement = () => {
  const [error, setError] = useState('');
  const buildingId = localStorage.getItem('buildingId');
  const [residents, setResidents] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    residentCode: ''
  });
  const [showResidentForm, setShowResidentForm] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/residents?buildingId=${buildingId}`);
        setResidents(response.data);
      } catch (err) {
        console.error('Failed to fetch residents:', err);
      }
    };
    fetchResidents();
  }, [buildingId]);

  const filteredResidents = residents.filter((resident) => {
    if (filters.name && !resident.fullName.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.email && !resident.email.toLowerCase().includes(filters.email.toLowerCase())) {
      return false;
    }
    if (filters.residentCode && !resident.residentCode.toLowerCase().includes(filters.residentCode.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleAddResident = async (residentData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/residents?buildingId=${buildingId}`, residentData);
      setResidents([...residents, response.data]);
      setShowResidentForm(false);
    } catch (err) {
      console.error('Failed to add resident:', err);
      setError(err.response?.data?.message || 'Failed to add resident');
    }
  };

  const handleEditResident = (resident) => {
    setSelectedResident(resident);
    setShowResidentForm(true);
  };

  const handleUpdateResident = async (updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/residents/${selectedResident._id}?buildingId=${buildingId}`,
        updatedData
      );
      setResidents(
        residents.map((res) =>
          res._id === selectedResident._id ? response.data : res
        )
      );
      setShowResidentForm(false);
      setSelectedResident(null);
    } catch (err) {
      console.error('Failed to update resident:', err);
    }
  };

  const handleDelete = async (resident) => {
    try {
      await axios.delete(`http://localhost:5000/api/residents/${resident._id}?buildingId=${buildingId}`);
      setResidents(residents.filter((res) => res._id !== resident._id));
    } catch (err) {
      setError('Failed to delete resident');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resident Management</h1>
        <button
          onClick={() => setShowResidentForm(true)}
          className="btn-primary"
        >
          Add New Resident
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="Filter by name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="form-input"
            placeholder="Filter by email..."
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="residentCode">
            Resident Code
          </label>
          <input
            type="text"
            id="residentCode"
            className="form-input"
            placeholder="Filter by resident code..."
            value={filters.residentCode}
            onChange={(e) => setFilters({ ...filters, residentCode: e.target.value })}
          />
        </div>
      </div>

      <ResidentList
        residents={filteredResidents}
        onEdit={handleEditResident}
        onDelete={handleDelete}
      />

      {showResidentForm && (
        <ResidentForm
          resident={selectedResident}
          onSubmit={selectedResident ? handleUpdateResident : handleAddResident}
          onCancel={() => {
            setShowResidentForm(false);
            setSelectedResident(null);
          }}
          setError={setError}
          error={error}
        />
      )}
    </div>
  );
};

export default ResidentManagement;