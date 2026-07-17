/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Listing, User } from '../types';
import { X, ArrowRightLeft, Sparkles, MessageSquare, AlertCircle, Plus } from 'lucide-react';

interface SwapOfferModalProps {
  targetListing: Listing;
  myActiveListings: Listing[];
  onClose: () => void;
  onSubmitOffer: (proposerListingId: string, cashTopUp: number, message: string) => void;
  onGoToListing: () => void;
}

export default function SwapOfferModal({
  targetListing,
  myActiveListings,
  onClose,
  onSubmitOffer,
  onGoToListing,
}: SwapOfferModalProps) {
  const [selectedMyListingId, setSelectedMyListingId] = useState('');
  const [cashTopUp, setCashTopUp] = useState('0');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMyListingId) {
      alert('Please select one of your gadgets to offer in swap.');
      return;
    }
    onSubmitOffer(selectedMyListingId, Number(cashTopUp), message);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-750 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5" /> Barter Negotiation
          </div>
          <h3 className="font-extrabold text-lg text-slate-800">Make a Swap Proposal</h3>
          <p className="text-slate-500 text-xs mt-0.5">Offer one of your gadgets + custom cash top-ups to swap for "{targetListing.title}".</p>
        </div>

        {myActiveListings.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-4">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No Active Listings to Swap</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You must have at least one active listing in the store to offer as a trade target. Upload a device spec first!
            </p>
            <button
              onClick={onGoToListing}
              className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 mx-auto hover:bg-emerald-500 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> List a Gadget Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Choose my gadget */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block uppercase font-mono tracking-wider mb-2">Select Your Offered Gadget</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-1">
                {myActiveListings.map((l) => {
                  const isSelected = selectedMyListingId === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedMyListingId(l.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/15'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <img src={l.images[0]} alt={l.title} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                      <div className="truncate flex-1">
                        <span className="font-bold text-xs block truncate">{l.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Value: Rs. {l.price.toLocaleString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Cash top up adjustment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block uppercase font-mono tracking-wider mb-1.5">Cash Top Up Adjustment (Rs.)</label>
                <input
                  id="swap-top-up"
                  type="number"
                  placeholder="e.g., 5000"
                  value={cashTopUp}
                  onChange={(e) => setCashTopUp(e.target.value)}
                  className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700 outline-none w-full focus:border-emerald-500 font-mono shadow-sm"
                />
                <span className="text-[9px] text-slate-500 block mt-1 leading-relaxed">
                  Enter a <span className="text-emerald-600 font-bold">positive number</span> if you are paying the seller. Enter a <span className="text-amber-600 font-bold">negative number</span> if you want the seller to pay you extra.
                </span>
              </div>

              {/* Calculated Value Balance */}
              {selectedMyListingId && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono mb-1">Estimated Trade Values:</span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Your Offered Device:</span>
                      <span className="font-mono text-slate-700">
                        Rs. {(myActiveListings.find((l) => l.id === selectedMyListingId)?.price || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cash top up:</span>
                      <span className="font-mono text-slate-700">Rs. {Number(cashTopUp || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold">
                      <span className="text-slate-600">Total offered value:</span>
                      <span className="font-mono text-emerald-600">
                        Rs. {(
                          (myActiveListings.find((l) => l.id === selectedMyListingId)?.price || 0) + Number(cashTopUp || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Target price of their device:</span>
                      <span className="font-mono text-slate-400">Rs. {targetListing.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Proposal Message */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block uppercase font-mono tracking-wider mb-2">Proposal Message</label>
              <textarea
                id="swap-message"
                placeholder="Hi! I noticed you are seeking trades... Let's make a swap deal!"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white border border-slate-200 p-3 rounded-xl text-xs text-slate-700 outline-none w-full resize-none leading-relaxed focus:border-emerald-500 shadow-sm"
              />
            </div>

            {/* Action controls */}
            <div className="border-t border-slate-200 pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-850 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-submit-swap-proposal"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-100 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Propose Swap Deal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
