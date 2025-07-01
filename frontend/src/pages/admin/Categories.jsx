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
        const response = await axios.get(
          `/api/admin/categories?page=${currentPage}&search=${searchQuery}`
        );
        setCategories(response.data.data);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>

      {/* Search */}
      <div className="mb-4">
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

      {/* Categories Table */}
      <table className="w-full bg-white shadow rounded">
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
