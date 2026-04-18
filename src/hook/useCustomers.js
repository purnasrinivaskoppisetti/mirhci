'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

export const useCustomers = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const { getToken } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async (query = '') => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) throw new Error('Session expired');

      let url = `${BASE_URL}api/customers/`;

      if (query && query.trim() !== '') {
        url += `?search=${query}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        setCustomers(result.data || []);
      } else {
        setCustomers([]);
      }

    } catch (err) {
      setError(err?.message || 'Something went wrong');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  return { customers, loading, error, fetchCustomers };
};