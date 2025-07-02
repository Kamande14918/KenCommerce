import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProductCreate = () => {
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', stock: '', images: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('kencommerce_token');
        const response = await axios.get('/api/admin/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data.data);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
    const files = Array.from(e.target.files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem('kencommerce_token');
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          for (let i = 0; i < value.length; i++) {
            formData.append('images', value[i]);
          }
        } else if (key === 'stock') {
          formData.append('inventory[stock]', value);
        } else {
          formData.append(key, value);
        }
      });
      await axios.post('/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
      setForm({ name: '', price: '', description: '', category: '', stock: '', images: [] });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="p-2 border rounded w-full" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required type="number" className="p-2 border rounded w-full" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="p-2 border rounded w-full" />
        <input
          type="text"
          placeholder="Search or type category"
          value={categorySearch}
          onChange={e => setCategorySearch(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="p-2 border rounded w-full"
        >
          <option value="">Select Category</option>
          {categories
            .filter(cat =>
              cat.name.toLowerCase().includes(categorySearch.toLowerCase())
            )
            .map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
        </select>
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" required type="number" className="p-2 border rounded w-full" />
        <input name="images" type="file" multiple onChange={handleFileChange} className="p-2 border rounded w-full" />
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 mb-2">
            {imagePreviews.map((src, idx) => (
              <img key={idx} src={src} alt="Preview" className="w-24 h-24 object-cover rounded border" />
            ))}
          </div>
        )}
        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded">
          {loading ? 'Creating...' : 'Create Product'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">Product created successfully!</p>}
      </form>
    </div>
  );
};

export default AdminProductCreate; 