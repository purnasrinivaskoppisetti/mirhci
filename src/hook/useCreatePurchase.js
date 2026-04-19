'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useNewPurchase = () => {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [crop, setCrop] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');

  const [range1, setRange1] = useState('');
  const [range2, setRange2] = useState('');
  const [range3, setRange3] = useState('');

  const [bags, setBags] = useState([
    { bag: 'Bag 1', weight: '', netWeight: 0, deduction: 0 },
  ]);

  // ✅ PAYMENT
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');

  const [preview, setPreview] = useState(null);

  const getDeduction = (weight) => {
    if (weight <= 49) return parseFloat(range1) || 0;
    if (weight <= 99) return parseFloat(range2) || 0;
    return parseFloat(range3) || 0;
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
    setBags(prev => [
      ...prev,
      { bag: `Bag ${prev.length + 1}`, weight: '', netWeight: 0, deduction: 0 }
    ]);
  };

  // ✅ PREVIEW
  const handlePreview = async () => {
    const token = getToken();

    const payload = {
      customer_name: name,
      mobile,
      crop,
      type,
      price_per_kg: parseFloat(price),
      purchase_date: new Date().toISOString().split('T')[0],
      bags: bags.map((b, i) => ({
        bag_number: i + 1,
        gross_weight: parseFloat(b.weight),
        deduction: b.deduction,
      })),
      payment: {
        amount_paid: parseFloat(amountPaid) || 0,
        payment_mode: paymentMode,
      }
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

    const total = data.data.totals.amount;
    const paid = parseFloat(amountPaid) || 0;

    setPreview({
      ...data.data,
      paid,
      pending: total - paid
    });
  };

  // ✅ SAVE
  const handleSave = async () => {
    const token = getToken();

    const payload = {
      customer_name: name,
      mobile,
      crop,
      type,
      price_per_kg: parseFloat(price),
      purchase_date: new Date().toISOString().split('T')[0],
      bags: bags.map((b, i) => ({
        bag_number: i + 1,
        gross_weight: parseFloat(b.weight),
        deduction: b.deduction,
      })),
      payment: {
        amount_paid: parseFloat(amountPaid),
        payment_mode: paymentMode,
      }
    };

    await fetch(`${BASE_URL}api/purchases/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    alert('Saved successfully');
  };

  return {
    name, setName,
    mobile, setMobile,
    crop, setCrop,
    type, setType,
    price, setPrice,
    range1, setRange1,
    range2, setRange2,
    range3, setRange3,
    bags,
    handleWeightChange,
    addBag,

    amountPaid, setAmountPaid,
    paymentMode, setPaymentMode,

    preview,
    handlePreview,
    handleSave,
    loading
  };
};