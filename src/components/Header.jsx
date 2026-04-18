'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // ✅ remove token
    localStorage.removeItem('token');

    // ✅ redirect
    router.replace('/'); // change if needed
  };

  return (
    <div className="bg-red-700 text-white py-3 px-4 flex justify-between items-center">

      {/* TITLE */}
      <h1 className="font-bold text-lg">
        Jai Sriram
      </h1>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="text-sm bg-white/20 px-3 py-1 rounded-md"
      >
        Logout
      </button>

    </div>
  );
}