/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path';
import fs from 'fs';
import { User, Listing, Order, SwapOffer, Review, Notification } from '../src/types';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

// Initial Seed Data
const INITIAL_USERS: User[] = [
  {
    clerkId: 'user_1',
    name: 'Kishore Prakash',
    email: 'kishore@autoboyexpress.ng',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    phone: '+91 98765 43210',
    address: '123, Tech Boulevard, Whitefield, Bangalore, Karnataka - 560066',
    rating: 4.8,
    totalSales: 12,
    totalPurchases: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
  },
  {
    clerkId: 'user_2',
    name: 'Sarah Connor',
    email: 'sarah.c@cyberdyne.net',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    phone: '+1 (555) 019-9214',
    address: '456 resistance Road, Sector 7, Los Angeles, CA - 90001',
    rating: 4.5,
    totalSales: 4,
    totalPurchases: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
  },
  {
    clerkId: 'user_3',
    name: 'Alex Rivera',
    email: 'alex.rivera@innovate.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    phone: '+1 (555) 302-1829',
    address: '789 Silicon Valley Way, Suite 400, San Jose, CA - 95112',
    rating: 4.9,
    totalSales: 21,
    totalPurchases: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(), // 120 days ago
  },
  {
    clerkId: 'user_admin',
    name: 'System Administrator',
    email: 'admin@autoboyexpress.ng',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80',
    phone: '+1 (800) 555-0100',
    address: 'AutoBoyHQ, 100 Infinite Loop, Cupertino, CA',
    rating: 5.0,
    totalSales: 0,
    totalPurchases: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
  }
];

const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'list_1',
    sellerId: 'user_1',
    sellerName: 'Kishore Prakash',
    sellerRating: 4.8,
    title: 'iPhone 15 Pro Max - 256GB - Blue Titanium',
    category: 'phone',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    condition: 'like_new',
    description: 'Selling my iPhone 15 Pro Max in absolute mint condition. Zero scratches, zero dents. Battery health is at 98%. Always kept in a Spigen case with a high-quality glass screen protector. Includes original box, USB-C woven cable, and an extra transparent case. Still under Apple warranty until November 2026.',
    price: 95000,
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&h=450&q=80',
      'https://images.unsplash.com/photo-1565849328260-4b7ab5839736?auto=format&fit=crop&w=600&h=450&q=80'
    ],
    status: 'active',
    swapEligible: true,
    swapPreferences: 'Looking for MacBook Air M3 (16GB RAM) or iPad Pro M2/M4. Open to trade + cash adjustment either way.',
    views: 142,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  },
  {
    id: 'list_2',
    sellerId: 'user_2',
    sellerName: 'Sarah Connor',
    sellerRating: 4.5,
    title: 'MacBook Air M2 (2022) - 16GB RAM - 512GB SSD',
    category: 'laptop',
    brand: 'Apple',
    model: 'MacBook Air M2',
    condition: 'good',
    description: 'Extremely light and fast MacBook Air M2 in Space Gray. Upgraded to 16GB unified memory which is perfect for developers or content creators. 512GB fast SSD storage. There is a very tiny micro-scratch on the top lid (barely visible, see photos), otherwise flawless. Cycle count is 88. Original charger included.',
    price: 84000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&h=450&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&h=450&q=80'
    ],
    status: 'active',
    swapEligible: true,
    swapPreferences: 'Willing to swap for an outstanding iPhone 15 Pro, S24 Ultra, or iPad Pro 12.9 with Magic Keyboard.',
    views: 89,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
  },
  {
    id: 'list_3',
    sellerId: 'user_3',
    sellerName: 'Alex Rivera',
    sellerRating: 4.9,
    title: 'iPad Pro 11-inch (4th Gen) Wi-Fi - 128GB - Space Gray',
    category: 'tablet',
    brand: 'Apple',
    model: 'iPad Pro 11-inch M2',
    condition: 'like_new',
    description: 'Barely used M2 iPad Pro 11. Bought for a design project that got cancelled, so it mostly sat in my drawer. No signs of wear at all. Fully laminated Liquid Retina display with ProMotion. Box and original unused accessories are included. Will bundle a cheap magnetic trifold cover.',
    price: 62000,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&h=450&q=80'
    ],
    status: 'active',
    swapEligible: true,
    swapPreferences: 'Looking to swap for a flagship phone (iPhone 14/15 Pro or Samsung S23/S24 Ultra). Also open to accessories like Sony WH-XM5/AirPods Max + cash top up.',
    views: 54,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
  {
    id: 'list_4',
    sellerId: 'user_1',
    sellerName: 'Kishore Prakash',
    sellerRating: 4.8,
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones - Black',
    category: 'accessory',
    brand: 'Sony',
    model: 'WH-1000XM5',
    condition: 'good',
    description: 'Industry-leading noise cancelling headphones. Sound profile is incredible, ANC works like a charm. Touch controls are fully responsive. Soft leather ear cups are clean. Comes with the original protective carrying case, 3.5mm auxiliary wire, and USB charging wire.',
    price: 19500,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=450&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&h=450&q=80'
    ],
    status: 'active',
    swapEligible: false,
    views: 110,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days ago
  },
  {
    id: 'list_5',
    sellerId: 'user_3',
    sellerName: 'Alex Rivera',
    sellerRating: 4.9,
    title: 'Samsung Galaxy S24 Ultra - 512GB - Titanium Yellow',
    category: 'phone',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    condition: 'like_new',
    description: 'Ultimate Android flagship with Galaxy AI! Titanium Yellow color, looks incredibly premium. 12GB RAM, huge 512GB storage. S-Pen is included and works flawlessly. Screen is protected by premium anti-reflective armor film. Zero scratches on screen or side rails. Selling because I am switching back to iOS. Box and bill included.',
    price: 105000,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&h=450&q=80'
    ],
    status: 'active',
    swapEligible: true,
    swapPreferences: 'Strictly looking for iPhone 15 Pro Max 256GB/512GB in equivalent Like New condition. Straight swap.',
    views: 198,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
  },
  {
    id: 'list_6',
    sellerId: 'user_2',
    sellerName: 'Sarah Connor',
    sellerRating: 4.5,
    title: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm) - Ocean Band',
    category: 'wearable',
    brand: 'Apple',
    model: 'Watch Ultra 2',
    condition: 'good',
    description: 'Rugged titanium sports watch. Incredible battery life (easily lasts 2-3 days). Cell plan works perfectly. Some minor scuffs on the titanium bezel from normal outdoor activity, but sapphire glass screen is pristine. Battery health is 96%. Comes with black ocean band and charger.',
    price: 58000,
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=600&h=450&q=80'
    ],
    status: 'active',
    swapEligible: true,
    swapPreferences: 'Interested in Garmin Fenix 7 Pro, or Apple iPad Mini 6 + cash top up.',
    views: 75,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    id: 'list_7',
    sellerId: 'user_3',
    sellerName: 'Alex Rivera',
    sellerRating: 4.9,
    title: 'Nintendo Switch OLED - White Joy-Con - 64GB',
    category: 'accessory',
    brand: 'Nintendo',
    model: 'Switch OLED',
    condition: 'fair',
    description: 'Nintendo Switch OLED with gorgeous screen. Joy-Cons have very minor stick drift but otherwise work well. Console body has slight scuffs on back plate. OLED screen itself is perfectly clean with screen protector installed. Comes with charging dock, AC adapter, HDMI cable, and Zelda Tears of the Kingdom game cartridge.',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&h=450&q=80'
    ],
    status: 'pending_review',
    swapEligible: false,
    views: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
  }
];

const INITIAL_SWAPS: SwapOffer[] = [
  {
    id: 'swap_1',
    proposerId: 'user_2',
    proposerName: 'Sarah Connor',
    proposerListingId: 'list_2', // MacBook Air M2
    proposerListingTitle: 'MacBook Air M2 (2022) - 16GB RAM - 512GB SSD',
    proposerListingImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&h=450&q=80',
    targetSellerId: 'user_1',
    targetListingId: 'list_1', // iPhone 15 Pro Max
    targetListingTitle: 'iPhone 15 Pro Max - 256GB - Blue Titanium',
    targetListingImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&h=450&q=80',
    cashTopUp: -11000, // Proposer is offering listing valued at 84k, target is 95k, so proposer is offering to pay 11000 cash top up
    status: 'pending',
    message: 'Hey Kishore! I noticed you are looking for a MacBook Air. Mine is the upgraded 16GB RAM model in great shape. I can offer the MacBook Air plus Rs. 11,000 cash to make up the difference for your iPhone 15 Pro Max. Let me know what you think!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() // 18 hours ago
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1',
    buyerId: 'user_2',
    buyerName: 'Sarah Connor',
    sellerId: 'user_3',
    sellerName: 'Alex Rivera',
    listingId: 'list_3', // iPad Pro
    listingTitle: 'iPad Pro 11-inch (4th Gen) Wi-Fi - 128GB - Space Gray',
    listingImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&h=450&q=80',
    amount: 62000,
    paymentId: 'pay_rzp_mock_12345',
    status: 'delivered',
    shippingAddress: '456 resistance Road, Sector 7, Los Angeles, CA - 90001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() // 14 days ago
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    reviewerId: 'user_2',
    reviewerName: 'Sarah Connor',
    revieweeId: 'user_3',
    rating: 5,
    comment: 'Exceptional seller! The iPad Pro was packaged securely and arrived exactly as described—practically brand new. Super fast communication and shipping. Thanks, Alex!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    targetType: 'order',
    targetId: 'ord_1'
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'not_1',
    userId: 'user_1',
    type: 'offer',
    message: 'Sarah Connor offered a swap: MacBook Air M2 + Rs. 11,000 for your iPhone 15 Pro Max.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'not_2',
    userId: 'user_3',
    type: 'review_received',
    message: 'Sarah Connor left you a 5-star review: "Exceptional seller! The iPad Pro was packaged..."',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  }
];

export interface DatabaseSchema {
  users: User[];
  listings: Listing[];
  orders: Order[];
  swaps: SwapOffer[];
  reviews: Review[];
  notifications: Notification[];
}

export function readDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading database file, using fallback/seed:', error);
  }

  // Create default db
  const defaultDb: DatabaseSchema = {
    users: INITIAL_USERS,
    listings: INITIAL_LISTINGS,
    orders: INITIAL_ORDERS,
    swaps: INITIAL_SWAPS,
    reviews: INITIAL_REVIEWS,
    notifications: INITIAL_NOTIFICATIONS,
  };
  writeDatabase(defaultDb);
  return defaultDb;
}

export function writeDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}
