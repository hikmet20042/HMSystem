import { useState, useEffect } from 'react';
import axios from 'axios';

const StaffList = ({ staff, onEdit, onDelete, filters }) => (
  <div className="bg-white shadow rounded-lg overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Surname
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Phone
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {staff.filter(member => {
          if (filters.name && !member.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
          }
          if (filters.surname && !member.surname.toLowerCase().includes(filters.surname.toLowerCase())) {
            return false;
          }
          if (filters.email && !member.email.toLowerCase().includes(filters.email.toLowerCase())) {
            return false;
          }
          return true;
        })
    .map((member) => (
          <tr key={member._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {member.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {member.surname}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {member.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {member.phone}
            </td>
           
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => onEdit(member)}
                  className="px-3 py-1 border border-primary rounded text-primary hover:text-primary/80 hover:bg-primary/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(member)}
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

const StaffForm = ({ staff, onSubmit, onCancel, error, setError }) => {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    surname: staff?.surname || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message?.includes('already')) {
        setError('Staff member already exists');
      } else {
        setError('Failed to save staff');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {staff ? 'Edit' : 'Add'} Staff
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
            <label className="form-label" htmlFor="surname">
              Surname
            </label>
            <input
              type="text"
              id="surname"
              className={`form-input ${error ? 'border-red-500' : ''}`}
              value={formData.surname}
              onChange={(e) => {
                setFormData({ ...formData, surname: e.target.value });
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
            <label className="form-label" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
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
              {staff ? 'Update' : 'Add'} Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StaffManagement = () => {
  const [error, setError] = useState('');
  const [staff, setStaff] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    surname: '',
    email: ''
  });
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/staff');
        setStaff(response.data);
      } catch (err) {
        console.error('Failed to fetch staff:', err);
      }
    };
    fetchStaff();
  }, []);

  const handleAddStaff = async (staffData) => {
    const buildingId = localStorage.getItem('buildingId');
    try {
      const { name, email, phone, surname } = staffData;
      const response = await axios.post(`http://localhost:5000/api/staff?buildingId=${buildingId}`, {
        name,
        surname,
        email,
        password: 'Staff123!',
        phone,
      });
      setStaff([...staff, response.data]);
      setShowStaffForm(false);
    } catch (err) {
      console.error('Failed to add staff:', err);
      setError(err.response?.data?.message || 'Failed to add staff');
    }
  };

  const handleUpdateStaff = async (updatedData) => {
    try {
      const { name, email, phone, surname } = updatedData;
      const response = await axios.put(
        `http://localhost:5000/api/staff/${selectedStaff._id}`,
        {
          name,
          surname,
          email,
          phone
        }
      );
      setStaff(
        staff.map((member) =>
          member._id === selectedStaff._id ? response.data : member
        )
      );
      setShowStaffForm(false);
      setSelectedStaff(null);
    } catch (err) {
      console.error('Failed to update staff:', err);
      setError(err.response?.data?.message || 'Failed to update staff');
    }
  };

  const handleDelete = async (staff) => {
    try {
      await axios.delete(`http://localhost:5000/api/staff/${staff._id}`);
      setStaff(staff.filter((member) => member._id !== staff._id));
    } catch (err) {
      setError('Failed to delete staff');
    }
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setShowStaffForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={() => setShowStaffForm(true)}
          className="btn-primary"
        >
          Add New Staff
        </button>
      </div>

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
          <label className="form-label" htmlFor="surname">
            Surname
          </label>
          <input
            type="text"
            id="surname"
            className="form-input"
            placeholder="Filter by surname..."
            value={filters.surname}
            onChange={(e) => setFilters({ ...filters, surname: e.target.value })}
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
      </div>

      <StaffList
        staff={staff}
        onEdit={handleEditStaff}
        onDelete={handleDelete}
        filters={filters}
      />

      {showStaffForm && (
        <StaffForm
          staff={selectedStaff}
          onSubmit={selectedStaff ? handleUpdateStaff : handleAddStaff}
          onCancel={() => {
            setShowStaffForm(false);
            setSelectedStaff(null);
          }}
          setError={setError}
          error={error}
        />
      )}
    </div>
  );
};

export default StaffManagement;