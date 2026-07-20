"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Mail } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh(); 
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="max-w-md w-full bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative z-10 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-6 transition-transform duration-500 hover:scale-110 hover:rotate-3 drop-shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
            <Image 
              src="/gwenn-logo-tr.png" 
              alt="GwennTopup Logo" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Sign in to access the GwennTopup admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                placeholder="GwenTopup9@gmail.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.5)] hover:-translate-y-0.5 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
