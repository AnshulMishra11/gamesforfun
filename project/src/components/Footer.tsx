import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-indigo-600 text-white p-4 text-center">
      <div className="container mx-auto">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart size={16} className="text-red-400 fill-red-400" /> for happy kids
        </p>
        <p className="text-sm mt-2">© 2025 KidsPlay Zone. All games are designed for children.</p>
      </div>
    </footer>
  );
};