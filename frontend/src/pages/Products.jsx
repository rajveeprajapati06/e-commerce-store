import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw, X, AlertCircle } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  // Trigger search whenever filters are changed or searchParams updates
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          keyword: searchParams.get('keyword') || '',
          category: searchParams.get('category') || 'All',
          minPrice: searchParams.get('minPrice') || '',
          maxPrice: searchParams.get('maxPrice') || '',
          sort: searchParams.get('sort') || 'newest',
        };

        const data = await fetchProducts(params);
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Check your database connection.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchParams]);

  // Sync state with url on parameter load
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || 'All');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (category && category !== 'All') newParams.category = category;
    if (minPrice) newParams.minPrice = minPrice;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (sort) newParams.sort = sort;

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchParams({});
  };

  const categoriesList = ['All', 'Electronics', 'Apparel', 'Accessories', 'Home & Kitchen'];

  return (
    <div class="space-y-8 fade-in-up">
      {/* Title Header */}
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Product Catalogue</h1>
        <p class="text-slate-400 text-sm mt-1">Explore our exclusive collections and premium products</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        {/* Filters Panel - Sidebar */}
        <aside class="w-full lg:w-64 bg-white rounded-2xl p-6 shadow-premium border border-slate-100/80 h-fit space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
              <SlidersHorizontal class="h-4 w-4 text-primary" /> Filters
            </h2>
            <button
              onClick={handleResetFilters}
              class="text-xs text-slate-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors"
            >
              <RotateCcw class="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Search bar inside filters */}
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase text-slate-400 tracking-wider">Search</label>
            <div class="relative">
              <input
                type="text"
                placeholder="Product name..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                class="w-full px-3 py-2 pl-9 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
              />
              <Search class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase text-slate-400 tracking-wider">Category</label>
            <div class="space-y-1.5">
              {categoriesList.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCategory(cat);
                    const newParams = { ...Object.fromEntries(searchParams), category: cat };
                    if (cat === 'All') delete newParams.category;
                    setSearchParams(newParams);
                  }}
                  class={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    category === cat
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase text-slate-400 tracking-wider">Price Range ($)</label>
            <div class="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={() => handleApplyFilters()}
              class="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm"
            >
              Apply Price
            </button>
          </div>

          {/* Sort Select */}
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase text-slate-400 tracking-wider">Sort By</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value });
              }}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Products Grid Pane */}
        <div class="flex-grow">
          {loading ? (
            <div class="flex justify-center items-center py-28">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div class="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center gap-2">
              <AlertCircle class="h-8 w-8 text-red-500" />
              <p class="font-semibold">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div class="bg-white border border-slate-100 rounded-2xl p-16 text-center shadow-premium space-y-4 max-w-lg mx-auto">
              <div class="p-4 bg-slate-50 rounded-full w-fit mx-auto text-slate-400">
                <Search class="h-10 w-10" />
              </div>
              <h3 class="font-extrabold text-xl text-slate-800">No Products Found</h3>
              <p class="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                We couldn't find any products matching your active filters. Try refining your keywords or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                class="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
