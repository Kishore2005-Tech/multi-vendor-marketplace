/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Listing, User } from '../types';
import { X, CreditCard, ShieldCheck, Loader2, CheckCircle2, MapPin } from 'lucide-react';

interface CheckoutModalProps {
  listing: Listing;
  currentUser: User | null;
  onClose: () => void;
  onConfirmPayment: (shippingAddress: string) => void;
}

export default function CheckoutModal({
  listing,
  currentUser,
  onClose,
  onConfirmPayment,
}: CheckoutModalProps) {
  const [address, setAddress] = useState(currentUser?.address || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Bill breakdown details
  const platformFee = Math.round(listing.price * 0.015); // 1.5% platform fee
  const shippingFee = 450; // flat rate shipping
  const totalAmount = listing.price + platformFee + shippingFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone) {
      alert('Please fill out the shipping address and phone fields.');
      return;
    }

    setIsProcessing(true);

    // Simulate Razorpay Gateway Response loader
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Confirm payment to parent state
      setTimeout(() => {
        onConfirmPayment(address);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-scale-up">
        
        {/* Close button */}
        {!isProcessing && !paymentSuccess && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-750 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <h3 className="font-extrabold text-lg text-slate-800 mb-1 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" /> Secure Checkout Portal
        </h3>
        <p className="text-slate-500 text-xs mb-5">Checkout via our secure payment gateway in simulated demo mode.</p>

        {isProcessing ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-700">Contacting Gateway...</h4>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Simulating Razorpay test checkout sequence</p>
            </div>
          </div>
        ) : paymentSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center animate-fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
            <div>
              <h4 className="text-base font-bold text-slate-800">Payment Successful!</h4>
              <p className="text-xs text-slate-500 mt-1">Transaction ID: pay_rzp_test_{Math.random().toString(36).substring(2, 9)}</p>
              <p className="text-[10px] text-emerald-600 font-semibold font-mono mt-2 uppercase">Redirecting to order dashboard...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-5">
            {/* Purchase summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-2">Order Summary</span>
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-3">
                <img src={listing.images[0]} alt={listing.title} className="w-12 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h5 className="font-bold text-xs text-slate-800 line-clamp-1">{listing.title}</h5>
                  <span className="text-[10px] text-slate-500">By {listing.sellerName}</span>
                </div>
                <span className="font-mono text-xs text-slate-800 font-bold">Rs. {listing.price.toLocaleString()}</span>
              </div>

              {/* Bill breakdown */}
              <div className="space-y-1.5 text-xs text-slate-500 font-mono">
                <div className="flex justify-between">
                  <span>Device Listing Value:</span>
                  <span>Rs. {listing.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Simulated Escrow Protection Fee:</span>
                  <span>Rs. {platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Secure Courier:</span>
                  <span>Rs. {shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-800 font-bold font-sans">
                  <span>Total Due (INR):</span>
                  <span className="text-sm text-emerald-600 font-mono font-extrabold">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Form parameters */}
            <div className="space-y-3.5">
              <span className="text-xs text-slate-400 font-semibold block uppercase font-mono tracking-wider">Shipping Details</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase font-mono mb-1.5">Contact phone</label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white border border-slate-200 p-2 rounded-lg text-xs text-slate-700 outline-none w-full focus:border-emerald-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block uppercase font-mono mb-1.5">Delivery City/State</label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    placeholder="Bangalore, Karnataka"
                    className="bg-white border border-slate-200 p-2 rounded-lg text-xs text-slate-700 outline-none w-full focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold block uppercase font-mono mb-1.5 font-sans">Full Shipping Address</label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  placeholder="Street details, door number, landmark, pin code..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-white border border-slate-200 p-2 rounded-lg text-xs text-slate-700 outline-none w-full resize-none leading-relaxed focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            {/* Gateway protection tag */}
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-emerald-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simulated Sandbox Checkout. No actual credit cards are billed.</span>
            </div>

            {/* Action buttons */}
            <div className="border-t border-slate-200 pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-checkout"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-emerald-100"
              >
                Simulate Gateway Payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
