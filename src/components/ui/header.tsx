import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button'; // Adjust path if needed
import Link from 'next/link';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBackButton }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-purple-800 text-white">
      {showBackButton && (
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </Link>
      )}
      <h1 className="font-bold text-lg">{title}</h1>
      <div className="w-10" /> {/* Spacer */}
    </header>
  );
};
