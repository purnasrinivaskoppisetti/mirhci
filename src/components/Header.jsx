'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/');
  };

  return (
    <header className="bg-red-700 text-white shadow-md">

      <div className="flex items-center justify-between px-3 sm:px-5 py-2.5">

        {/* LEFT: LOGO + TITLE */}
        <div
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
        >
          {/* LOGO */}
          <Image
            src="/logo.png"   // 👉 put your logo in /public/logo.png
            alt="Mirchi Mart"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            priority
          />

          {/* TITLE */}
          <h1 className="text-sm sm:text-lg font-semibold whitespace-nowrap">
            Mirchi Mart
          </h1>
        </div>

        {/* RIGHT: LOGOUT */}
        <button
          onClick={handleLogout}
          className="text-xs sm:text-sm bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-md"
        >
          Logout
        </button>

      </div>

    </header>
  );
}