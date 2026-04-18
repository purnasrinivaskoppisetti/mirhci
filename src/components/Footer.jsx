'use client';

import { usePathname, useRouter } from 'next/navigation';
import { IoHome, IoAddCircle, IoTime, IoPeople } from 'react-icons/io5';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', path: '/dashboard', icon: IoHome },
    { name: 'New', path: '/new-purchase', icon: IoAddCircle },
    { name: 'History', path: '/history', icon: IoTime },
    { name: 'Customer', path: '/customers', icon: IoPeople },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-gray-800 z-50">
      <div className="max-w-md mx-auto flex justify-around py-2">

        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.path);

          return (
            <button
              key={i}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center"
            >
              <Icon
                size={22}
                color={isActive ? '#ffcc00' : '#aaa'}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-[#ffcc00]' : 'text-[#aaa]'
                }`}
              >
                {tab.name}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}