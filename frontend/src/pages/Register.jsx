import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ShoppingBag } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState(null);

  const { register, user, error, setError } = useContext(AuthContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    // Clear errors on boot
    return () => setError(null);
  }, [user, navigate, redirect, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all form fields.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    const result = await register(name, email, password);
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
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p class="text-slate-400 text-sm">Join AuraStore to access premium products and features</p>
        </div>

        {/* Display Alert Messages */}
        {(formError || error) && (
          <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-semibold text-xs leading-relaxed">
            {formError || error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="space-y-3.5">
            {/* Full Name field */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div class="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                />
                <User class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Email Address field */}
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

            {/* Confirm Password field */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
              <div class="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                />
                <Lock class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 focus:outline-none pt-2"
          >
            <UserPlus class="h-4 w-4" /> Create Account
          </button>
        </form>

        {/* Login redirection */}
        <div class="text-center pt-4 border-t border-slate-100 text-sm">
          <span class="text-slate-400 font-medium">Already have an account? </span>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            class="text-primary font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
