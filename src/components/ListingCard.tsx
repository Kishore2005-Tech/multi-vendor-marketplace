/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Listing, Condition } from '../types';
import { Eye, ShieldAlert, ArrowRightLeft, Star } from 'lucide-react';

interface ListingCardProps {
  key?: string;
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
}

export default function ListingCard({ listing, onViewDetails }: ListingCardProps) {
  // Condition badge helper
  const getConditionStyle = (cond: Condition) => {
    switch (cond) {
      case 'like_new':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
          label: 'Like New',
        };
      case 'good':
        return {
          bg: 'bg-green-50 border-green-200 text-green-700',
          dot: 'bg-green-500',
          label: 'Good',
        };
      case 'fair':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
          label: 'Fair Condition',
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          dot: 'bg-slate-400',
          label: 'Used',
        };
    }
  };

  const cond = getConditionStyle(listing.condition);

  return (
    <div 
      id={`listing-card-${listing.id}`}
      onClick={() => onViewDetails(listing)}
      className="bento-card relative group cursor-pointer flex flex-col h-full"
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 glossy-overlay z-0"></div>

      {/* Product Image Frame */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden z-10">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Condition Grade Badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md bg-white/90 select-none font-mono ${cond.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cond.dot} animate-pulse`}></span>
          <span>{cond.label}</span>
        </div>

        {/* Swap Eligible Badge */}
        {listing.swapEligible && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md">
            <ArrowRightLeft className="w-3 h-3 text-teal-600" /> Swap Ok
          </div>
        )}
      </div>

      {/* Card Content body */}
      <div className="p-5 flex-1 flex flex-col justify-between z-10">
        <div>
          {/* Brand & Views stats */}
          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 font-mono uppercase font-semibold mb-1.5">
            <span className="text-slate-500">{listing.brand} • {listing.model || 'Device'}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" /> {listing.views}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-2">
            {listing.title}
          </h4>

          {/* Seller microcard */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg mb-4">
            <span className="text-[10px] text-slate-500 truncate max-w-[120px]">By {listing.sellerName}</span>
            <div className="flex items-center text-amber-500 text-[10px] font-mono font-bold ml-auto">
              <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" /> {listing.sellerRating}
            </div>
          </div>
        </div>

        {/* Pricing/Footer */}
        <div className="flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <span className="text-[10px] text-slate-400 block leading-none font-mono uppercase mb-0.5">Price</span>
            <span className="text-base font-extrabold text-slate-900 font-mono leading-none">
              Rs. {listing.price.toLocaleString()}
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-500 flex items-center gap-1 transition-all">
            Inspect <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
