/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Listing, Order, SwapOffer, Review } from '../types';
import { 
  Plus, Check, X, ShieldAlert, Award, Star, MessageSquare, 
  MapPin, ShoppingCart, RefreshCw, Box, Heart, FileText, ArrowRightLeft, Ship, Home, Smile
} from 'lucide-react';

interface DashboardTabProps {
  currentUser: User | null;
  listings: Listing[];
  orders: Order[];
  swaps: SwapOffer[];
  reviews: Review[];
  onAcceptSwap: (swapId: string) => void;
  onRejectSwap: (swapId: string, message: string) => void;
  onShipOrder: (orderId: string) => void;
  onDeliverOrder: (orderId: string) => void;
  onAddReview: (revieweeId: string, rating: number, comment: string, targetType: 'order' | 'swap', targetId: string) => void;
  onNewListingClick: () => void;
}

export default function DashboardTab({
  currentUser,
  listings,
  orders,
  swaps,
  reviews,
  onAcceptSwap,
  onRejectSwap,
  onShipOrder,
  onDeliverOrder,
  onAddReview,
  onNewListingClick,
}: DashboardTabProps) {
  const [subTab, setSubTab] = useState<'listings' | 'orders' | 'swaps' | 'reviews'>('listings');
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [reviewComment, setReviewComment] = useState<Record<string, string>>({});
  const [reviewRating, setReviewRating] = useState<Record<string, number>>({});
  const [showReviewForm, setShowReviewForm] = useState<Record<string, boolean>>({});

  const myId = currentUser?.clerkId;

  // Filter local data
  const myListings = listings.filter((l) => l.sellerId === myId);
  
  // Purchases (orders where I am the buyer) and Sales (orders where I am the seller)
  const myPurchases = orders.filter((o) => o.buyerId === myId);
  const mySales = orders.filter((o) => o.sellerId === myId);

  // Swaps sent by me vs. Swaps received by me
  const mySwapsSent = swaps.filter((s) => s.proposerId === myId);
  const mySwapsReceived = swaps.filter((s) => s.targetSellerId === myId);

  // Reviews received vs. Reviews left
  const reviewsReceived = reviews.filter((r) => r.revieweeId === myId);
  const reviewsLeft = reviews.filter((r) => r.reviewerId === myId);

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold uppercase rounded-lg">Paid</span>;
      case 'shipped':
        return <span className="px-2 py-1 bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-mono font-bold uppercase rounded-lg">Shipped</span>;
      case 'delivered':
        return <span className="px-2 py-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-mono font-bold uppercase rounded-lg">Delivered</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-rose-50 border border-rose-200 text-rose-750 text-[10px] font-mono font-bold uppercase rounded-lg">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold uppercase rounded-lg">{status}</span>;
    }
  };

  const getSwapStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold uppercase rounded-full">Pending Response</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold uppercase rounded-full">Accepted / Swapped</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[9px] font-bold uppercase rounded-full">Declined</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase rounded-full">{status}</span>;
    }
  };

  const handleReviewSubmit = (revieweeId: string, targetType: 'order' | 'swap', targetId: string) => {
    const rating = reviewRating[targetId] || 5;
    const comment = reviewComment[targetId] || 'Great trade experience! Highly recommended.';

    onAddReview(revieweeId, rating, comment, targetType, targetId);

    // reset forms
    setShowReviewForm({ ...showReviewForm, [targetId]: false });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8">
      {/* Dashboard Top Banner */}
      <div className="bento-card p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative bg-white border border-slate-200 shadow-md rounded-2xl">
        <div className="absolute inset-0 glossy-overlay"></div>
        
        {/* User Card info */}
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-inner bg-slate-55 shadow-emerald-500/10"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">{currentUser?.name}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {currentUser?.rating} Seller Rating
              </span>
              <span>•</span>
              <span className="font-mono">Sales: {currentUser?.totalSales}</span>
              <span>•</span>
              <span className="font-mono">Purchases: {currentUser?.totalPurchases}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3" /> {currentUser?.address}
            </div>
          </div>
        </div>

        <button
          id="btn-dashboard-new-listing"
          onClick={onNewListingClick}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-100 shrink-0 self-stretch md:self-center justify-center relative z-10 font-mono tracking-wide"
        >
          <Plus className="w-4 h-4" /> Create Trade Listing
        </button>
      </div>

      {/* Profile subnavigation buttons */}
      <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'listings', label: `My Devices (${myListings.length})`, icon: <Box className="w-4 h-4" /> },
          { id: 'orders', label: `Orders & Shipments (${myPurchases.length + mySales.length})`, icon: <ShoppingCart className="w-4 h-4" /> },
          { id: 'swaps', label: `Swap Proposals (${mySwapsSent.length + mySwapsReceived.length})`, icon: <RefreshCw className="w-4 h-4" /> },
          { id: 'reviews', label: `Trust Reviews (${reviewsReceived.length})`, icon: <Award className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`dashboard-subtab-${tab.id}`}
            onClick={() => setSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === tab.id
                ? 'border-emerald-500 text-emerald-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-850'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render subtabs content */}
      <div className="space-y-6">
        
        {/* Listings Subtab */}
        {subTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.length === 0 ? (
              <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 py-16 px-4 text-center rounded-2xl">
                <Box className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700 mb-1">No Devices Listed Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">You have not uploaded any gadget listings for trade or sale.</p>
                <button
                  onClick={onNewListingClick}
                  className="bg-white border border-slate-200 text-slate-700 text-xs px-4 py-2 rounded-xl hover:bg-slate-50 cursor-pointer font-semibold shadow-sm"
                >
                  List Your First Gadget
                </button>
              </div>
            ) : (
              myListings.map((l) => {
                const isPending = l.status === 'pending_review';
                const isRejected = l.status === 'rejected';
                return (
                  <div key={l.id} className="bento-card relative flex flex-col justify-between bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 glossy-overlay z-0"></div>
                    <div className="relative z-10">
                      <div className="relative aspect-video bg-slate-50">
                        <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        
                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-250 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md bg-white/80 select-none">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            l.status === 'active' ? 'bg-emerald-500' : isPending ? 'bg-amber-500' : isRejected ? 'bg-rose-500' : 'bg-slate-400'
                          } animate-pulse`}></span>
                          <span className={l.status === 'active' ? 'text-emerald-700' : isPending ? 'text-amber-700' : isRejected ? 'text-rose-700' : 'text-slate-500'}>
                            {l.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{l.title}</h4>
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-slate-400">Target Value:</span>
                          <span className="text-emerald-600 font-extrabold">Rs. {l.price.toLocaleString()}</span>
                        </div>

                        {/* Administrative details */}
                        {isRejected && l.rejectionReason && (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[10px] text-rose-700 leading-relaxed">
                            <span className="font-bold">Rejection Note:</span> {l.rejectionReason}
                          </div>
                        )}
                        
                        {isPending && (
                          <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-amber-700 leading-relaxed">
                            Pending administrator review. Usually processed within minutes for demos!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Orders & Shipments Subtab */}
        {subTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Sales Section (Things I Sold/Need to Ship) */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Ship className="w-4 h-4 text-emerald-600" /> Sales & Shipments needing fulfillment ({mySales.length})
              </h3>
              
              {mySales.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-6 text-center text-xs text-slate-500 rounded-xl">
                  No devices sold yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {mySales.map((o) => (
                    <div key={o.id} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-center gap-3">
                        <img src={o.listingImage} alt={o.listingTitle} className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-200" referrerPolicy="no-referrer" />
                        <div>
                          <h5 className="font-bold text-xs text-slate-800">{o.listingTitle}</h5>
                          <p className="text-[10px] text-slate-500 mt-0.5">Purchased by <span className="text-slate-700 font-semibold">{o.buyerName}</span> • Rs. {o.amount.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5 leading-relaxed">Fulfillment Address: {o.shippingAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        {getOrderStatusBadge(o.status)}
                        
                        {/* Shipment controls */}
                        {o.status === 'paid' && (
                          <button
                            id={`btn-ship-${o.id}`}
                            onClick={() => onShipOrder(o.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {o.status === 'shipped' && (
                          <div className="text-[10px] text-slate-400 font-mono italic">Waiting for delivery...</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Purchases Section */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-600" /> My Purchases ({myPurchases.length})
              </h3>

              {myPurchases.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-6 text-center text-xs text-slate-500 rounded-xl">
                  You have not purchased any items.
                </div>
              ) : (
                <div className="space-y-3">
                  {myPurchases.map((o) => {
                    const hasReviewed = reviewsLeft.some((r) => r.targetId === o.id);
                    return (
                      <div key={o.id} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-3 shadow-xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={o.listingImage} alt={o.listingTitle} className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-200" referrerPolicy="no-referrer" />
                            <div>
                              <h5 className="font-bold text-xs text-slate-800">{o.listingTitle}</h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">Seller: {o.sellerName} • Amount: Rs. {o.amount.toLocaleString()}</p>
                              <span className="text-[9px] text-slate-400 font-mono block">Order ID: {o.id}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end md:self-center">
                            {getOrderStatusBadge(o.status)}

                            {/* Mark Delivered */}
                            {o.status === 'shipped' && (
                              <button
                                id={`btn-deliver-${o.id}`}
                                onClick={() => onDeliverOrder(o.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Review options */}
                        {o.status === 'delivered' && !hasReviewed && (
                          <div className="border-t border-slate-100 pt-3 mt-1 flex flex-col gap-2">
                            {!showReviewForm[o.id] ? (
                              <button
                                onClick={() => setShowReviewForm({ ...showReviewForm, [o.id]: true })}
                                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5" /> Rate this trade experience with {o.sellerName}
                              </button>
                            ) : (
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                                <div className="flex items-center gap-4">
                                  <span className="text-xs text-slate-600 font-bold">Your Rating:</span>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating({ ...reviewRating, [o.id]: star })}
                                        className="text-amber-400 focus:outline-none cursor-pointer"
                                      >
                                        <Star
                                          className={`w-4 h-4 ${
                                            star <= (reviewRating[o.id] || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <textarea
                                    placeholder="Write a custom review for the seller (e.g., fast shipment, matching device condition)..."
                                    rows={2}
                                    value={reviewComment[o.id] || ''}
                                    onChange={(e) => setReviewComment({ ...reviewComment, [o.id]: e.target.value })}
                                    className="bg-white border border-slate-200 p-2 rounded-lg text-xs text-slate-700 outline-none w-full shadow-sm focus:border-emerald-500"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setShowReviewForm({ ...showReviewForm, [o.id]: false })}
                                    className="px-2.5 py-1 text-[10px] text-slate-400 hover:text-slate-600"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleReviewSubmit(o.sellerId, 'order', o.id)}
                                    className="bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-lg font-semibold cursor-pointer shadow-xs"
                                  >
                                    Submit Review
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Swap Proposals Subtab */}
        {subTab === 'swaps' && (
          <div className="space-y-6">
            
            {/* Swaps RECEIVED (Action needed) */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600" /> Swap proposals received from buyers ({mySwapsReceived.length})
              </h3>

              {mySwapsReceived.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-6 text-center text-xs text-slate-500 rounded-xl">
                  No swap proposals received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {mySwapsReceived.map((s) => {
                    const isPending = s.status === 'pending';
                    return (
                      <div key={s.id} className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col gap-4 shadow-sm">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-450">Proposal from</span>
                            <span className="text-xs font-bold text-slate-800">{s.proposerName}</span>
                          </div>
                          {getSwapStatusBadge(s.status)}
                        </div>

                        {/* Trade Visualizer */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                          {/* Seller product */}
                          <div className="flex flex-col items-center">
                            <img src={s.targetListingImage} alt="Target" className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200" referrerPolicy="no-referrer" />
                            <span className="text-[10px] text-slate-400 mt-1 block font-mono">Your Device</span>
                            <span className="font-bold text-xs text-slate-800 line-clamp-1">{s.targetListingTitle}</span>
                          </div>

                          {/* Swap Indicator arrows */}
                          <div className="flex flex-col items-center py-2">
                            <ArrowRightLeft className="w-6 h-6 text-emerald-600" />
                            {s.cashTopUp !== 0 && (
                              <div className="mt-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-extrabold rounded-lg">
                                {s.cashTopUp > 0 ? `+ Rs. ${s.cashTopUp.toLocaleString()} Top Up` : `- Rs. ${Math.abs(s.cashTopUp).toLocaleString()} Pay Seller`}
                              </div>
                            )}
                          </div>

                          {/* Proposer product */}
                          <div className="flex flex-col items-center">
                            <img src={s.proposerListingImage} alt="Proposed" className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200" referrerPolicy="no-referrer" />
                            <span className="text-[10px] text-slate-400 mt-1 block font-mono">Their Offered Device</span>
                            <span className="font-bold text-xs text-slate-800 line-clamp-1">{s.proposerListingTitle}</span>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-xs leading-relaxed text-slate-600">
                          <span className="font-bold text-slate-450 font-mono text-[10px] uppercase block mb-1">Message from {s.proposerName}:</span>
                          "{s.message}"
                        </div>

                        {/* Action buttons */}
                        {isPending && (
                          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
                            {/* Reject / decline forms */}
                            <div className="flex-1 flex gap-2">
                              <input
                                id={`input-reject-swap-${s.id}`}
                                type="text"
                                placeholder="Reason for decline (optional)..."
                                value={rejectReason[s.id] || ''}
                                onChange={(e) => setRejectReason({ ...rejectReason, [s.id]: e.target.value })}
                                className="bg-white border border-slate-200 p-2 rounded-lg text-xs text-slate-700 flex-1 outline-none focus:border-red-400 shadow-sm"
                              />
                              <button
                                id={`btn-reject-swap-${s.id}`}
                                onClick={() => onRejectSwap(s.id, rejectReason[s.id] || '')}
                                className="bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs px-3.5 py-2 rounded-xl transition-all font-semibold cursor-pointer shadow-xs"
                              >
                                Decline
                              </button>
                            </div>

                            <button
                              id={`btn-accept-swap-${s.id}`}
                              onClick={() => onAcceptSwap(s.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-100"
                            >
                              Accept Swap Deal
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Swaps SENT */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Swap offers you sent to sellers ({mySwapsSent.length})
              </h3>

              {mySwapsSent.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-6 text-center text-xs text-slate-500 rounded-xl">
                  You have not submitted any swap proposals.
                </div>
              ) : (
                <div className="space-y-4">
                  {mySwapsSent.map((s) => (
                    <div key={s.id} className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col gap-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs text-slate-400 font-semibold font-mono uppercase">PROPOSAL ID: {s.id}</span>
                        {getSwapStatusBadge(s.status)}
                      </div>

                      {/* Info Row */}
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex-1">
                          <span className="text-[10px] text-slate-400 block font-mono">YOU OFFERED:</span>
                          <span className="font-bold text-slate-800">{s.proposerListingTitle}</span>
                        </div>
                        <div className="text-center font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono">
                          {s.cashTopUp > 0 ? `+ Rs. ${s.cashTopUp.toLocaleString()}` : `- Rs. ${Math.abs(s.cashTopUp).toLocaleString()}`}
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-[10px] text-slate-400 block font-mono">FOR THEIR:</span>
                          <span className="font-bold text-slate-800">{s.targetListingTitle}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Subtab */}
        {subTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
              Reviews left by other traders ({reviewsReceived.length})
            </h3>

            {reviewsReceived.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 py-12 px-4 text-center text-xs text-slate-500 rounded-xl">
                <Smile className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                No reviews received yet. Finalize purchases or swaps to collect reputation ratings!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsReceived.map((r) => (
                  <div key={r.id} className="bg-white border border-slate-200 p-4.5 rounded-xl flex gap-3 shadow-xs">
                    <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 h-fit">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-850">{r.reviewerName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs mt-1.5 leading-relaxed italic">
                        "{r.comment}"
                      </p>
                      <span className="text-[9px] text-slate-400 block mt-1.5 font-mono">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
