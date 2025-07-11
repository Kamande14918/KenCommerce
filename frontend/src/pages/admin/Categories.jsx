import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('kencommerce_token');
        const url = `/api/admin/categories?page=${currentPage}&search=${searchQuery}`;
        console.log('[Categories] Fetching categories:', { url, token });
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data.data);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('[Categories] Failed to fetch categories:', err, err?.response);
        setError(err.response?.data?.message || 'Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page when searching
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="p-4">{category.name}</td>
                <td className="p-4">{category.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Search */}
      <div className="mt-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-64"
          />
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">
            Search
          </button>
        </form>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
