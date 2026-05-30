import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Laptop, Shirt, Compass, Coffee, ArrowRight, Flame, ShieldCheck, Truck } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        // Take first 4 as featured
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        setError('Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };
    getFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Electronics', icon: <Laptop class="h-6 w-6" />, count: '8 Items', color: 'from-blue-500 to-indigo-600', link: '/products?category=Electronics' },
    { name: 'Elite Apparel', icon: <Shirt class="h-6 w-6" />, count: '3 Items', color: 'from-purple-500 to-pink-600', link: '/products?category=Apparel' },
    { name: 'Accessories', icon: <Compass class="h-6 w-6" />, count: '2 Items', color: 'from-amber-500 to-orange-600', link: '/products?category=Accessories' },
    { name: 'Home & Kitchen', icon: <Coffee class="h-6 w-6" />, count: '1 Item', color: 'from-emerald-500 to-teal-600', link: '/products?category=Home%20%26%20Kitchen' },
  ];

  return (
    <div class="space-y-16 fade-in-up">
      {/* Premium Hero Banner */}
      <section class="relative rounded-3xl overflow-hidden shadow-2xl bg-secondary-dark text-white flex flex-col md:flex-row items-center justify-between p-8 md:p-16 min-h-[480px]">
        {/* Glow effect */}
        <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent/15 blur-3xl"></div>

        <div class="relative z-10 space-y-6 max-w-lg md:text-left text-center">
          <div class="inline-flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700 text-xs font-semibold tracking-wider text-accent uppercase">
            <Flame class="h-4 w-4 text-accent fill-accent" /> Summer Drop 2026
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Discover <span class="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Elite</span> Tech & Wear.
          </h1>
          <p class="text-slate-300 text-base md:text-lg font-light leading-relaxed">
            Elevating your standards with curated premium electronics, high-tech wear, and iconic design essentials.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/products"
              class="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Explore Products <ArrowRight class="h-4 w-4" />
            </Link>
            <Link
              to="/products?category=Electronics"
              class="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center"
            >
              Shop Tech
            </Link>
          </div>
        </div>

        {/* Hero image mockup */}
        <div class="relative w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <div class="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800/50 hover:scale-102 transition-transform duration-300">
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop"
              alt="Premium iPhone 15 Pro"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div class="absolute bottom-5 left-5 text-left">
              <span class="text-xs text-blue-400 font-bold tracking-wider uppercase block">Featured Drop</span>
              <span class="text-xl font-bold text-white block">Apple iPhone 15 Pro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges Section */}
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-start gap-4">
          <div class="p-3 bg-blue-100 text-primary rounded-xl">
            <Truck class="h-6 w-6" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-lg">Free Fast Shipping</h3>
            <p class="text-slate-400 text-sm mt-1">Get free delivery on orders exceeding $200</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-start gap-4">
          <div class="p-3 bg-amber-100 text-accent rounded-xl">
            <ShieldCheck class="h-6 w-6" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-lg">Premium Guarantee</h3>
            <p class="text-slate-400 text-sm mt-1">100% authentic merchandise direct from brands</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-premium border border-slate-100 flex items-start gap-4">
          <div class="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Compass class="h-6 w-6" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-lg">24/7 Dedicated Support</h3>
            <p class="text-slate-400 text-sm mt-1">Live customer success representatives standby</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section class="space-y-6">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Curated Categories</h2>
            <p class="text-slate-400 text-sm mt-1">Seamless search tailored by products type</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              class="relative rounded-2xl p-6 text-white shadow-premium overflow-hidden group hover:shadow-premiumHover hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card gradient background */}
              <div class={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
              
              {/* Wave styling overlays */}
              <div class="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/10 group-hover:scale-120 transition-transform"></div>

              <div class="relative z-10 flex flex-col justify-between h-28">
                <div class="p-2.5 bg-white/20 rounded-xl w-fit">
                  {cat.icon}
                </div>
                <div>
                  <h3 class="font-bold text-lg">{cat.name}</h3>
                  <span class="text-xs text-white/80 font-medium block mt-1">Explore Collections</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section class="space-y-6">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Arrivals</h2>
            <p class="text-slate-400 text-sm mt-1">Explore our latest state-of-the-art additions</p>
          </div>
          <Link
            to="/products"
            class="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1 hover:underline"
          >
            See All Products <ArrowRight class="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div class="flex justify-center py-16">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div class="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
