import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('kencommerce_token');
        const url = '/api/admin/dashboard';
        console.log('[Dashboard] Fetching analytics:', { url, token });
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!analytics || !analytics.overview) return <p>No analytics data available.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold">Total Users</h2>
          <p className="text-2xl">{analytics.overview.totalUsers}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold">Total Products</h2>
          <p className="text-2xl">{analytics.overview.totalProducts}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold">Total Orders</h2>
          <p className="text-2xl">{analytics.overview.totalOrders}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold">Total Revenue</h2>
          <p className="text-2xl">${analytics.overview.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
