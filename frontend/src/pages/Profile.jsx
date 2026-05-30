import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, error, setError } = useContext(AuthContext);

  // States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Initialize fields on load
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    return () => setError(null);
  }, [user, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);

    if (!name || !email) {
      setFormError('Name and email are required.');
      return;
    }

    if (password) {
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setFormError('Password must be at least 6 characters.');
        return;
      }
    }

    try {
      setUpdating(true);
      const payload = { name, email };
      if (password) payload.password = password;

      const result = await updateProfile(payload);
      
      if (result.success) {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setFormError(result.message);
      }
    } catch (err) {
      setFormError('Profile update failed.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div class="max-w-xl mx-auto space-y-8 fade-in-up">
      {/* Title */}
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Your Profile</h1>
        <p class="text-slate-400 text-sm mt-1">Manage your account details and security settings</p>
      </div>

      <div class="bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-slate-100/80">
        
        {/* Messages */}
        {success && (
          <div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center gap-2 mb-6 text-sm font-semibold">
            <CheckCircle2 class="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {(formError || error) && (
          <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-2 mb-6 text-sm font-semibold">
            <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 gap-5">
            {/* Full Name */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div class="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                />
                <User class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Email Address */}
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div class="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                />
                <Mail class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div class="border-t border-slate-100 pt-5 mt-2 space-y-4">
              <div>
                <h3 class="font-bold text-slate-800 text-base">Update Password</h3>
                <p class="text-slate-400 text-xs mt-0.5">Leave blank if you don't wish to modify your password</p>
              </div>

              {/* Password */}
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <div class="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                  />
                  <Lock class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Confirm Password */}
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                <div class="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    class="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                  />
                  <Lock class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            class="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Updating Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
