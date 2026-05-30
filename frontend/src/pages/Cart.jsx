import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQty,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div class="max-w-md mx-auto text-center py-16 space-y-6 fade-in-up bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
        <div class="p-5 bg-slate-50 rounded-full w-fit mx-auto text-slate-400">
          <ShoppingCart class="h-12 w-12" />
        </div>
        <h2 class="text-2xl font-extrabold text-slate-800">Your Shopping Cart is Empty</h2>
        <p class="text-slate-400 text-sm max-w-xs mx-auto">
          Explore our state-of-the-art catalog and discover our premium electronic items and elite wear!
        </p>
        <Link
          to="/products"
          class="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-dark transition-all text-sm"
        >
          Explore Shop Collections <ArrowRight class="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div class="space-y-8 fade-in-up">
      {/* Title */}
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Bag</h1>
        <p class="text-slate-400 text-sm mt-1">Review and manage your selected premium items</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items List */}
        <div class="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              class="bg-white rounded-2xl p-4 md:p-6 shadow-premium border border-slate-100/80 flex flex-col sm:flex-row items-center gap-6"
            >
              {/* Product Thumbnail */}
              <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  class="w-full h-full object-cover object-center"
                />
              </div>

              {/* Title & Specs */}
              <div class="flex-grow text-center sm:text-left space-y-1">
                <Link
                  to={`/products/${item.product}`}
                  class="font-bold text-slate-800 hover:text-primary transition-colors text-base line-clamp-1"
                >
                  {item.name}
                </Link>
                <span class="text-xs text-slate-400 font-semibold block uppercase">
                  Price: ${item.price.toLocaleString()}
                </span>
              </div>

              {/* Quantity Select & Actions */}
              <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                {/* Quantity input */}
                <div>
                  <select
                    value={item.qty}
                    onChange={(e) => updateQty(item.product, Number(e.target.value))}
                    class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-sm text-slate-700 focus:outline-none focus:border-primary font-semibold"
                  >
                    {[...Array(item.stock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subtotal */}
                <div class="text-right">
                  <span class="text-base font-extrabold text-slate-900 block">
                    ${(item.price * item.qty).toLocaleString()}
                  </span>
                </div>

                {/* Trash Button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
                  title="Remove from Cart"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Checkout Summary Box */}
        <aside class="space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 space-y-6">
            <h2 class="font-bold text-slate-800 text-lg pb-4 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Calculations Breakdown */}
            <div class="space-y-3.5 text-sm font-medium text-slate-500">
              <div class="flex justify-between">
                <span>Items Cost</span>
                <span class="text-slate-800">${itemsPrice.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping Fees</span>
                <span class="text-slate-800">
                  {shippingPrice === 0 ? (
                    <span class="text-emerald-600 font-semibold uppercase">Free</span>
                  ) : (
                    `$${shippingPrice}`
                  )}
                </span>
              </div>
              <div class="flex justify-between">
                <span>GST Tax (12%)</span>
                <span class="text-slate-800">${taxPrice.toLocaleString()}</span>
              </div>
              <hr class="border-slate-100" />
              <div class="flex justify-between text-base font-bold">
                <span class="text-slate-800">Grand Total</span>
                <span class="text-primary text-lg">${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout action button */}
            <button
              onClick={handleCheckout}
              class="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 focus:outline-none"
            >
              Proceed to Checkout <ArrowRight class="h-4 w-4" />
            </button>
          </div>

          {/* Secure transaction notice */}
          <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <ShieldCheck class="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span class="text-xs font-bold text-slate-700 block">Encrypted Checkout</span>
              <span class="text-slate-400 text-xxs mt-0.5 block leading-relaxed">
                Transactions are safely processed. Integrates fully with Razorpay standard test environments.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
