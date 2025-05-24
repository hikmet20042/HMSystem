import { useState, useEffect } from 'react';
import axios from 'axios';

const NoticeList = ({ notices, setSelectedNotice, readNotices, setReadNotices, updateReadNotices }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
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
              <button 
                className="text-primary hover:text-primary/80" 
                onClick={() => setSelectedNotice(notice)}
              >
                View
              </button>
              <button
                className="ml-2 text-sm px-2 py-1 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  const isRead = readNotices.includes(notice.id);
                  if (isRead) {
                    setReadNotices(readNotices.filter(id => id !== notice.id));
                    updateReadNotices(notice._id);
                  } else {
                    setReadNotices([...readNotices, notice.id]);
                    updateReadNotices(notice._id);
                  }
                }}
                style={{ backgroundColor: readNotices.includes(notice.id) ? '#f3f4f6' : '#3b82f6', color: readNotices.includes(notice.id) ? '#374151' : '#ffffff' }}
              >
                {readNotices.includes(notice.id) ? 'Mark Unread' : 'Mark Read'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const NoticeDetailsModal = ({ notice, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">{notice.title}</h2>
      <p className="text-gray-600 whitespace-pre-wrap mb-4">{notice.description}</p>
      <div className="text-sm text-gray-500 space-y-2">
        <p>From: {notice.createdBy.name+" "+notice.createdBy.surname}</p>
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

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [readNotices, setReadNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const updateReadNotices = async (noticeId) => {
    try {
      await axios.patch(`http://localhost:5000/api/resident/notices/${noticeId}/read`,{},{
        params: {
          id: noticeId
        }
      });
    } catch (err) {
      console.error('Failed to update read notices:', err);
    }
  };

  useEffect(() => {
    const buildingId = localStorage.getItem('buildingId');
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notices?buildingId=${buildingId}`);
        setNotices(response.data);
      } catch (err) {
        setError('Failed to fetch notices');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notices</h1>
      {notices.length === 0 ? (
        <div className="text-center text-gray-500 p-4">No notices to display</div>
      ) : (
        <>
          <NoticeList notices={notices} setSelectedNotice={setSelectedNotice} readNotices={readNotices} setReadNotices={setReadNotices} updateReadNotices={updateReadNotices} />
          {selectedNotice && (
            <NoticeDetailsModal
              notice={selectedNotice}
              onClose={() => setSelectedNotice(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Notices;