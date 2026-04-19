'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ import router

export const useAuth = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter(); // ✅ define router

  const login = async (email, password) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${BASE_URL}api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      const token = data?.data?.access_token;

      if (!token) throw new Error('Token not found');

      localStorage.setItem('token', token);

      // ✅ Navigation here (as you want)
      router.replace('/dashboard');

      return true;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  return { login, loading, error, getToken };
};