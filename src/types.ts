/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  clerkId: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  address: string;
  rating: number; // average rating
  totalSales: number;
  totalPurchases: number;
  createdAt: string;
}

export type Category = 'phone' | 'laptop' | 'tablet' | 'wearable' | 'accessory';
export type Condition = 'like_new' | 'good' | 'fair';
export type ListingStatus = 'pending_review' | 'active' | 'sold' | 'swapped' | 'rejected';

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string; // denormalized for easy rendering
  sellerRating: number;
  title: string;
  category: Category;
  brand: string;
  model: string;
  condition: Condition;
  description: string;
  price: number;
  images: string[];
  status: ListingStatus;
  swapEligible: boolean;
  swapPreferences?: string;
  views: number;
  createdAt: string;
  rejectionReason?: string; // administrative notes
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  amount: number;
  paymentId: string; // Razorpay payment ID
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
}

export type SwapOfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered';

export interface SwapOffer {
  id: string;
  proposerId: string;
  proposerName: string;
  proposerListingId: string; // listing proposed for swap
  proposerListingTitle: string;
  proposerListingImage: string;
  targetSellerId: string; // owner of the target listing
  targetListingId: string; // listing proposed to be swapped for
  targetListingTitle: string;
  targetListingImage: string;
  cashTopUp: number; // positive if proposer pays seller, negative if proposer asks for cash
  status: SwapOfferStatus;
  message: string;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  targetType: 'order' | 'swap';
  targetId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'offer' | 'order_update' | 'listing_approved' | 'listing_rejected' | 'review_received';
  message: string;
  read: boolean;
  createdAt: string;
}
