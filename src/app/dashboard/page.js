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
      color: 'text-red-500',
      icon: <IoCart size={20} />
    },
    {
      title: 'Total Weight',
      value: `${today.total_weight_kg || 0} kg`,
      color: 'text-green-500',
      icon: <IoCube size={20} />
    },
    {
      title: 'Total Spent',
      value: `₹${today.total_spent || 0}`,
      color: 'text-orange-500',
      icon: <IoCash size={20} />
    },
    {
      title: 'Pending',
      value: today.pending_payments || 0,
      color: 'text-blue-500',
      icon: <IoTime size={20} />
    },
  ];

  if (loading) return <p className="p-5">Loading...</p>;
  if (error) return <p className="p-5 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">

      <div className="max-w-md mx-auto p-4">

        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
              <div className={item.color}>{item.icon}</div>
              <p className="text-sm mt-2">{item.title}</p>
              <p className="font-bold text-lg">{item.value}</p>
            </div>
          ))}
        </div>

        {/* WEEKLY GRAPH */}
        <h2 className="text-lg font-bold mt-6">Weekly Trends</h2>

        <div className="bg-white p-4 rounded-xl mt-3 shadow-sm">
          {(() => {
            const weekly = data?.weekly_trends || [];

            const max = Math.max(
              ...weekly.map(d => (d.mirchi_kg + d.cotton_kg)),
              1
            );

            return weekly.map((day, i) => {
              const total = day.mirchi_kg + day.cotton_kg;

              return (
                <div key={i} className="mb-3">

                  <div className="flex justify-between text-xs mb-1">
                    <span>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="font-medium">{total} kg</span>
                  </div>

                  <div className="flex h-2 rounded overflow-hidden bg-gray-200">

                    <div
                      className="bg-red-500"
                      style={{ width: `${(day.mirchi_kg / max) * 100}%` }}
                    />

                    <div
                      className="bg-green-500"
                      style={{ width: `${(day.cotton_kg / max) * 100}%` }}
                    />

                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* RECENT TRANSACTIONS */}
        <h2 className="text-lg font-bold mt-6">Recent Transactions</h2>

        {transactions.map((item, i) => {
          const status = item.status?.toLowerCase();

          const statusColor =
            status === 'paid'
              ? 'bg-green-500'
              : status === 'pending'
              ? 'bg-red-500'
              : 'bg-orange-500';

          return (
            <div
              key={i}
              className="bg-white p-4 rounded-xl mt-3 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-base">
                  {item.customer_name}
                </p>

                <p className="text-xs text-gray-500">
                  {item.crop} · {item.type || 'General'}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">₹{item.amount}</p>

                <span
                  className={`text-white text-xs px-2 py-1 rounded ${statusColor}`}
                >
                  {status}
                </span>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}