'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useNewPurchase = () => {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [crop, setCrop] = useState('');
  const [type, setType] = useState(''); // ✅ NEW
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(getTodayDate());

  const [range1, setRange1] = useState('');
  const [range2, setRange2] = useState('');
  const [range3, setRange3] = useState('');

  const [bags, setBags] = useState([
    { bag: 'Bag 1', weight: '', netWeight: 0, deduction: 0 },
  ]);

  const [preview, setPreview] = useState(null); // ✅ NEW

  const getDeduction = (weight) => {
    if (weight >= 1 && weight <= 49) return parseFloat(range1) || 0;
    if (weight >= 50 && weight <= 99) return parseFloat(range2) || 0;
    if (weight >= 100 && weight <= 200) return parseFloat(range3) || 0;
    return 0;
  };

  const handleWeightChange = (value, index) => {
    const updated = bags.map((item, i) => {
      if (i !== index) return item;

      const weight = parseFloat(value) || 0;
      const deduction = getDeduction(weight);

      return {
        ...item,
        weight: value,
        deduction,
        netWeight: weight - deduction,
      };
    });

    setBags(updated);
  };

  const addBag = () => {
    setBags((prev) => [
      ...prev,
      {
        bag: `Bag ${prev.length + 1}`,
        weight: '',
        netWeight: 0,
        deduction: 0,
      },
    ]);
  };

  // ✅ PREVIEW API
  const handlePreview = async () => {
    const token = getToken();
    if (!token) return alert('Login again');

    const payload = {
      customer_name: name,
      mobile,
      crop,
      type,
      price_per_kg: parseFloat(price) || 0,
      purchase_date: date,
      bags: bags.map((b, i) => ({
        bag_number: i + 1,
        gross_weight: parseFloat(b.weight) || 0,
        deduction: b.deduction,
      })),
    };

    const res = await fetch(`${BASE_URL}api/purchases/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setPreview(data.data);
  };

  // ✅ SAVE
  const handleSave = async () => {
    setLoading(true);

    try {
      const token = getToken();

      const payload = {
        customer_name: name,
        mobile,
        crop,
        type,
        price_per_kg: parseFloat(price),
        purchase_date: date,
        bags: bags.map((b, i) => ({
          bag_number: i + 1,
          gross_weight: parseFloat(b.weight),
          deduction: b.deduction,
        })),
      };

      await fetch(`${BASE_URL}api/purchases/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      alert('Saved Successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    mobile, setMobile,
    crop, setCrop,
    type, setType,
    price, setPrice,
    date, setDate,
    range1, setRange1,
    range2, setRange2,
    range3, setRange3,
    bags,
    handleWeightChange,
    addBag,
    handlePreview,
    preview,
    handleSave,
    loading
  };
};