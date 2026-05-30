import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../services/api';
import { Calendar, CreditCard, Truck, ExternalLink, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch your orders history.');
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  if (loading) {
    return (
      <div class="flex justify-center items-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center gap-2 max-w-md mx-auto text-center">
        <AlertCircle class="h-8 w-8 text-red-500" />
        <h3 class="font-bold">Error Loading Orders</h3>
        <p class="text-xs text-slate-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div class="max-w-md mx-auto text-center py-16 space-y-6 bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
        <div class="p-5 bg-slate-50 rounded-full w-fit mx-auto text-slate-400">
          <ShoppingBag class="h-12 w-12" />
        </div>
        <h2 class="text-2xl font-extrabold text-slate-800">No Orders Found</h2>
        <p class="text-slate-400 text-sm max-w-xs mx-auto">
          You haven't placed any orders yet. Discover our premium selections and add items to your cart!
        </p>
        <Link
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-dark transition-all text-sm"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div class="space-y-8 fade-in-up">
      {/* Title */}
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Order History</h1>
        <p class="text-slate-400 text-sm mt-1">Review tracking status and logs of your previous purchases</p>
      </div>

      {/* Grid List of Orders */}
      <div class="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            class="bg-white rounded-2xl shadow-premium border border-slate-100/80 overflow-hidden"
          >
            {/* Header: ID & Price */}
            <div class="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span class="text-xs text-slate-400 font-bold block uppercase tracking-wider">Order ID</span>
                <code class="text-slate-800 text-sm font-semibold">{order._id}</code>
              </div>

              <div class="flex items-center gap-4">
                <div>
                  <span class="text-xs text-slate-400 font-bold block sm:text-right uppercase tracking-wider">Total price</span>
                  <span class="text-primary font-extrabold text-base">${order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product thumbnails */}
              <div class="space-y-3">
                <span class="text-xs text-slate-400 font-bold block uppercase tracking-wider">Purchased Items</span>
                <div class="flex flex-wrap gap-2.5">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      class="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                      title={`${item.name} x${item.qty}`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        class="w-full h-full object-cover"
                      />
                      <span class="absolute -bottom-1 -right-1 bg-slate-900 text-white text-xxs font-extrabold rounded-full px-1 py-0.5">
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Date */}
              <div class="space-y-1">
                <span class="text-xs text-slate-400 font-bold block uppercase tracking-wider">Placement Date</span>
                <span class="text-slate-800 text-sm font-semibold flex items-center gap-2 mt-1">
                  <Calendar class="h-4 w-4 text-slate-400" />
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Status Pill Badges */}
              <div class="space-y-3">
                <span class="text-xs text-slate-400 font-bold block uppercase tracking-wider">Fulfillment Status</span>
                <div class="flex flex-wrap gap-2.5">
                  {/* Paid Badge */}
                  {order.isPaid ? (
                    <span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                      <CreditCard class="h-3.5 w-3.5" />
                      Paid
                    </span>
                  ) : (
                    <span class="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-100 shadow-sm">
                      <CreditCard class="h-3.5 w-3.5" />
                      Unpaid
                    </span>
                  )}

                  {/* Delivery Badge */}
                  {order.isDelivered ? (
                    <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                      <Truck class="h-3.5 w-3.5" />
                      Delivered
                    </span>
                  ) : (
                    <span class="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                      <Truck class="h-3.5 w-3.5" />
                      Processing
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
