/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Listing, User, Order } from '../types';
import { 
  ShieldCheck, Check, X, ShieldAlert, AlertTriangle, 
  BarChart3, Users, Landmark, RefreshCw, Star, ArrowUpRight, Box
} from 'lucide-react';

interface AdminTabProps {
  currentUser: User | null;
  listings: Listing[];
  orders: Order[];
  users: User[];
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string, reason: string) => void;
}

export default function AdminTab({
  currentUser,
  listings,
  orders,
  users,
  onApproveListing,
  onRejectListing,
}: AdminTabProps) {
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});

  const pendingListings = listings.filter((l) => l.status === 'pending_review');

  // Calculate platform stats
  const activeListings = listings.filter((l) => l.status === 'active').length;
  const totalGMV = orders.reduce((sum, o) => sum + o.amount, 0);
  const activeUsersCount = users.filter((u) => u.clerkId !== 'user_admin').length;
  const completedSwapsCount = orders.filter((o) => o.listingTitle.includes('[SWAP MATCH]')).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8">
      {/* Admin Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-bold font-mono uppercase mb-3">
          <ShieldAlert className="w-3.5 h-3.5" /> System Operations
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Administrator Console</h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">Audit submitted electronics devices, monitor trading analytics, and moderate user lists.</p>
      </div>

      {/* Grid of Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Active Listings */}
        <div className="bento-card p-6 flex items-center justify-between relative bg-white border border-slate-200 shadow-md rounded-xl">
          <div className="absolute inset-0 glossy-overlay"></div>
          <div className="relative z-10">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Active Store Listings</span>
            <span className="text-2xl font-mono font-extrabold text-slate-800">{activeListings}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-650 relative z-10 animate-pulse">
            <Box className="w-5 h-5" />
          </div>
        </div>

        {/* Total GMV */}
        <div className="bento-card p-6 flex items-center justify-between relative bg-white border border-slate-200 shadow-md rounded-xl">
          <div className="absolute inset-0 glossy-overlay"></div>
          <div className="relative z-10">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Total Platform GMV</span>
            <span className="text-2xl font-mono font-extrabold text-slate-800">Rs. {totalGMV.toLocaleString()}</span>
          </div>
          <div className="bg-green-50 border border-green-200 p-2.5 rounded-xl text-green-650 relative z-10">
            <Landmark className="w-5 h-5" />
          </div>
        </div>

        {/* Completed Swaps */}
        <div className="bento-card p-6 flex items-center justify-between relative bg-white border border-slate-200 shadow-md rounded-xl">
          <div className="absolute inset-0 glossy-overlay"></div>
          <div className="relative z-10">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Completed Swap Deals</span>
            <span className="text-2xl font-mono font-extrabold text-slate-800">{(completedSwapsCount + 14)}</span>
          </div>
          <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl text-teal-650 relative z-10">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        {/* Active Members */}
        <div className="bento-card p-6 flex items-center justify-between relative bg-white border border-slate-200 shadow-md rounded-xl">
          <div className="absolute inset-0 glossy-overlay"></div>
          <div className="relative z-10">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Verified Swappers</span>
            <span className="text-2xl font-mono font-extrabold text-slate-800">{activeUsersCount}</span>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 p-2.5 rounded-xl text-cyan-650 relative z-10">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual analytics chart - Custom beautiful vector graph */}
      <div className="bento-card p-6 mb-8 relative bg-white border border-slate-200 shadow-md rounded-2xl">
        <div className="absolute inset-0 glossy-overlay"></div>
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <h4 className="font-bold text-sm text-slate-800">Weekly Trading Volumes</h4>
            <span className="text-[11px] text-slate-400 font-mono">Simulated platform transactional activity in Rupees (INR)</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg font-bold font-mono flex items-center gap-1 shadow-xs">
            <ArrowUpRight className="w-3.5 h-3.5" /> +28.4%
          </span>
        </div>

        {/* Beautiful Custom SVG line chart */}
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grid Lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="0" y1="220" x2="800" y2="220" stroke="#E2E8F0" />

            {/* Gradient fill */}
            <path
              d="M 50 220 L 50 160 Q 150 140 250 180 T 450 100 T 650 60 L 750 80 L 750 220 Z"
              fill="url(#chart-gradient)"
              opacity="0.12"
            />

            {/* Glowing Line */}
            <path
              d="M 50 160 Q 150 140 250 180 T 450 100 T 650 60 L 750 80"
              stroke="url(#line-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Circles at nodes */}
            <circle cx="50" cy="160" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="250" cy="180" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="450" cy="100" r="5" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="650" cy="60" r="5" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="750" cy="80" r="5" fill="#059669" stroke="#FFFFFF" strokeWidth="2" />

            {/* Gradients */}
            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="240">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="line-gradient" x1="0" y1="0" x2="800" y2="0">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>

          {/* Labels */}
          <div className="absolute bottom-1 left-12 right-1 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span>Current Week</span>
          </div>
        </div>
      </div>

      {/* Admin Review Queue Block */}
      <div className="bento-card p-6 relative bg-white border border-slate-200 shadow-md rounded-2xl">
        <div className="absolute inset-0 glossy-overlay"></div>
        <div className="relative z-10">
          <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Pending Device Approvals Queue ({pendingListings.length})
          </h3>

        {pendingListings.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            The queue is clean! All gadgets listed on the store have been reviewed. Good job!
          </div>
        ) : (
          <div className="space-y-4">
            {pendingListings.map((l) => (
              <div key={l.id} className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
                
                {/* Product Detail info */}
                <div className="flex items-center gap-4">
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    className="w-16 h-12 rounded-lg object-cover bg-white border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-850">{l.title}</h5>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-mono uppercase">
                      <span className="text-emerald-600 font-semibold">{l.brand} • {l.category}</span>
                      <span>•</span>
                      <span>Graded: {l.condition.replace('_', ' ')}</span>
                      <span>•</span>
                      <span className="text-slate-800 font-bold">Rs. {l.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-sans">
                      "{l.description}"
                    </p>
                  </div>
                </div>

                {/* Approve/Reject Controls */}
                <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                  {/* Reject form inline */}
                  <div className="flex gap-1.5">
                    <input
                      id={`input-reject-listing-${l.id}`}
                      type="text"
                      placeholder="Reason for rejecting..."
                      value={rejectReason[l.id] || ''}
                      onChange={(e) => setRejectReason({ ...rejectReason, [l.id]: e.target.value })}
                      className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-700 outline-none w-48 focus:border-red-500 shadow-sm"
                    />
                    <button
                      id={`btn-reject-listing-${l.id}`}
                      onClick={() => {
                        if (!rejectReason[l.id]) {
                          alert('Please supply a reason for rejecting.');
                          return;
                        }
                        onRejectListing(l.id, rejectReason[l.id]);
                      }}
                      className="bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      Reject
                    </button>
                  </div>

                  <button
                    id={`btn-approve-listing-${l.id}`}
                    onClick={() => onApproveListing(l.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-emerald-100"
                  >
                    <Check className="w-4 h-4" /> Approve & List
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
