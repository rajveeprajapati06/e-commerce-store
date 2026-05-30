import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShoppingBag } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  const { login, user, error, setError } = useContext(AuthContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    // Clear auth errors on boot
    return () => setError(null);
  }, [user, navigate, redirect, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setFormError(result.message);
    }
  };

  return (
    <div class="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 fade-in-up">
      <div class="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-premium border border-slate-100/80">
        
        {/* Header Intro */}
        <div class="text-center space-y-3">
          <div class="p-3.5 bg-blue-50 text-primary rounded-2xl w-fit mx-auto shadow-sm">
            <ShoppingBag class="h-8 w-8" />
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p class="text-slate-400 text-sm">Access your orders, profile, and secure checkout</p>
        </div>

        {/* Display Alert Messages */}
        {(formError || error) && (
          <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-semibold text-xs leading-relaxed">
            {formError || error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} class="space-y-5">
          <div class="space-y-4">
            {/* Email field */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div class="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                />
                <Mail class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Password field */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div class="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                />
                <Lock class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 focus:outline-none"
          >
            <LogIn class="h-4 w-4" /> Sign In
          </button>
        </form>

        {/* Register redirection */}
        <div class="text-center pt-4 border-t border-slate-100 text-sm">
          <span class="text-slate-400 font-medium">New to AuraStore? </span>
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            class="text-primary font-bold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
