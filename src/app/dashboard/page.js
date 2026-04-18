'use client';

import { useEffect } from 'react';
import { useDashboard } from '@/hook/useDashboard';
import { 
  IoCart, 
  IoCube, 
  IoCash, 
  IoTime 
} from 'react-icons/io5';

export default function Home() {
  const { data, loading, error, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const today = data?.today || {};
  const transactions = data?.recent_transactions || [];

  const stats = [
    {
      title: "Today's Purchases",
      value: today.total_purchases || 0,
      icon: <IoCart size={22} color="#ef4444" />,
    },
    {
      title: 'Total Weight',
      value: `${today.total_weight_kg || 0} kg`,
      icon: <IoCube size={22} color="#22c55e" />,
    },
    {
      title: 'Total Spent',
      value: `₹${today.total_spent || 0}`,
      icon: <IoCash size={22} color="#f97316" />,
    },
    {
      title: 'Pending',
      value: today.pending_payments || 0,
      icon: <IoTime size={22} color="#3b82f6" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-md mx-auto p-4">

        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* STATS */}
        <div className="flex flex-wrap justify-between mt-5">
          {stats.map((item, i) => (
            <div
              key={i}
              className="w-[48%] bg-white p-4 rounded-xl mb-3"
            >
              {item.icon}
              <p className="mt-2">{item.title}</p>
              <p className="font-bold text-base">{item.value}</p>
            </div>
          ))}
        </div>

        {/* TRANSACTIONS */}
        <h2 className="text-lg font-bold mt-5">
          Transactions
        </h2>

        {transactions.length === 0 ? (
          <p>No data</p>
        ) : (
          transactions.map((item, i) => {
            const status = item.status?.toLowerCase();

            return (
              <div
                key={i}
                className="bg-white p-4 rounded-xl mt-3"
              >
                <p>{item.invoice}</p>
                <p>{item.date}</p>
                <p>₹{item.amount}</p>

                <p
                  className={
                    status === 'paid'
                      ? 'text-green-500'
                      : status === 'pending'
                      ? 'text-red-500'
                      : 'text-orange-500'
                  }
                >
                  {status}
                </p>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}