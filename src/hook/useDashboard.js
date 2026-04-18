'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

export const useDashboard = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const { getToken } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();

      if (!token) throw new Error('Session expired');

      const res = await fetch(`${BASE_URL}api/dashboard/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || 'API Error');
      }

      setData(result?.data || {});
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchDashboard };
};