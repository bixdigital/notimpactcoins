import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  const tabs = [
    { name: '← Back to Home', icon: <CheckCircle className="mt-6 text-white" />, path: './' },
  ];

  return (
    <nav className="flex justify-around p-4 bg-purple-900 text-white">
      {tabs.map((tab) => (
        <Link key={tab.name} href={tab.path}>
          <div
            className={`flex flex-col items-center ${
              activeTab === tab.name.toLowerCase() ? 'text-yellow-400' : ''
            }`}
          >
            {tab.icon}
            <span className="text-xs">{tab.name}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
};
