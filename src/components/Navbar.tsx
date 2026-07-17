/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Notification } from '../types';
import { 
  ShoppingBag, HelpCircle, Bell, User as UserIcon, 
  ChevronDown, ShieldAlert, CheckCircle2, AlertTriangle, MessageSquare, Award
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'browse' | 'sell' | 'dashboard' | 'admin';
  setActiveTab: (tab: 'browse' | 'sell' | 'dashboard' | 'admin') => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
}

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
}: NavbarProps) {
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Toggle notification panel
  const handleBellClick = () => {
    setShowBellDropdown(!showBellDropdown);
  };

  // Close bell dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setShowBellDropdown(false);
    if (showBellDropdown) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showBellDropdown]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'order_update':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'listing_approved':
        return <Award className="w-4 h-4 text-green-500" />;
      case 'listing_rejected':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'review_received':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const isAdmin = currentUser?.clerkId === 'user_admin';

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('browse')} 
        className="flex items-center gap-2 cursor-pointer group select-none"
      >
        <div className="bg-gradient-to-tr from-emerald-600 to-green-400 p-2 rounded-xl text-slate-950 font-extrabold shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-all">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-lg md:text-xl tracking-tight text-slate-900">
            AutoBoy<span className="text-emerald-600">express.ng</span>
          </span>
          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">
            Swap & Buy Network
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="hidden md:flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1.5 rounded-xl">
        <button
          id="nav-tab-browse"
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
              : 'text-slate-600 hover:text-emerald-600'
          }`}
        >
          Explore Listings
        </button>
        <button
          id="nav-tab-sell"
          onClick={() => setActiveTab('sell')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === 'sell'
              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
              : 'text-slate-600 hover:text-emerald-600'
          }`}
        >
          Sell / Swap Custom Listing
        </button>
        <button
          id="nav-tab-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
              : 'text-slate-600 hover:text-emerald-600'
          }`}
        >
          My Dashboard
        </button>
        {isAdmin && (
          <button
            id="nav-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border border-amber-500/30 text-amber-600 bg-amber-50 hover:bg-amber-100/50 transition-all cursor-pointer`}
          >
            Admin Panel
          </button>
        )}
      </div>

      {/* Mobile view icons + Notifications & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Quick sell on mobile */}
        <button
          onClick={() => setActiveTab('sell')}
          className="md:hidden bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium cursor-pointer"
        >
          + List
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            id="btn-bell"
            onClick={handleBellClick}
            className="p-2 text-slate-500 hover:text-emerald-600 bg-slate-50 border border-slate-200 rounded-xl relative transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showBellDropdown && (
            <div className="absolute right-0 mt-2.5 w-80 md:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-scale-up">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-xs tracking-wide uppercase text-slate-700">
                  Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsAsRead}
                    className="text-[10px] text-emerald-600 hover:text-emerald-500 font-medium cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 flex gap-2.5 ${
                        !n.read ? 'bg-emerald-50/30' : 'opacity-80'
                      }`}
                    >
                      <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                      <div className="flex-1">
                        <p className="text-slate-800 font-normal leading-relaxed">
                          {n.message}
                        </p>
                        <span className="text-[9px] text-slate-400 font-mono block mt-1">
                          {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => onMarkNotificationAsRead(n.id)}
                          className="text-[10px] text-emerald-600 hover:text-emerald-500 self-center font-mono font-bold px-1 cursor-pointer"
                          title="Mark as read"
                        >
                          ●
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        {currentUser && (
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2 pl-1.5 py-1 pr-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:border-slate-300 transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-semibold text-slate-700 truncate max-w-[80px]">
                {currentUser.name.split(' ')[0]}
              </div>
              <div className="text-[8px] text-slate-400 font-mono truncate max-w-[80px]">
                {isAdmin ? 'System Admin' : 'Buyer/Seller'}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
