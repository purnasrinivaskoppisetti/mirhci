'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hook/useAuth';

export default function Login() {
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login(email, password); // ✅ hook handles redirect
  };

  return (
    <div className="flex min-h-screen justify-center p-6 bg-black">
      <div className="w-full max-w-md">
        
        <h1 className="text-white text-3xl mb-6">Login</h1>

        <input
          placeholder="Email"
          className="bg-gray-100 p-4 rounded-xl mb-4 w-full outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="bg-gray-100 p-4 rounded-xl mb-4 w-full outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 mb-3 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="bg-red-500 py-4 rounded-xl w-full"
          disabled={loading}
        >
          <span className="text-white text-center text-lg block">
            {loading ? 'Loading...' : 'Logins'}
          </span>
        </button>

      </div>
    </div>
  );
}