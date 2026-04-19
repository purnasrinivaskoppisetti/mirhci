'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const usePurchases = () => {
  const { getToken } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}api/purchases/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setPurchases(data.data);
      } else {
        setError('Failed to fetch purchases');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePurchase = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}api/purchases/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        await fetchPurchases();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Delete error:', err);
      return false;
    }
  };

  const getPurchaseById = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}api/purchases/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return null;
    } catch (err) {
      console.error('Fetch error:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    purchases,
    loading,
    error,
    fetchPurchases,
    deletePurchase,
    getPurchaseById,
  };
};