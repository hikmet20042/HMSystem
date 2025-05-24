import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
    
    residentCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.surname) errors.surname = 'Surname is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.role === 'resident' && !formData.residentCode) {
      errors.residentCode = 'Resident code is required';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setLoading(true);

    try {
      const userData = { ...formData };
      delete userData.confirmPassword;
      
      if (formData.role === 'resident') {
        // Check if resident exists and update
        const response = await axios.put(`http://localhost:5000/api/residents/${formData.residentCode}`, userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.data) {
          navigate('/resident/dashboard');
        }
      } else {
        const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.data) {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center space-x-4 mb-6">
        <Link
          to="/login"
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-primary font-medium border-b-2 border-primary"
        >
          Register
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center space-x-6 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="resident"
              checked={formData.role === 'resident'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">Resident</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="buildingAdmin"
              checked={formData.role === 'buildingAdmin'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">Building Admin</span>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full rounded-md border ${validationErrors.name ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
              Surname
            </label>
            <input
              id="surname"
              name="surname"
              type="text"
              value={formData.surname}
              onChange={handleChange}
              className={`block w-full rounded-md border ${validationErrors.surname ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
            />
            {validationErrors.surname && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.surname}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`block w-full rounded-md border ${validationErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
          />
          {validationErrors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.phoneNumber}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`block w-full rounded-md border ${validationErrors.email ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full rounded-md border ${validationErrors.password ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full rounded-md border ${validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
            />
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        

        {formData.role === 'resident' && (
          <div className="space-y-1">
            <label htmlFor="residentCode" className="block text-sm font-medium text-gray-700">
              Resident Code
            </label>
            <input
              id="residentCode"
              name="residentCode"
              type="text"
              value={formData.residentCode}
              onChange={handleChange}
              className={`block w-full rounded-md border ${validationErrors.residentCode ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
            />
            {validationErrors.residentCode && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.residentCode}</p>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;