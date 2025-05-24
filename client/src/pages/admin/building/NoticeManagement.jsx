import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NoticeList = ({ notices, setSelectedNotice }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {notices.map((notice) => (
          <tr key={notice.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {notice.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(notice.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button className="text-primary hover:text-primary/80" onClick={() => setSelectedNotice(notice)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const NewNoticeForm = ({ residents, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    residentId: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Send New Notice</h2>
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


          

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Send Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NoticeDetailsModal = ({ notice, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">{notice.title}</h2>
      <p className="text-gray-600 whitespace-pre-wrap mb-4">{notice.description}</p>
      <div className="text-sm text-gray-500 space-y-2">
        <p>Date: {new Date(notice.createdAt).toLocaleDateString()}</p>
      </div>
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

const NoticeManagement = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const buildingId = localStorage.getItem('buildingId'); 
  const [notices, setNotices] = useState([]);
  const [residents, setResidents] = useState([]);
  const [showNewNoticeForm, setShowNewNoticeForm] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticesRes, residentsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/notices?buildingId=${buildingId}`),
          axios.get(`http://localhost:5000/api/residents?buildingId=${buildingId}`)
        ]);
        setNotices(noticesRes.data);
        setResidents(residentsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, [buildingId]);

  const handleSendNotice = async (noticeData) => {
    const buildingId = localStorage.getItem('buildingId'); 
    try {
      const response = await axios.post(
        `http://localhost:5000/api/notices?buildingId=${buildingId}`,
        noticeData
      );
      setNotices([response.data, ...notices]);
      setShowNewNoticeForm(false);
    } catch (err) {
      console.error('Failed to send notice:', err);
    }
  };

  return (
      <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
        <button
          onClick={() => setShowNewNoticeForm(true)}
          className="btn-primary"
        >
          Send New Notice
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
            />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
        <NoticeList notices={notices.filter(notice => {
          return (
            (filters.title === '' || notice.title.toLowerCase().includes(filters.title.toLowerCase())) &&
            (filters.date === '' || new Date(notice.createdAt).toLocaleDateString() === new Date(filters.date).toLocaleDateString())
          );
        })} setSelectedNotice={setSelectedNotice} />
      </div>
      {selectedNotice && (
        <NoticeDetailsModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
      {showNewNoticeForm && (
        <NewNoticeForm
          residents={residents}
          onSubmit={handleSendNotice}
          onCancel={() => setShowNewNoticeForm(false)}
        />
      )}
      
    </div>
  );
};

export default NoticeManagement;