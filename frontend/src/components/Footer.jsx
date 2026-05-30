import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer class="bg-secondary text-slate-400 mt-auto border-t border-slate-900">
      <div class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <ShoppingBag class="h-6 w-6 text-primary" />
              <span class="font-extrabold text-xl tracking-tight text-white">
                AURA<span class="text-primary">STORE</span>
              </span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Elevating your daily experience with our meticulously designed, premium quality electronics and elite tech accessories.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="p-2 bg-slate-800/80 rounded-full hover:bg-primary hover:text-white transition-all text-slate-300">
                <Facebook class="h-4 w-4" />
              </a>
              <a href="#" class="p-2 bg-slate-800/80 rounded-full hover:bg-primary hover:text-white transition-all text-slate-300">
                <Twitter class="h-4 w-4" />
              </a>
              <a href="#" class="p-2 bg-slate-800/80 rounded-full hover:bg-primary hover:text-white transition-all text-slate-300">
                <Instagram class="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Shop</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <Link to="/products" class="hover:text-primary transition-colors">All Collections</Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" class="hover:text-primary transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=Apparel" class="hover:text-primary transition-colors">Elite Apparel</Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" class="hover:text-primary transition-colors">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="#" class="hover:text-primary transition-colors">Shipping & Returns</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors">FAQ & Support</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Stay Connected</h3>
            <p class="text-sm leading-relaxed">
              Subscribe to receive exclusive deals, custom drop updates, and modern tech news.
            </p>
            <form onSubmit={(e) => e.preventDefault()} class="flex">
              <div class="relative w-full">
                <input
                  type="email"
                  placeholder="Your Email"
                  class="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-l-full py-2 px-4 pl-10 text-sm focus:outline-none focus:border-primary"
                  required
                />
                <Mail class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              <button
                type="submit"
                class="bg-primary hover:bg-primary-dark text-white rounded-r-full px-4 flex items-center justify-center transition-colors focus:outline-none"
              >
                <ArrowRight class="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <hr class="border-slate-800 my-8" />
        <div class="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 AuraStore Inc. All rights reserved.</p>
          <p class="mt-2 sm:mt-0 flex gap-4">
            <a href="#" class="hover:text-slate-400">Security</a>
            <a href="#" class="hover:text-slate-400">System Status</a>
            <a href="#" class="hover:text-slate-400">Consent Preferences</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
