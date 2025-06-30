'use client';

import Link from 'next/link';

export default function BoltBadge() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link 
        href="https://bolt.new/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block hover:scale-110 transition-transform duration-300"
      >
        <div className="w-[100px] h-[100px] animate-spin-slow">
          <img 
            src="/black_circle_360x360.svg" 
            alt="Bolt.new" 
            className="w-full h-full object-contain"
          />
        </div>
      </Link>
    </div>
  );
}