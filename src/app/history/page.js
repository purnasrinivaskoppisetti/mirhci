'use client';

import { useEffect, useState } from 'react';
import { IoSearch, IoTrashOutline } from 'react-icons/io5';
import { useAuth } from '@/hook/useAuth';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ NEW STATE
  const [deleting, setDeleting] = useState(false);

  const { getToken } = useAuth();

  const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}api/purchases/`;

  /* ================= FETCH ================= */
  const fetchHistory = async (query = '') => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) return;

      let url = BASE_URL;

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

      const data = await res.json();

      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (error) {
      console.log('FETCH ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const deletePurchase = async () => {
    try {
      if (!deleteId) return;

      setDeleting(true); // ✅ start loader

      const token = getToken();
      if (!token) return;

      const res = await fetch(`${BASE_URL}${deleteId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setHistory((prev) =>
          prev.filter((item) => (item.id || item.purchase_id) !== deleteId)
        );
      }

      setShowModal(false);
      setDeleteId(null);
    } catch (error) {
      console.log('DELETE ERROR:', error);
    } finally {
      setDeleting(false); // ✅ stop loader
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4">

        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Purchase History
          </h1>
          <p className="text-gray-500">
            All purchase records
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex items-center bg-white rounded-xl px-3 mb-4 shadow-sm">
          <IoSearch size={18} color="gray" />
          <input
            placeholder="Search by name, crop..."
            className="flex-1 p-3 outline-none"
            value={search}
            onChange={(e) => {
              const text = e.target.value;
              setSearch(text);
              fetchHistory(text);
            }}
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}

        {/* LIST */}
        {history.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl mb-3 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">
                {item.customer}
              </p>

              <p className="text-red-500 font-semibold">
                ₹{item.total}
              </p>
            </div>

            <div className="flex flex-wrap mt-2">
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-2">
                {item.crop}
              </span>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  item.status === 'paid'
                    ? 'bg-green-100 text-green-600'
                    : item.status === 'partial'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {item.status}
              </span>
            </div>

            <p className="text-gray-500 text-sm mt-2">
              {item.date} · {item.net_weight}kg · {item.bags} bags
            </p>

            <p className="text-gray-400 text-xs mt-1">
              Paid: ₹{item.paid} | Pending: ₹{item.pending}
            </p>

            {/* DELETE */}
            <div className="flex justify-end mt-3">
              <button
                onClick={() =>
                  openDeleteModal(item.purchase_id || item.id)
                }
              >
                <IoTrashOutline size={20} color="red" />
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50">

          <div className="bg-white w-full max-w-xs p-5 rounded-2xl text-center shadow-xl">

            <h2 className="text-lg font-bold mb-2">
              Delete Purchase?
            </h2>

            <p className="text-gray-500 mb-4 text-sm">
              {deleting
                ? 'Deleting purchase...'
                : 'Are you sure you want to delete?'}
            </p>

            {/* LOADER */}
            {deleting && (
              <div className="flex justify-center mb-3">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
              </div>
            )}

            <div className="flex justify-between gap-3">

              <button
                onClick={() => setShowModal(false)}
                disabled={deleting}
                className="bg-gray-300 py-2 rounded-xl flex-1"
              >
                Cancel
              </button>

              <button
                onClick={deletePurchase}
                disabled={deleting}
                className="bg-red-500 py-2 rounded-xl flex-1 text-white flex justify-center items-center"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}