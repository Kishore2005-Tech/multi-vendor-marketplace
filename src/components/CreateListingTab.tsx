/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Category, Condition } from '../types';
import { 
  ArrowRight, ArrowLeft, Check, Sparkles, Smartphone, 
  Laptop, Tablet, Watch, Settings, Upload, Eye, Info, AlertTriangle
} from 'lucide-react';

interface CreateListingTabProps {
  currentUser: User | null;
  onSubmit: (formData: any) => void;
  onSuccess: () => void;
}

export default function CreateListingTab({
  currentUser,
  onSubmit,
  onSuccess,
}: CreateListingTabProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('phone');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Condition>('good');
  const [description, setDescription] = useState('');
  const [swapEligible, setSwapEligible] = useState(false);
  const [swapPreferences, setSwapPreferences] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Built-in Unsplash presets depending on categories for clean simulation if they do not want to upload
  const PRESET_IMAGES: Record<Category, string[]> = {
    phone: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&h=450&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&h=450&q=80',
    ],
    laptop: [
      'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&h=450&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&h=450&q=80',
    ],
    tablet: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&h=450&q=80',
    ],
    wearable: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&h=450&q=80',
    ],
    accessory: [
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=600&h=450&q=80',
    ],
  };

  const handleNext = () => {
    if (step === 1 && (!title || !brand || !price)) {
      alert('Please fill out the Title, Brand, and Price fields first.');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const imagesToSubmit = imageUrl ? [imageUrl] : PRESET_IMAGES[category];

    onSubmit({
      sellerId: currentUser?.clerkId,
      title,
      category,
      brand,
      model,
      condition,
      description,
      price: Number(price),
      images: imagesToSubmit,
      swapEligible,
      swapPreferences,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Title */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
          Create New Trade Listing
        </h2>
        <p className="text-slate-500 text-xs md:text-sm">
          Follow our 3-step listing wizard. All uploads are approved instantly by our demo administrator.
        </p>
      </div>

      {/* Progress Stepper tracker */}
      <div className="flex items-center justify-between max-w-lg mx-auto mb-12 relative">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 -translate-y-1/2 z-0"></div>
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>

        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                s < step
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : s === step
                  ? 'bg-white border-emerald-500 text-emerald-600 ring-2 ring-emerald-500/25 shadow-md font-extrabold'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            <span
              className={`text-[10px] uppercase font-mono tracking-wider font-semibold mt-2 ${
                s === step ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {s === 1 ? 'Details' : s === 2 ? 'Grading' : 'Photos'}
            </span>
          </div>
        ))}
      </div>

      {/* Main Multi-Step Form container */}
      <div className="bento-card p-6 md:p-8 bg-white border border-slate-200 shadow-md rounded-2xl relative">
        <div className="absolute inset-0 glossy-overlay z-0"></div>
        <div className="relative z-10">
          {/* Step 1: Device Details */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-2.5">Step 1: Basic Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="text-xs text-slate-500 font-semibold block uppercase font-mono tracking-wider mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['phone', 'laptop', 'tablet'] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {cat === 'phone' ? (
                        <Smartphone className="w-4 h-4 mb-1" />
                      ) : cat === 'laptop' ? (
                        <Laptop className="w-4 h-4 mb-1" />
                      ) : (
                        <Tablet className="w-4 h-4 mb-1" />
                      )}
                      <span className="capitalize">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col justify-end">
                <label className="text-xs text-slate-500 font-semibold block uppercase font-mono tracking-wider mb-2">Listing Title</label>
                <input
                  id="listing-title"
                  type="text"
                  required
                  placeholder="e.g., iPhone 15 Pro Max - 256GB - Blue Titanium"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700 outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Brand */}
              <div>
                <label className="text-xs text-slate-500 font-semibold block uppercase font-mono tracking-wider mb-2">Brand</label>
                <input
                  id="listing-brand"
                  type="text"
                  required
                  placeholder="Apple, Samsung, Sony..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700 outline-none focus:border-emerald-500 w-full shadow-sm"
                />
              </div>

              {/* Model */}
              <div>
                <label className="text-xs text-slate-500 font-semibold block uppercase font-mono tracking-wider mb-2">Model Number / Name</label>
                <input
                  id="listing-model"
                  type="text"
                  placeholder="iPhone 15 Pro Max, XPS 13..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700 outline-none focus:border-emerald-500 w-full shadow-sm"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs text-slate-500 font-semibold block uppercase font-mono tracking-wider mb-2">Target Price (Rs.)</label>
                <input
                  id="listing-price"
                  type="number"
                  required
                  placeholder="95000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700 font-mono outline-none focus:border-emerald-500 w-full shadow-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-slate-500 font-semibold block uppercase font-mono tracking-wider mb-2">Full Device Description</label>
              <textarea
                id="listing-desc"
                required
                placeholder="List any flaws, battery cycle details, screen protector status, inclusions (charger, original box, bill/warranty)..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white border border-slate-200 p-3 rounded-xl text-xs text-slate-700 outline-none focus:border-emerald-500 w-full resize-none leading-relaxed shadow-sm"
              />
            </div>

            {/* Next Button */}
            <div className="border-t border-slate-100 pt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-100"
              >
                Continue to Grading <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Guided Condition Grading */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-2.5">Step 2: Guided Condition Grading System</h3>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              We operate standard grading tiers. Please select the rating that truthfully describes your gadget. Transparent grading builds trust and reduces returned packages.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Like New Card */}
              <button
                type="button"
                onClick={() => setCondition('like_new')}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  condition === 'like_new'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md ring-2 ring-emerald-500/10 scale-102'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-xs font-mono uppercase">Like New (Mint)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Practically indistinguishable from brand new. Battery health is &gt;90%. Zero visible scratches on screens, body frame, or ports. Original box is preferred.
                </p>
              </button>

              {/* Good Card */}
              <button
                type="button"
                onClick={() => setCondition('good')}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  condition === 'good'
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-md ring-2 ring-green-500/10 scale-102'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-bold text-xs font-mono uppercase">Good (Light Wear)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Device works 100% perfectly. Light wear visible on frame or glass under direct lighting. No structural dents, no screen cracks. Ideal balance.
                </p>
              </button>

              {/* Fair Card */}
              <button
                type="button"
                onClick={() => setCondition('fair')}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  condition === 'fair'
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-md ring-2 ring-amber-500/10 scale-102'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="font-bold text-xs font-mono uppercase">Fair Condition</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Visible scratches or small dents on case from dropping. Glass does not contain full cracks, but shows deep scratches. Fully checked and functional.
                </p>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-2.5 text-xs text-slate-500 leading-relaxed">
              <Info className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Note on Admin Audits</span>
                Admin reviews investigate whether descriptions match uploaded photographs. Over-graded listings will be rejected by administrators during verification.
              </div>
            </div>

            {/* Back & Next Navigation */}
            <div className="border-t border-slate-100 pt-6 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Specs
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-100"
              >
                Continue to Photos <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Photos & Swap Eligibilities */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-2.5">Step 3: Photographs & Swap Preferences</h3>
            
            {/* Image Link Input */}
            <div>
              <label className="text-xs text-slate-500 font-semibold block uppercase font-mono tracking-wider mb-2">Product Image Link</label>
              <div className="flex gap-2">
                <input
                  id="listing-image-url"
                  type="url"
                  placeholder="Paste a custom Cloudinary, Unsplash, or Imgur image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700 flex-1 outline-none focus:border-emerald-500 font-mono shadow-sm"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                If left blank, our demo system automatically assigns a premium Unsplash preset photo for the `{category}` category!
              </p>
            </div>

            {/* Swap Switch */}
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Is This Item Swap Eligible?</span>
                  <p className="text-[10px] text-slate-500">Enable this if you are willing to trade/barter this device for other electronics.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    id="checkbox-swap-eligible"
                    type="checkbox"
                    checked={swapEligible}
                    onChange={(e) => setSwapEligible(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 border border-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white shadow-inner"></div>
                </label>
              </div>

              {/* Swap preferences text */}
              {swapEligible && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs text-slate-600 font-semibold block uppercase font-mono tracking-wider">Trading Requirements / Preferences</label>
                  <textarea
                    id="textarea-swap-preferences"
                    placeholder="Specify target electronics, e.g., 'Looking to swap for a flagship iPhone or Galaxy S series. Open to MacBooks as well.'"
                    rows={3}
                    value={swapPreferences}
                    onChange={(e) => setSwapPreferences(e.target.value)}
                    className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-700 outline-none focus:border-emerald-500 w-full resize-none leading-relaxed shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Back & Submit Navigation */}
            <div className="border-t border-slate-100 pt-6 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Grading
              </button>
              <button
                id="btn-submit-listing"
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs px-6 py-2.5 rounded-xl font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-100"
              >
                {isSubmitting ? (
                  <>Uploading Device...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Submit For Admin Review
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
