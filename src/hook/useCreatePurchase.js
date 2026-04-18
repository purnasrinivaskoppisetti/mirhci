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
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(getTodayDate());

  const [range1, setRange1] = useState('');
  const [range2, setRange2] = useState('');
  const [range3, setRange3] = useState('');

  const [bags, setBags] = useState([
    { bag: 'Bag 1', weight: '', netWeight: 0, deduction: 0 },
  ]);

  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [notes, setNotes] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSave = async () => {
    setLoading(true);

    try {
      const token = getToken();
      if (!token) return alert('Login again');

      const payload = {
        customer_name: name,
        mobile,
        crop,
        price_per_kg: parseFloat(price) || 0,
        purchase_date: date,
        bags: bags.map((b, i) => ({
          bag_number: i + 1,
          gross_weight: b.netWeight,
          deduction: b.deduction,
        })),
        payment: {
          amount_paid: parseFloat(amountPaid) || 0,
          payment_mode: paymentMode,
          remarks: '',
        },
        notes,
      };

      const res = await fetch(`${BASE_URL}api/purchases/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);

      // ✅ SHOW POPUP
      setShowSuccess(true);

      // ✅ CLEAR FORM
      setName('');
      setMobile('');
      setCrop('');
      setPrice('');
      setAmountPaid('');
      setNotes('');
      setBags([{ bag: 'Bag 1', weight: '', netWeight: 0, deduction: 0 }]);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    name, setName,
    mobile, setMobile,
    crop, setCrop,
    price, setPrice,
    date, setDate,
    range1, setRange1,
    range2, setRange2,
    range3, setRange3,
    bags,
    handleWeightChange,
    addBag,
    amountPaid, setAmountPaid,
    paymentMode, setPaymentMode,
    notes, setNotes,
    handleSave,
    showSuccess, setShowSuccess,
  };
};