import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuildingCard = ({ building, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
  >
    <h3 className="text-xl font-semibold text-primary mb-2">{building.name}</h3>
    <p className="text-gray-600 mb-1">{building.address}</p>
    <p className="text-gray-500">{building.totalApartments} Apartments</p>
  </div>
);

const AddBuildingCard = ({ onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center"
  >
    <div className="text-center">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      <p className="text-primary font-medium">Add New Building</p>
    </div>
  </div>
);

const NewBuildingForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalFloors: '',
    totalApartments: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Building</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="name">
              Building Name
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
            <label className="form-label" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="totalFloors">
              Total Floors
            </label>
            <input
              type="number"
              id="totalFloors"
              className="form-input"
              value={formData.totalFloors}
              onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
              required
              min="1"
            />
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="totalApartments">
              Total Apartments
            </label>
            <input
              type="number"
              id="totalApartments"
              className="form-input"
              value={formData.totalApartments}
              onChange={(e) => setFormData({ ...formData, totalApartments: e.target.value })}
              required
              min="1"
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
              Create Building
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showNewBuildingForm, setShowNewBuildingForm] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/buildings', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
        setBuildings(response.data || []);
        if (!response.data || response.data.length === 0) {
          setBuildings([]);
        }
      } catch (err) {
        setError('Failed to fetch buildings');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  const handleBuildingClick = (buildingName,buildingId) => {
    navigate(`/admin/buildings/${buildingName}/summary`);
    localStorage.setItem('buildingId', buildingId);
  };

  const handleAddBuilding = async (buildingData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/buildings', buildingData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
      setBuildings([...buildings, response.data]);
      setShowNewBuildingForm(false);
    } catch (err) {
      setError('Failed to create building');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Buildings</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-gray-500 p-4 bg-white rounded-lg shadow-md mb-12">
          No buildings found.
        </div>
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && buildings.map((building) => (
          <BuildingCard
            key={building._id}
            building={building}
            onClick={() => handleBuildingClick(building.name.replaceAll(" ","").toLowerCase(),building._id)}
          />
        ))}
        <AddBuildingCard onClick={() => setShowNewBuildingForm(true)} />
      </div>

      {showNewBuildingForm && (
        <NewBuildingForm
          onSubmit={handleAddBuilding}
          onCancel={() => setShowNewBuildingForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;