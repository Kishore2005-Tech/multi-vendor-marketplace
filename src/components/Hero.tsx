/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowRightLeft, Smartphone, Laptop, Tablet, Watch, 
  Settings, Search, ArrowRight, ShieldCheck, CheckCircle, RefreshCcw 
} from 'lucide-react';
import { Category } from '../types';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (cat: Category | 'all') => void;
  onQuickSearch: () => void;
  stats: {
    totalListings: number;
    totalSwaps: number;
    activeUsers: number;
  };
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onQuickSearch,
  stats,
}: HeroProps) {
  const categories: { label: string; value: Category | 'all'; icon: React.ReactNode }[] = [
    { label: 'All Items', value: 'all', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { label: 'Smartphones', value: 'phone', icon: <Smartphone className="w-4 h-4" /> },
    { label: 'Laptops', value: 'laptop', icon: <Laptop className="w-4 h-4" /> },
    { label: 'Tablets', value: 'tablet', icon: <Tablet className="w-4 h-4" /> },
    { label: 'Wearables', value: 'wearable', icon: <Watch className="w-4 h-4" /> },
    { label: 'Accessories', value: 'accessory', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="relative py-12 md:py-16 px-4 md:px-8 bg-gradient-to-b from-emerald-50/40 via-white to-white overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] font-semibold text-emerald-700 mb-6 font-mono tracking-wide uppercase select-none animate-fade-in">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure Electronics Trade Network
        </div>

        {/* Main Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto mb-4 leading-tight text-slate-900">
          Buy, Sell, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500">Swap Electronics</span> Instantly
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          The ultimate verified tech marketplace. Upgrade your gadgets by trading with verified peers, buy certified pre-owned items directly, or sell your old gear securely.
        </p>

        {/* Unified Search Engine */}
        <div className="max-w-xl mx-auto bg-white border border-slate-200 p-2 rounded-2xl flex items-center shadow-lg shadow-slate-100 mb-10 gap-2">
          <div className="flex-1 flex items-center pl-3 gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              id="hero-search-input"
              type="text"
              placeholder="Search by model, brand, e.g., 'MacBook M2' or 'iPhone 15'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-800 outline-none w-full placeholder-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onQuickSearch();
              }}
            />
          </div>
          <button
            id="btn-hero-search"
            onClick={onQuickSearch}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            Find Gear
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Pills Navigation Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-16">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                id={`btn-cat-${cat.value}`}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm scale-102'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* How It Works Explainer Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left mb-16 border-t border-slate-800/60 pt-16">
          <div className="bento-card p-6 relative group">
            <div className="absolute inset-0 glossy-overlay"></div>
            <div className="absolute top-0 right-0 p-8 text-5xl font-mono text-slate-200 pointer-events-none group-hover:text-emerald-500/10 transition-colors">01</div>
            <div className="relative z-10">
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl w-fit text-emerald-600 mb-4 shadow-sm">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Buy Securely</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Purchase listings using our simulated secure checkout. Funds are escrowed until the device undergoes condition match.
              </p>
            </div>
          </div>

          <div className="bento-card p-6 relative group">
            <div className="absolute inset-0 glossy-overlay"></div>
            <div className="absolute top-0 right-0 p-8 text-5xl font-mono text-slate-200 pointer-events-none group-hover:text-green-500/10 transition-colors">02</div>
            <div className="relative z-10">
              <div className="bg-green-50 border border-green-100 p-3 rounded-xl w-fit text-green-600 mb-4 shadow-sm">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Barter & Swap</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Match your gadget with others. Propose trades with cash top-up balances, bargain with messages, and finalize swap swaps smoothly.
              </p>
            </div>
          </div>

          <div className="bento-card p-6 relative group">
            <div className="absolute inset-0 glossy-overlay"></div>
            <div className="absolute top-0 right-0 p-8 text-5xl font-mono text-slate-200 pointer-events-none group-hover:text-teal-500/10 transition-colors">03</div>
            <div className="relative z-10">
              <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl w-fit text-teal-600 mb-4 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Verified Integrity</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every listing is reviewed by administrators. Color-coded graded condition tiers guarantee absolute clarity for your purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Counter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 bento-card px-8 py-5 max-w-3xl mx-auto relative">
          <div className="absolute inset-0 glossy-overlay"></div>
          <div className="text-center z-10">
            <div className="text-xl md:text-2xl font-mono font-bold text-emerald-600">{(stats.totalListings + 42)}</div>
            <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider font-semibold">Active Listings</div>
          </div>
          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block z-10"></div>
          <div className="text-center z-10">
            <div className="text-xl md:text-2xl font-mono font-bold text-green-600">{(stats.totalSwaps + 14)}</div>
            <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider font-semibold">Successful Swaps</div>
          </div>
          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block z-10"></div>
          <div className="text-center z-10">
            <div className="text-xl md:text-2xl font-mono font-bold text-slate-800">{stats.activeUsers}</div>
            <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider font-semibold">Verified Swappers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
