import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemsCount } = useContext(CartContext);
  
  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
    setKeyword('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav class="glass-nav sticky top-0 z-50 text-white shadow-premium">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <div class="flex-shrink-0 flex items-center">
            <Link to="/" class="flex items-center gap-2 group">
              <ShoppingBag class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span class="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
                AURA<span class="text-primary">STORE</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div class="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} class="w-full relative">
              <input
                type="text"
                placeholder="Search premium electronics, apparel..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                class="w-full px-4 py-2 pl-10 pr-4 bg-slate-800/80 border border-slate-700 rounded-full text-slate-100 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder-slate-400"
              />
              <Search class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </form>
          </div>

          {/* Nav Items - Desktop */}
          <div class="hidden md:flex items-center space-x-6">
            <Link
              to="/products"
              class="text-sm font-medium text-slate-200 hover:text-white hover:underline decoration-primary decoration-2 underline-offset-4 transition-all"
            >
              Shop
            </Link>

            {/* Cart Link */}
            <Link to="/cart" class="relative group p-2 hover:bg-slate-800 rounded-full transition-all">
              <ShoppingCart class="h-5 w-5 text-slate-200 group-hover:text-primary transition-colors" />
              {itemsCount > 0 && (
                <span class="absolute -top-1 -right-1 bg-accent text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-md">
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <div class="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setAdminDropdownOpen(false);
                  }}
                  class="flex items-center gap-1.5 text-sm font-medium text-slate-200 hover:text-white focus:outline-none"
                >
                  <User class="h-4 w-4" />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown class={`h-4 w-4 transform transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div class="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-premium py-1 text-slate-200 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      class="block px-4 py-2.5 text-sm hover:bg-slate-800 hover:text-primary transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      class="block px-4 py-2.5 text-sm hover:bg-slate-800 hover:text-primary transition-colors"
                    >
                      My Orders
                    </Link>
                    <hr class="border-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      class="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-800 hover:text-red-400 transition-colors text-red-500 font-medium"
                    >
                      <LogOut class="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                class="flex items-center gap-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <User class="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Admin Dropdown */}
            {user && user.isAdmin && (
              <div class="relative">
                <button
                  onClick={() => {
                    setAdminDropdownOpen(!adminDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  class="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark focus:outline-none"
                >
                  <LayoutDashboard class="h-4 w-4" />
                  <span>Admin</span>
                  <ChevronDown class={`h-4 w-4 transform transition-transform ${adminDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {adminDropdownOpen && (
                  <div class="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-premium py-1 text-slate-200 z-50">
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setAdminDropdownOpen(false)}
                      class="block px-4 py-2.5 text-sm hover:bg-slate-800 hover:text-accent transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/add-product"
                      onClick={() => setAdminDropdownOpen(false)}
                      class="block px-4 py-2.5 text-sm hover:bg-slate-800 hover:text-accent transition-colors"
                    >
                      Add Product
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Icon - Mobile */}
          <div class="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon */}
            <Link to="/cart" class="relative p-2 hover:bg-slate-800 rounded-full transition-all">
              <ShoppingCart class="h-5 w-5 text-slate-200" />
              {itemsCount > 0 && (
                <span class="absolute -top-1 -right-1 bg-accent text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {itemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              class="inline-flex items-center justify-center p-2 rounded-full text-slate-200 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {mobileMenuOpen ? <X class="h-6 w-6" /> : <Menu class="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div class="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} class="relative mt-2">
            <input
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              class="w-full px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-full text-slate-100 text-sm focus:outline-none focus:border-primary"
            />
            <Search class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </form>

          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            class="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800"
          >
            Shop Products
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                class="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800"
              >
                Profile Details
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                class="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800"
              >
                My Orders
              </Link>

              {user.isAdmin && (
                <>
                  <hr class="border-slate-800 my-2" />
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    class="block px-3 py-2 rounded-lg text-base font-medium text-accent hover:bg-slate-800"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/add-product"
                    onClick={() => setMobileMenuOpen(false)}
                    class="block px-3 py-2 rounded-lg text-base font-medium text-accent hover:bg-slate-800"
                  >
                    Add Product
                  </Link>
                </>
              )}

              <hr class="border-slate-800 my-2" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-red-500 hover:bg-slate-800"
              >
                <LogOut class="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              class="block text-center px-3 py-2.5 rounded-lg text-base font-semibold bg-primary hover:bg-primary-dark text-white"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
