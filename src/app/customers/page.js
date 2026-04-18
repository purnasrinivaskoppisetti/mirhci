'use client';

import { useEffect, useState } from 'react';
import { useCustomers } from '@/hook/useCustomers';
import {
  IoSearch,
  IoCallOutline,
  IoCubeOutline,
  IoCashOutline,
  IoTimeOutline,
} from 'react-icons/io5';

export default function Customers() {
  const { customers, loading, error, fetchCustomers } = useCustomers();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);

    if (text.trim() === '') {
      fetchCustomers();
    } else {
      fetchCustomers(text);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4">

        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Customers
          </h1>
          <p className="text-gray-500">
            Farmer & customer directory
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex items-center bg-white rounded-xl px-3 mb-4 shadow-sm">
          <IoSearch size={18} color="gray" />
          <input
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 p-3 outline-none"
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        {/* LIST */}
        {customers.length === 0 && !loading ? (
          <p className="text-gray-500">No customers found</p>
        ) : (
          customers.map((item) => (
            <div
              key={item.customer_id}
              className="bg-white p-4 rounded-2xl mb-4 shadow-sm"
            >
              {/* TOP */}
              <div className="flex items-center mb-4">

                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">
                    {item.name?.charAt(0)}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 text-base">
                    {item.name}
                  </p>

                  <div className="flex items-center mt-1">
                    <IoCallOutline size={14} color="gray" />
                    <span className="text-gray-500 text-sm ml-1">
                      {item.mobile}
                    </span>
                  </div>
                </div>

              </div>

              {/* STATS */}
              <div className="flex justify-between">

                {/* ORDERS */}
                <div className="bg-gray-100 p-3 rounded-xl w-[30%] text-center">
                  <IoCubeOutline size={16} color="gray" />
                  <p className="font-semibold mt-1">
                    {item.total_orders}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Orders
                  </p>
                </div>

                {/* TOTAL */}
                <div className="bg-gray-100 p-3 rounded-xl w-[30%] text-center">
                  <IoCashOutline size={16} color="gray" />
                  <p className="font-semibold mt-1">
                    ₹{item.total_amount}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Total
                  </p>
                </div>

                {/* PENDING */}
                <div className="bg-gray-100 p-3 rounded-xl w-[30%] text-center">
                  <IoTimeOutline size={16} color="gray" />
                  <p
                    className={`font-semibold mt-1 ${
                      item.pending_amount === 0
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    ₹{item.pending_amount}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Pending
                  </p>
                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}