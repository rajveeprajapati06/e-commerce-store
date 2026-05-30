import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, editProductApi } from '../services/api';
import { ArrowLeft, Save, Edit, AlertCircle } from 'lucide-react';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  // States
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Load existing details
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        
        setName(data.name);
        setPrice(data.price);
        setCategory(data.category);
        setStock(data.stock);
        setImage(data.image);
        setDescription(data.description);
      } catch (err) {
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    getProductDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !stock || !image || !description) {
      setError('Please fill in all product details.');
      return;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      setError('Price and Stock cannot be negative numbers.');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const payload = {
        name,
        price: Number(price),
        category,
        stock: Number(stock),
        image,
        description,
      };

      await editProductApi(id, payload);

      // Navigate back
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to save changes. Check authorization.');
    } finally {
      setUpdating(false);
    }
  };

  const categories = ['Electronics', 'Apparel', 'Accessories', 'Home & Kitchen'];

  if (loading) {
    return (
      <div class="flex justify-center items-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div class="max-w-2xl mx-auto space-y-8 fade-in-up">
      {/* Back Button */}
      <Link
        to="/admin/dashboard"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
      >
        <ArrowLeft class="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Edit class="h-8 w-8 text-primary" /> Modify Catalogue Product
        </h1>
        <p class="text-slate-400 text-sm mt-1">Edit specifications, stock thresholds, or pictures for this catalog item</p>
      </div>

      {error && (
        <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-2 font-semibold text-sm">
          <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Product Form Card */}
      <div class="bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-slate-100/80">
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div class="md:col-span-2 space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Apple Watch Ultra 2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm font-semibold"
              />
            </div>

            {/* Price */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Price (USD $)</label>
              <input
                type="number"
                required
                placeholder="e.g. 799"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm font-semibold"
              />
            </div>

            {/* Stock */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory Stock</label>
              <input
                type="number"
                required
                placeholder="e.g. 15"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm font-semibold"
              />
            </div>

            {/* Category */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Image Link URL</label>
              <input
                type="text"
                required
                placeholder="https://unsplash.com/photos/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
              />
            </div>

            {/* Description */}
            <div class="md:col-span-2 space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Description Details</label>
              <textarea
                rows="4"
                required
                placeholder="Describe product characteristics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm leading-relaxed"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            class="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save class="h-4 w-4" />
            {updating ? 'Saving Details...' : 'Save Product Updates'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;
