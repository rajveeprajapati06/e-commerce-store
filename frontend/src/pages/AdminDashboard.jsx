import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchAdminStatsApi,
  fetchProducts,
  fetchAllOrdersAdmin,
  deleteProductApi,
  updateOrderToDeliveredApi,
} from '../services/api';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Plus,
  Edit,
  Trash2,
  Check,
  RefreshCw,
  Eye,
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState('products');

  // Core states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Loaders & Errors
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch core data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, productsData, ordersData] = await Promise.all([
        fetchAdminStatsApi(),
        fetchProducts(),
        fetchAllOrdersAdmin(),
      ]);

      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to fetch dashboard metrics. Check admin authorization token.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setActionLoading(true);
        await deleteProductApi(id);
        // Refresh products list
        const updatedProducts = await fetchProducts();
        setProducts(updatedProducts);
        
        // Refresh stats
        const updatedStats = await fetchAdminStatsApi();
        setStats(updatedStats);
      } catch (err) {
        alert('Failed to remove product.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      setActionLoading(true);
      await updateOrderToDeliveredApi(orderId);
      
      // Refresh orders
      const updatedOrders = await fetchAllOrdersAdmin();
      setOrders(updatedOrders);

      // Refresh stats
      const updatedStats = await fetchAdminStatsApi();
      setStats(updatedStats);
    } catch (err) {
      alert('Failed to update delivery status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div class="flex justify-center items-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 text-center max-w-md mx-auto space-y-4">
        <p class="font-bold">Unauthorized Access</p>
        <p class="text-xs text-slate-400">{error}</p>
        <button
          onClick={loadDashboardData}
          class="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div class="space-y-8 fade-in-up">
      {/* Title */}
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
          <p class="text-slate-400 text-sm mt-1">Monitor sales trends, manage inventory, and dispatch orders</p>
        </div>

        <Link
          to="/admin/add-product"
          class="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md text-sm transition-all"
        >
          <Plus class="h-4 w-4" /> Add New Product
        </Link>
      </div>

      {/* Metrics Row */}
      {stats && (
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Sales */}
          <div class="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Sales</span>
              <span class="text-2xl font-black text-slate-900">${stats.totalSales.toLocaleString()}</span>
            </div>
            <div class="p-3.5 bg-blue-50 text-primary rounded-2xl">
              <DollarSign class="h-6 w-6" />
            </div>
          </div>

          {/* Total Orders */}
          <div class="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Orders</span>
              <span class="text-2xl font-black text-slate-900">{stats.totalOrders}</span>
            </div>
            <div class="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
              <ShoppingCart class="h-6 w-6" />
            </div>
          </div>

          {/* Total Products */}
          <div class="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs text-slate-400 font-bold block uppercase tracking-wider">Catalogue Items</span>
              <span class="text-2xl font-black text-slate-900">{stats.totalProducts}</span>
            </div>
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Package class="h-6 w-6" />
            </div>
          </div>

          {/* Total Users */}
          <div class="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs text-slate-400 font-bold block uppercase tracking-wider">Customers</span>
              <span class="text-2xl font-black text-slate-900">{stats.totalUsers}</span>
            </div>
            <div class="p-3.5 bg-amber-50 text-accent rounded-2xl">
              <Users class="h-6 w-6" />
            </div>
          </div>
        </section>
      )}

      {/* Tabs Selector */}
      <div class="border-b border-slate-200">
        <nav class="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            class={`pb-4 px-1 border-b-2 font-bold text-sm focus:outline-none transition-all ${
              activeTab === 'products'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
          >
            Products Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            class={`pb-4 px-1 border-b-2 font-bold text-sm focus:outline-none transition-all ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
          >
            Manage Orders ({orders.length})
          </button>
        </nav>
      </div>

      {/* Action Loader Overlay */}
      {actionLoading && (
        <div class="bg-white/60 absolute inset-0 flex items-center justify-center z-10 rounded-2xl">
          <RefreshCw class="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {/* Tab Panels */}
      <section class="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        {activeTab === 'products' ? (
          /* Products List Table */
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-100 text-sm text-left">
              <thead class="bg-slate-50 text-slate-400 uppercase tracking-wider text-xxs font-bold">
                <tr>
                  <th class="px-6 py-4">Product</th>
                  <th class="px-6 py-4">Category</th>
                  <th class="px-6 py-4">Price</th>
                  <th class="px-6 py-4">Stock</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
                {products.map((product) => (
                  <tr key={product._id} class="hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail & Title */}
                    <td class="px-6 py-4 flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        class="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100"
                      />
                      <span class="text-slate-900 truncate max-w-[200px]" title={product.name}>
                        {product.name}
                      </span>
                    </td>
                    {/* Category */}
                    <td class="px-6 py-4 text-slate-500">{product.category}</td>
                    {/* Price */}
                    <td class="px-6 py-4">${product.price.toLocaleString()}</td>
                    {/* Stock */}
                    <td class="px-6 py-4">
                      {product.stock > 0 ? (
                        <span class="text-slate-800">{product.stock} units</span>
                      ) : (
                        <span class="text-red-500 font-bold">Out of Stock</span>
                      )}
                    </td>
                    {/* Action buttons */}
                    <td class="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                        class="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Details"
                      >
                        <Edit class="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Orders List Table */
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-100 text-sm text-left">
              <thead class="bg-slate-50 text-slate-400 uppercase tracking-wider text-xxs font-bold">
                <tr>
                  <th class="px-6 py-4">Order ID</th>
                  <th class="px-6 py-4">Customer</th>
                  <th class="px-6 py-4">Total</th>
                  <th class="px-6 py-4">Paid?</th>
                  <th class="px-6 py-4">Delivered?</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
                {orders.map((order) => (
                  <tr key={order._id} class="hover:bg-slate-50/50 transition-colors">
                    {/* ID */}
                    <td class="px-6 py-4">
                      <code class="text-slate-800 text-xs font-semibold">{order._id.substring(0, 8)}...</code>
                    </td>
                    {/* Customer */}
                    <td class="px-6 py-4 text-slate-900">{order.user?.name || 'Deleted User'}</td>
                    {/* Total Price */}
                    <td class="px-6 py-4">${order.totalPrice.toLocaleString()}</td>
                    {/* Paid */}
                    <td class="px-6 py-4">
                      {order.isPaid ? (
                        <span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full border border-emerald-100">
                          <Check class="h-3 w-3" /> Yes
                        </span>
                      ) : (
                        <span class="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs px-2.5 py-0.5 rounded-full border border-red-100">
                          No
                        </span>
                      )}
                    </td>
                    {/* Delivered */}
                    <td class="px-6 py-4">
                      {order.isDelivered ? (
                        <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full border border-blue-100">
                          <Check class="h-3 w-3" /> Yes
                        </span>
                      ) : (
                        <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-full border border-amber-100">
                          No
                        </span>
                      )}
                    </td>
                    {/* Dispatch Delivery button */}
                    <td class="px-6 py-4 text-right">
                      {order.isPaid && !order.isDelivered ? (
                        <button
                          onClick={() => handleMarkAsDelivered(order._id)}
                          class="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span class="text-xs text-slate-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
