import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AdminProductEdit = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', stock: '', images: [] });
  const [categories, setCategories] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('kencommerce_token');
        const { data } = await axios.get(`/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category?._id || '',
          stock: data.stock,
          images: []
        });
        setCurrentImages(data.images || []);
      } catch (err) {
        setError('Failed to fetch product');
      }
    };
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
    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
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
        } else {
          formData.append(key, value);
        }
      });
      await axios.put(`/api/admin/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="p-2 border rounded w-full" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required type="number" className="p-2 border rounded w-full" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="p-2 border rounded w-full" />
          <select name="category" value={form.category} onChange={handleChange} required className="p-2 border rounded w-full">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" required type="number" className="p-2 border rounded w-full" />
          <div>
            <label className="block mb-1">Current Images:</label>
            <div className="flex flex-wrap gap-2">
              {currentImages.map((img, idx) => (
                <img key={idx} src={img.url || img} alt="Product" className="w-20 h-20 object-cover border" />
              ))}
            </div>
          </div>
          <input name="images" type="file" multiple onChange={handleFileChange} className="p-2 border rounded w-full" />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded">
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">Product updated successfully!</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminProductEdit; 