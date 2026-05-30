import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Truck, Sparkles, RefreshCcw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found or database connectivity issues.');
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500); // feedback timer
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 5);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} class="h-5 w-5 fill-accent text-accent" />);
      } else {
        stars.push(<Star key={i} class="h-5 w-5 text-slate-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div class="flex justify-center items-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div class="max-w-md mx-auto text-center py-16 space-y-4">
        <div class="p-4 bg-red-50 text-red-500 rounded-full w-fit mx-auto">
          <RefreshCcw class="h-8 w-8" />
        </div>
        <h2 class="text-2xl font-extrabold text-slate-800">Error Fetching Product</h2>
        <p class="text-slate-400 text-sm">{error || 'Something went wrong'}</p>
        <Link
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary-dark transition-all text-sm"
        >
          <ArrowLeft class="h-4 w-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div class="space-y-8 fade-in-up">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors focus:outline-none"
      >
        <ArrowLeft class="h-4 w-4" /> Back to Shop
      </button>

      {/* Main Product Layout */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-12 shadow-premium border border-slate-100">
        {/* Left Column: Image Panel */}
        <div class="flex flex-col space-y-4">
          <div class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-50 border border-slate-100 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              class="w-full h-full object-cover object-center"
            />
            {product.stock === 0 && (
              <span class="absolute top-4 left-4 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Spec Panel */}
        <div class="flex flex-col justify-between space-y-8">
          <div class="space-y-4">
            {/* Category badge */}
            <span class="inline-block bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">
              {product.category}
            </span>

            {/* Title */}
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings & reviews count */}
            <div class="flex items-center gap-2">
              <div class="flex">{renderStars(product.rating)}</div>
              <span class="text-sm font-semibold text-slate-800">
                {product.rating} / 5
              </span>
              <span class="text-sm text-slate-400 font-medium">
                ({product.numReviews} Verified Reviews)
              </span>
            </div>

            {/* Price tag */}
            <div class="py-2.5">
              <span class="text-3xl font-black text-slate-900">
                ${product.price.toLocaleString()}
              </span>
              <span class="text-xs text-slate-400 block mt-1 font-medium">Includes shipping & standard VAT taxes</span>
            </div>

            {/* Divider */}
            <hr class="border-slate-100" />

            {/* Description */}
            <p class="text-slate-500 text-sm md:text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          <div class="space-y-6">
            {/* Stock status indicator & Qty Selector */}
            <div class="flex items-center gap-6">
              <div>
                <span class="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1.5">Availability</span>
                {product.stock > 0 ? (
                  <span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                    In Stock ({product.stock} units left)
                  </span>
                ) : (
                  <span class="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full border border-red-100 shadow-sm">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Quantity input dropdown */}
              {product.stock > 0 && (
                <div>
                  <span class="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1.5">Quantity</span>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-primary cursor-pointer font-semibold"
                  >
                    {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Add to cart action buttons */}
            <div class="flex gap-4">
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  class={`flex-grow md:flex-grow-0 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  <ShoppingCart class="h-4 w-4" />
                  {added ? 'Successfully Added!' : 'Add to Shopping Cart'}
                </button>
              ) : (
                <button
                  disabled
                  class="flex-grow md:flex-grow-0 px-8 py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart class="h-4 w-4" />
                  Temporarily Unavailable
                </button>
              )}
            </div>
          </div>

          {/* Guaranteed Badges */}
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-slate-500">
            <div class="flex items-center gap-2 text-xs">
              <ShieldCheck class="h-5 w-5 text-primary" />
              <span>1 Year Warranty</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <Truck class="h-5 w-5 text-primary" />
              <span>Next Day Dispatch</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <Sparkles class="h-5 w-5 text-primary" />
              <span>Quality Inspected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
