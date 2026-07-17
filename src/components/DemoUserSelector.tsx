/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from '../types';
import { Shield, User as UserIcon, RefreshCw } from 'lucide-react';

interface DemoUserSelectorProps {
  users: User[];
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  notificationsCount: number;
}

export default function DemoUserSelector({
  users,
  currentUser,
  onSelectUser,
  notificationsCount,
}: DemoUserSelectorProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-b border-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-50 shadow-sm">
      <div className="flex items-center gap-1.5 text-emerald-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-medium font-mono text-[10px] tracking-wide uppercase">Simulation & Portfolio Mode:</span>
        <span className="text-slate-600">Switch user roles to test cross-user swap proposals, checkout, & admin reviews!</span>
      </div>
      <div className="flex items-center gap-2">
        {users.map((u) => {
          const isActive = currentUser?.clerkId === u.clerkId;
          const isAdmin = u.clerkId === 'user_admin';
          return (
            <button
              key={u.clerkId}
              id={`btn-user-${u.clerkId}`}
              onClick={() => onSelectUser(u)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 border-emerald-500 text-white font-semibold shadow-md shadow-emerald-150 scale-105'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300'
              }`}
            >
              <div className="relative">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-4 h-4 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isAdmin && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-[1px]">
                    <Shield className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <span className="truncate max-w-[100px]">{u.name.split(' ')[0]}</span>
              <span className="text-[9px] opacity-75 font-mono">
                {isAdmin ? 'Admin' : `(${u.rating}★)`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
