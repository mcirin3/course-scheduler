'use client';

import Link from 'next/link';
import SearchBar from './SearchBar';

type LayoutProps = {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
};

export default function Layout({ children, onSearch }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 py-3">
  <div className="max-w-screen-lg mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    {/* Brand */}
    <h1 className="text-lg font-bold whitespace-nowrap">Course Scheduler</h1>

    {/* Nav + Search */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto sm:justify-end">
      <nav className="flex space-x-4">
        <Link href="/home">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </nav>
      {onSearch && (
        <div className="w-full sm:w-64 mt-2 sm:mt-0">
          <SearchBar onSearch={onSearch} small />
        </div>
      )}
    </div>
  </div>
</header>


      {/* Main */}
      <main className="flex-grow p-6 bg-gray-100">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-sm text-center p-4">
        <div className="max-w-screen-lg mx-auto">
          <p>© {new Date().getFullYear()} Course Scheduler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
