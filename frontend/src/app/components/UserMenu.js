"use client";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useColorScheme } from '@mui/material/styles';
import { User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { clearUser } from '../slices/userSlice';
import Link from 'next/link';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { mode } = useColorScheme();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const isLoggedIn = user && Object.keys(user).length > 0 && (token || localStorage.getItem('authToken'));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;';
      document.cookie = 'authToken=; path=/; max-age=0;';
    }
    setIsOpen(false);
    window.location.href = '/';
  };

  const handleDashboard = () => {
    setIsOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <a 
        href="/sign-in" 
        className="hidden lg:block bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </a>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          mode === 'dark' 
            ? 'text-gray-200 hover:bg-gray-800 bg-gray-700' 
            : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-200'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          mode === 'dark' ? 'bg-blue-600' : 'bg-blue-100'
        }`}>
          <User size={18} className={mode === 'dark' ? 'text-white' : 'text-blue-600'} />
        </div>
        <span className="text-sm">
          {user?.full_name || user?.name || 'User'}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-20 ${
            mode === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b ${
              mode === 'dark' ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  mode === 'dark' ? 'bg-blue-600' : 'bg-blue-100'
                }`}>
                  <User size={20} className={mode === 'dark' ? 'text-white' : 'text-blue-600'} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    mode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {user?.full_name || 'Guest'}
                  </p>
                  <p className={`text-xs ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <Link
                href="/dashboard"
                onClick={handleDashboard}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  mode === 'dark' 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <LayoutDashboard size={18} />
                Go to Dashboard
              </Link>
              
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  mode === 'dark' 
                    ? 'text-red-400 hover:bg-gray-700' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
                role="menuitem"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
