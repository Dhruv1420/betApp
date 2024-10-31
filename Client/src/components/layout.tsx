// src/components/Layout.tsx

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold">Victory Online</h1>
      </header>
      <main className="flex-grow p-6">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Victory Online. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
