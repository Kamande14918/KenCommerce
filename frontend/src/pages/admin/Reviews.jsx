import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('kencommerce_token');
        const url = `/api/admin/reviews?page=${currentPage}&search=${searchQuery}`;
        console.log('[Reviews] Fetching reviews:', { url, token });
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(response.data.data);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('[Reviews] Failed to fetch reviews:', err, err?.response);
        setError(err.response?.data?.message || 'Failed to fetch reviews');
        setLoading(false);
      }
    };

    fetchReviews();
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
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Rating</th>
              <th className="p-4 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td className="p-4">{review.product.name}</td>
                <td className="p-4">{review.user.name}</td>
                <td className="p-4">{review.rating}</td>
                <td className="p-4">{review.comment}</td>
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
            placeholder="Search reviews..."
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

export default AdminReviews;
