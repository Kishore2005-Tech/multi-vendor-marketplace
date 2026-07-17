/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, Listing, Order, SwapOffer, Review, Notification, Category, Condition 
} from './types';
import DemoUserSelector from './components/DemoUserSelector';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListingCard from './components/ListingCard';
import ListingDetailModal from './components/ListingDetailModal';
import CreateListingTab from './components/CreateListingTab';
import DashboardTab from './components/DashboardTab';
import AdminTab from './components/AdminTab';
import SwapOfferModal from './components/SwapOfferModal';
import CheckoutModal from './components/CheckoutModal';
import { Sparkles, ArrowRightLeft, ShieldCheck, Star, Clock } from 'lucide-react';

export default function App() {
  // Top Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<'browse' | 'sell' | 'dashboard' | 'admin'>('browse');

  // Main Database State
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [swaps, setSwaps] = useState<SwapOffer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<Condition | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Interactive Modals State
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [checkoutListing, setCheckoutListing] = useState<Listing | null>(null);
  const [swapListing, setSwapListing] = useState<Listing | null>(null);

  // Stats Counters
  const [stats, setStats] = useState({
    totalListings: 7,
    totalSwaps: 1,
    activeUsers: 3
  });

  // Global loading
  const [isLoading, setIsLoading] = useState(true);

  // Fetch full data from Express REST API endpoints
  const fetchAllData = async (userClerkId?: string) => {
    try {
      const activeClerkId = userClerkId || currentUser?.clerkId || 'user_1';

      // Load Users
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Locate active user
      const foundUser = usersData.find((u: User) => u.clerkId === activeClerkId);
      if (foundUser) {
        setCurrentUser(foundUser);
      }

      // Build listing query string with filters
      let listingsUrl = '/api/listings?';
      if (selectedCategory !== 'all') listingsUrl += `category=${selectedCategory}&`;
      if (selectedCondition !== 'all') listingsUrl += `condition=${selectedCondition}&`;
      if (searchQuery) listingsUrl += `search=${encodeURIComponent(searchQuery)}&`;
      listingsUrl += `sortBy=${sortBy}`;

      const listingsRes = await fetch(listingsUrl);
      const listingsData = await listingsRes.json();
      setListings(listingsData);

      // Load Orders
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      // Load Swaps
      const swapsRes = await fetch('/api/swaps');
      const swapsData = await swapsRes.json();
      setSwaps(swapsData);

      // Load Reviews
      const reviewsRes = await fetch('/api/reviews');
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);

      // Load Notifications for current active user
      const notsRes = await fetch(`/api/notifications?userId=${activeClerkId}`);
      const notsData = await notsRes.json();
      setNotifications(notsData);

      // Update basic counts
      setStats({
        totalListings: listingsData.filter((l: Listing) => l.status === 'active').length,
        totalSwaps: swapsData.filter((s: SwapOffer) => s.status === 'accepted').length,
        activeUsers: usersData.filter((u: User) => u.clerkId !== 'user_admin').length
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data from API backend:', error);
      setIsLoading(false);
    }
  };

  // Initial Boot loader
  useEffect(() => {
    fetchAllData();
  }, [selectedCategory, selectedCondition, sortBy]);

  // Real-time notification polling interval (Polls every 5s for rapid UI update feels during demos!)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, selectedCategory, selectedCondition, sortBy, searchQuery]);

  // User Switching control
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    fetchAllData(user.clerkId);
    // Auto shift tab if trying to access admin restricted tab
    if (user.clerkId !== 'user_admin' && activeTab === 'admin') {
      setActiveTab('browse');
    }
  };

  // Search Execution trigger
  const handleSearchSubmit = () => {
    fetchAllData();
  };

  // Submit Listing via REST
  const handleCreateListing = async (formData: any) => {
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchAllData();
        // Clear forms, shift to dashboard tab to view pending queue
        setActiveTab('dashboard');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit listing.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Approval Processors
  const handleApproveListing = async (id: string) => {
    try {
      const res = await fetch(`/api/listings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectListing = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/listings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Checkout payment Processor
  const handleConfirmCheckout = async (shippingAddress: string) => {
    if (!checkoutListing || !currentUser) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: currentUser.clerkId,
          listingId: checkoutListing.id,
          shippingAddress
        })
      });
      if (res.ok) {
        // Clear modals
        setCheckoutListing(null);
        setSelectedListing(null);
        // Switch to dashboard
        setActiveTab('dashboard');
        fetchAllData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to complete transaction.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Swap Proposals processor
  const handleSubmitSwapOffer = async (proposerListingId: string, cashTopUp: number, message: string) => {
    if (!swapListing || !currentUser) return;
    try {
      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposerId: currentUser.clerkId,
          proposerListingId,
          targetListingId: swapListing.id,
          cashTopUp,
          message
        })
      });
      if (res.ok) {
        // Clear modals
        setSwapListing(null);
        setSelectedListing(null);
        // Switch to dashboard
        setActiveTab('dashboard');
        fetchAllData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit trade offer.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptSwap = async (swapId: string) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectSwap = async (swapId: string, reason: string) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', message: reason })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Order Shipments trackers
  const handleShipOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shipped' })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeliverOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Review Submissions
  const handleAddReview = async (revieweeId: string, rating: number, comment: string, targetType: 'order' | 'swap', targetId: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerId: currentUser?.clerkId,
          revieweeId,
          rating,
          comment,
          targetType,
          targetId
        })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Notification read controllers
  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.clerkId })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-800">
      
      {/* Simulation Selector Bar */}
      <DemoUserSelector
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        notificationsCount={notifications.filter(n => !n.read).length}
      />

      {/* Main Header Nav */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      />

      {/* Views Router */}
      <main className="flex-grow">
        {activeTab === 'browse' && (
          <div className="space-y-12 pb-16">
            {/* Interactive Hero Banner */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onQuickSearch={handleSearchSubmit}
              stats={stats}
            />

            {/* Filter controls & browse list grid */}
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-8">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800">Available Listings</h3>
                  <p className="text-slate-500 text-xs">Inspected pre-owned and barter-eligible gear ready for swap.</p>
                </div>

                {/* Micro selectors filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Conditions */}
                  <select
                    id="select-filter-condition"
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value as any)}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 outline-none hover:border-emerald-500 font-medium shadow-sm"
                  >
                    <option value="all">All Conditions</option>
                    <option value="like_new">Like New (Mint)</option>
                    <option value="good">Good (Light Wear)</option>
                    <option value="fair">Fair (Discounted)</option>
                  </select>

                  {/* Sorter */}
                  <select
                    id="select-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 outline-none hover:border-emerald-500 font-medium shadow-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="views">Most Popular (Views)</option>
                  </select>
                </div>
              </div>

              {/* Grid listings view */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 h-80 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : listings.filter(l => l.status === 'active').length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 py-16 px-4 text-center rounded-2xl">
                  <span className="text-2xl block mb-2">🔍</span>
                  <h4 className="text-sm font-bold text-slate-700">No Matching Store Items Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Try relaxing your search terms or choosing a different device category tab.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings
                    .filter(l => l.status === 'active')
                    .map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        onViewDetails={(l) => setSelectedListing(l)}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Trade Listing Wizard tab */}
        {activeTab === 'sell' && (
          <CreateListingTab
            currentUser={currentUser}
            onSubmit={handleCreateListing}
            onSuccess={() => alert('Listing uploaded successfully!')}
          />
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            currentUser={currentUser}
            listings={listings}
            orders={orders}
            swaps={swaps}
            reviews={reviews}
            onAcceptSwap={handleAcceptSwap}
            onRejectSwap={handleRejectSwap}
            onShipOrder={handleShipOrder}
            onDeliverOrder={handleDeliverOrder}
            onAddReview={handleAddReview}
            onNewListingClick={() => setActiveTab('sell')}
          />
        )}

        {/* Administration console */}
        {activeTab === 'admin' && currentUser?.clerkId === 'user_admin' && (
          <AdminTab
            currentUser={currentUser}
            listings={listings}
            orders={orders}
            users={users}
            onApproveListing={handleApproveListing}
            onRejectListing={handleRejectListing}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 px-4 md:px-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
          AutoBoy<span className="text-emerald-600 font-bold">express.ng</span> Barter Ecosystem • Created in Cloud Sandbox
        </p>
        <p className="max-w-xl mx-auto text-[11px] leading-relaxed text-slate-500">
          This platform utilizes custom Node/Express database simulation layers to persist active offers, checkout flows, and administrator queues in real time.
        </p>
      </footer>

      {/* Modals Mounting point */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          currentUser={currentUser}
          onClose={() => setSelectedListing(null)}
          onBuyNow={(l) => setCheckoutListing(l)}
          onMakeSwapOffer={(l) => setSwapListing(l)}
        />
      )}

      {swapListing && (
        <SwapOfferModal
          targetListing={swapListing}
          myActiveListings={listings.filter((l) => l.sellerId === currentUser?.clerkId && l.status === 'active')}
          onClose={() => setSwapListing(null)}
          onSubmitOffer={handleSubmitSwapOffer}
          onGoToListing={() => {
            setSwapListing(null);
            setSelectedListing(null);
            setActiveTab('sell');
          }}
        />
      )}

      {checkoutListing && (
        <CheckoutModal
          listing={checkoutListing}
          currentUser={currentUser}
          onClose={() => setCheckoutListing(null)}
          onConfirmPayment={handleConfirmCheckout}
        />
      )}
    </div>
  );
}
