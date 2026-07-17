/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Listing, User, Condition } from '../types';
import { 
  X, ShieldCheck, Heart, AlertCircle, ArrowRightLeft, 
  MapPin, Phone, MessageSquare, Star, ShoppingCart, Info, Eye
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing;
  currentUser: User | null;
  onClose: () => void;
  onBuyNow: (listing: Listing) => void;
  onMakeSwapOffer: (listing: Listing) => void;
}

export default function ListingDetailModal({
  listing,
  currentUser,
  onClose,
  onBuyNow,
  onMakeSwapOffer,
}: ListingDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Increment view count when loaded
  useEffect(() => {
    fetch(`/api/listings/${listing.id}/view`, { method: 'POST' }).catch((err) =>
      console.error('Error incrementing view count:', err)
    );
  }, [listing.id]);

  const getConditionDetails = (cond: Condition) => {
    switch (cond) {
      case 'like_new':
        return {
          label: 'Like New (Mint)',
          desc: 'Almost perfect. Looks brand new out of the box. No scratches, scuffs, or display blemishes. Fully tested and 100% functional.',
          color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
        };
      case 'good':
        return {
          label: 'Good (Slight Wear)',
          desc: 'Minor cosmetic marks like micro-scratches on back or edges. Screen is clean. No structural damage or cracks. Fully functional.',
          color: 'text-green-700 border-green-200 bg-green-50',
        };
      case 'fair':
        return {
          label: 'Fair Condition',
          desc: 'Visible scratches, slight scuffs, or minor casing dings. Screen may have light blemishes but has no cracks. Priced heavily discounted.',
          color: 'text-amber-700 border-amber-200 bg-amber-50',
        };
      default:
        return {
          label: 'Used',
          desc: 'Shows standard signs of use. Works correctly.',
          color: 'text-slate-700 border-slate-200 bg-slate-50',
        };
    }
  };

  const conditionDetails = getConditionDetails(listing.condition);
  const isOwnListing = currentUser?.clerkId === listing.sellerId;
  const isGuest = !currentUser;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up relative">
        
        {/* Close Button */}
        <button
          id="btn-close-detail"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-750 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
              <img
                src={listing.images[activeImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Status banner */}
              {listing.status !== 'active' && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-xl font-mono uppercase font-bold text-xs tracking-wider">
                    {listing.status}
                  </span>
                </div>
              )}
            </div>

            {/* Micro Gallery Carousels */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      i === activeImageIndex ? 'border-emerald-500 scale-102 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Info Badge */}
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-[11px] text-slate-600 flex gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">AutoBoyexpress.ng Buyer Protection</p>
                <p className="leading-relaxed">All devices submit to admin review. Hand-delivered or shipped using secure escrow.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Listing Metadata */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category Breadcrumb & Views */}
              <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                <span>{listing.category}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" /> {listing.views + 1} Inspects
                </span>
              </div>

              {/* Main Title */}
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug mt-1 mb-3">
                {listing.title}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-mono font-extrabold text-emerald-600">
                  Rs. {listing.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 uppercase font-mono">Test price</span>
              </div>

              {/* Condition grading panel */}
              <div className={`p-3 rounded-xl border ${conditionDetails.color} mb-4`}>
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide mb-1 font-mono">
                  <Info className="w-3.5 h-3.5" /> Condition: {conditionDetails.label}
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{conditionDetails.desc}</p>
              </div>

              {/* Description */}
              <div className="space-y-1 mb-6">
                <span className="text-xs text-slate-400 font-semibold block uppercase font-mono tracking-wider">Device Description</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-3.5 rounded-xl max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Swap preferences */}
              {listing.swapEligible ? (
                <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl text-xs mb-6 text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-teal-700 uppercase tracking-wide mb-1 font-mono">
                    <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Preferences
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    {listing.swapPreferences || 'Open to all equivalent-valued electronics trades.'}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-400 font-mono flex items-center gap-1.5 uppercase mb-6">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Direct cash purchase only. Not swap eligible.
                </div>
              )}

              {/* Seller profile block */}
              <div className="border-t border-slate-100 pt-4 mt-2">
                <span className="text-xs text-slate-400 font-semibold block uppercase font-mono tracking-wider mb-2.5">Seller Information</span>
                <div className="flex items-center gap-3">
                  <img
                    src={listing.images[0] === 'placeholder' ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                    alt={listing.sellerName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">{listing.sellerName}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center text-amber-500 text-[10px] font-mono font-bold">
                        <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> {listing.sellerRating} / 5
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Member Since 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2">
              {isOwnListing ? (
                <div className="w-full text-center text-xs p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium rounded-xl">
                  This is your own listing. You can manage it from your Dashboard.
                </div>
              ) : (
                <>
                  {/* Buy Now button */}
                  <button
                    id="btn-buy-now"
                    onClick={() => onBuyNow(listing)}
                    disabled={listing.status !== 'active'}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-100"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now for Rs. {listing.price.toLocaleString()}
                  </button>

                  {/* Swap Proposal button */}
                  {listing.swapEligible && (
                    <button
                      id="btn-propose-swap"
                      onClick={() => onMakeSwapOffer(listing)}
                      disabled={listing.status !== 'active'}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-50 text-emerald-600 hover:text-emerald-500 font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      Make Swap Proposal
                    </button>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
