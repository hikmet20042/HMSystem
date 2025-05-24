import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ApartmentList = ({ apartments, onEdit, onAssignResident, onDelete }) => (
  <div className="bg-white shadow rounded-lg overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Apartment
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Floor
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Resident
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {apartments.map((apartment) => (
          <tr key={apartment.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {apartment.number}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {apartment.floor}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  apartment.status === 'vacant'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {apartment.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {apartment.resident ? apartment.resident.name : '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => onEdit(apartment)}
                  className="px-3 py-1 border border-primary rounded text-primary hover:text-primary/80 hover:bg-primary/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => onAssignResident(apartment)}
                  className="px-3 py-1 border border-primary rounded text-primary hover:text-primary/80 hover:bg-primary/5"
                >
                  {apartment.status === 'vacant' ? 'Assign' : 'Remove'} Resident
                </button>
                <button
                  onClick={() => onDelete(apartment)}
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

const ApartmentForm = ({ apartment, onSubmit, onCancel, error, setError }) => {
  const [formData, setFormData] = useState({
    number: apartment?.number || '',
    floor: apartment?.floor || '',
    status: apartment?.status || 'vacant',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message?.includes('already')) {
        setError('Apartment number already exists in this building');
      } else {
        setError('Failed to save apartment');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {apartment ? 'Edit' : 'Add'} Apartment
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="number">
              Apartment Number
            </label>
            <input
              type="text"
              id="number"
              className={`form-input ${error ? 'border-red-500' : ''}`}
              value={formData.number}
              onChange={(e) => {
                setFormData({ ...formData, number: e.target.value });
                setError('');
              }}
              required
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="floor">
              Floor
            </label>
            <input
              type="number"
              id="floor"
              className="form-input"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              required
              min="1"
            />
          </div>

          <div className="mb-6">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="form-input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
            </select>
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
              {apartment ? 'Update' : 'Add'} Apartment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResidentForm = ({ apartment, onSubmit, onCancel, setError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    floor: apartment.floor,
    apartmentNumber: apartment.number,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const residentData = {
        ...formData,
        floor: apartment.floor
      };
      const response = await onSubmit(residentData);
      alert(`Resident assigned successfully! Resident code: ${response.data.residentCode}`);
      onCancel();
    } catch (err) {
      if (err.response?.data?.message?.includes('duplicate')) {
        setError('This apartment number already exists');
      } else {
        setError('Failed to save apartment');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          Assign Resident to Apartment {apartment.number}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="name">
              Resident Name
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

          <div className="mb-6">
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

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Assign Resident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ApartmentManagement = () => {
  const [error, setError] = useState('');
  const buildingId = localStorage.getItem('buildingId');
  const [apartments, setApartments] = useState([]);
  
  const handleDelete = async (apartment) => {
    try {
      await axios.delete(`http://localhost:5000/api/apartments/${apartment._id}?buildingId=${buildingId}`);
      setApartments(apartments.filter(a => a._id !== apartment._id));
    } catch (err) {
      setError('Failed to delete apartment');
    }
  };
  const [filters, setFilters] = useState({
    floor: '',
    status: '',
    search: '',
  });
  const [showApartmentForm, setShowApartmentForm] = useState(false);
  const [showResidentForm, setShowResidentForm] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/apartments`, {
          params: { buildingId }
        });
        setApartments(response.data);
      } catch (err) {
        console.error('Failed to fetch apartments:', err);
      }
    };
    fetchApartments();
  }, [buildingId]);

  const filteredApartments = apartments.filter((apartment) => {
    if (filters.floor && apartment.floor !== parseInt(filters.floor)) return false;
    if (filters.status && apartment.status !== filters.status) return false;
    if (filters.resident) {
      return apartment.resident?.name === filters.resident;
    }
    return true;
  });

  const handleAddApartment = async (apartmentData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/apartments?buildingId=${buildingId}`, {
          ...apartmentData,
        });
      setApartments([...apartments, response.data]);
      setShowApartmentForm(false);
    } catch (err) {
      if (err.response && err.response.data.message === 'Apartment number already exists in this building') {
        setError('Apartment number already exists');
      } else {
        console.error('Failed to add apartment:', err);
      }
    }
  };

  const handleEditApartment = (apartment) => {
    setSelectedApartment(apartment);
    setShowApartmentForm(true);
  };

  const handleUpdateApartment = async (updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/apartments/${selectedApartment._id}?buildingId=${buildingId}`, {
          ...updatedData
        });
      setApartments(
        apartments.map((apt) =>
          apt._id === selectedApartment._id ? response.data : apt
        )
      );
      setShowApartmentForm(false);
      setSelectedApartment(null);
    } catch (err) {
      console.error('Failed to update apartment:', err);
    }
  };

  const handleAssignResident = async (apartment) => {
    if (apartment.status === 'vacant') {
      setSelectedApartment(apartment);
      setShowResidentForm(true);
    } else {
      try {
        try {
          await axios.delete(`http://localhost:5000/api/apartments/${apartment._id}/resident?buildingId=${buildingId}`);
          setApartments(apartments.map(apt => 
            apt._id === apartment._id 
              ? { ...apt, status: 'vacant', resident: null } 
              : apt
          ));
          alert('Resident removed successfully');
        } catch (err) {
          console.error('Failed to remove resident:', err);
          alert(err.response?.data?.message || 'Failed to remove resident');
        }
        setApartments(
          apartments.map((apt) =>
            apt._id === apartment._id
              ? { ...apt, status: 'vacant', resident: null }
              : apt
          )
        );
      } catch (err) {
        console.error('Failed to remove resident:', err);
      }
    }
  };

  const handleResidentAssignment = async (residentData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/apartments/${selectedApartment._id}/assign-resident?buildingId=${buildingId}`, residentData);
      setApartments(
        apartments.map((apt) =>
          apt._id === selectedApartment._id 
            ? { 
                ...apt, 
                resident: {
                  ...response.data.resident,
                  name: residentData.name
                }, 
                status: 'occupied' 
              } 
            : apt
        )
      );
      setShowResidentForm(false);
      setSelectedApartment(null);
    } catch (err) {
      console.error('Failed to assign resident:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Apartment Management
        </h1>
        <button
          onClick={() => setShowApartmentForm(true)}
          className="btn-primary"
        >
          Add New Apartment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label block mb-2" htmlFor="floor-filter">
              Filter by Floor
            </label>
            <select
              id="floor-filter"
              className="form-input w-full"
              value={filters.floor}
              onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
            >
              <option value="">All Floors</option>
              {Array.from(
                new Set(apartments.map((apt) => apt.floor))
              ).map((floor) => (
                <option key={floor} value={floor}>
                  Floor {floor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label block mb-2" htmlFor="status-filter">
              Filter by Status
            </label>
            <select
              id="status-filter"
              className="form-input w-full"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>

          <div>
            <label className="form-label block mb-2" htmlFor="resident-filter">
              Filter by Resident
            </label>
            <select
              id="resident-filter"
              className="form-input w-full"
              value={filters.resident}
              onChange={(e) => setFilters({ ...filters, resident: e.target.value })}
            >
              <option value="">All Residents</option>
              {Array.from(
                new Set(apartments.filter(apt => apt.resident).map(apt => apt.resident.name))
              ).map((resident) => (
                <option key={resident} value={resident}>
                  {resident}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ApartmentList
        apartments={filteredApartments}
        onEdit={handleEditApartment}
        onAssignResident={handleAssignResident}
        onDelete={handleDelete}
        
      />

      {showApartmentForm && (
        <ApartmentForm
          apartment={selectedApartment}
          onSubmit={selectedApartment ? handleUpdateApartment : handleAddApartment}
          onCancel={() => {
            setShowApartmentForm(false);
            setSelectedApartment(null);
          }}
          setError={setError}
          error={error}
        />
      )}

      {showResidentForm && (
        <ResidentForm
          apartment={selectedApartment}
          onSubmit={handleResidentAssignment}
          onCancel={() => {
            setShowResidentForm(false);
            setSelectedApartment(null);
          }}
          setError={setError}
        />
      )}
    </div>
  );
};

export default ApartmentManagement;