/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  User, Listing, Order, SwapOffer, Review, Notification, 
  SwapOfferStatus 
} from '../src/types';
import { readDatabase, writeDatabase } from './db';

const PORT = 3000;
const app = express();
app.use(express.json({ limit: '10mb' }));

// API ROUTES

// User endpoints
app.get('/api/users', (req, res) => {
  const db = readDatabase();
  res.json(db.users);
});

app.get('/api/users/:clerkId', (req, res) => {
  const db = readDatabase();
  const user = db.users.find(u => u.clerkId === req.params.clerkId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.put('/api/users/:clerkId', (req, res) => {
  const db = readDatabase();
  const index = db.users.findIndex(u => u.clerkId === req.params.clerkId);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  db.users[index] = { ...db.users[index], ...req.body };
  writeDatabase(db);
  res.json(db.users[index]);
});

// Listing endpoints
app.get('/api/listings', (req, res) => {
  const db = readDatabase();
  const { 
    category, condition, search, sellerId, minPrice, maxPrice, 
    swapEligible, status, sortBy 
  } = req.query;

  let result = [...db.listings];

  // Filters
  if (category) {
    result = result.filter(l => l.category === category);
  }
  if (condition) {
    result = result.filter(l => l.condition === condition);
  }
  if (sellerId) {
    result = result.filter(l => l.sellerId === sellerId);
  }
  if (status) {
    result = result.filter(l => l.status === status);
  }
  if (minPrice) {
    result = result.filter(l => l.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter(l => l.price <= Number(maxPrice));
  }
  if (swapEligible === 'true') {
    result = result.filter(l => l.swapEligible === true);
  }
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter(l => 
      l.title.toLowerCase().includes(s) || 
      l.brand.toLowerCase().includes(s) || 
      l.model.toLowerCase().includes(s) ||
      l.description.toLowerCase().includes(s)
    );
  }

  // Sorting
  if (sortBy === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'views') {
    result.sort((a, b) => b.views - a.views);
  } else {
    // Default newest
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(result);
});

app.get('/api/listings/:id', (req, res) => {
  const db = readDatabase();
  const listing = db.listings.find(l => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json(listing);
});

app.post('/api/listings', (req, res) => {
  const db = readDatabase();
  const { 
    sellerId, title, category, brand, model, condition, 
    description, price, images, swapEligible, swapPreferences 
  } = req.body;

  if (!sellerId || !title || !category || !condition || price === undefined) {
    return res.status(400).json({ error: 'Missing required listing parameters' });
  }

  const seller = db.users.find(u => u.clerkId === sellerId);
  if (!seller) {
    return res.status(404).json({ error: 'Seller user profile not found' });
  }

  const newListing: Listing = {
    id: 'list_' + Math.random().toString(36).substring(2, 11),
    sellerId,
    sellerName: seller.name,
    sellerRating: seller.rating,
    title,
    category,
    brand: brand || '',
    model: model || '',
    condition,
    description: description || '',
    price: Number(price),
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&h=450&q=80'],
    status: 'pending_review', // Listings submit to admin pending queue
    swapEligible: !!swapEligible,
    swapPreferences: swapPreferences || '',
    views: 0,
    createdAt: new Date().toISOString()
  };

  db.listings.unshift(newListing);

  // Send admin notification
  db.notifications.unshift({
    id: 'not_' + Math.random().toString(36).substring(2, 11),
    userId: 'user_admin',
    type: 'offer',
    message: `New listing submitted for review: "${newListing.title}" by ${seller.name}.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  writeDatabase(db);
  res.status(201).json(newListing);
});

app.put('/api/listings/:id/status', (req, res) => {
  const db = readDatabase();
  const { status, rejectionReason } = req.body;
  const listingIndex = db.listings.findIndex(l => l.id === req.params.id);

  if (listingIndex === -1) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const listing = db.listings[listingIndex];
  listing.status = status;
  if (rejectionReason) {
    listing.rejectionReason = rejectionReason;
  }

  // Create notifications depending on status
  if (status === 'active') {
    db.notifications.unshift({
      id: 'not_' + Math.random().toString(36).substring(2, 11),
      userId: listing.sellerId,
      type: 'listing_approved',
      message: `Your listing "${listing.title}" has been approved and is now active!`,
      read: false,
      createdAt: new Date().toISOString()
    });
  } else if (status === 'rejected') {
    db.notifications.unshift({
      id: 'not_' + Math.random().toString(36).substring(2, 11),
      userId: listing.sellerId,
      type: 'listing_rejected',
      message: `Your listing "${listing.title}" was not approved. Reason: ${rejectionReason || 'Does not comply with terms.'}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  writeDatabase(db);
  res.json(listing);
});

app.post('/api/listings/:id/view', (req, res) => {
  const db = readDatabase();
  const listingIndex = db.listings.findIndex(l => l.id === req.params.id);
  if (listingIndex !== -1) {
    db.listings[listingIndex].views += 1;
    writeDatabase(db);
    return res.json({ views: db.listings[listingIndex].views });
  }
  res.status(404).json({ error: 'Listing not found' });
});

// Order endpoints
app.get('/api/orders', (req, res) => {
  const db = readDatabase();
  const { buyerId, sellerId } = req.query;
  let result = [...db.orders];

  if (buyerId) {
    result = result.filter(o => o.buyerId === buyerId);
  }
  if (sellerId) {
    result = result.filter(o => o.sellerId === sellerId);
  }

  res.json(result);
});

app.post('/api/orders', (req, res) => {
  const db = readDatabase();
  const { buyerId, listingId, shippingAddress } = req.body;

  if (!buyerId || !listingId || !shippingAddress) {
    return res.status(400).json({ error: 'Missing purchase params' });
  }

  const buyer = db.users.find(u => u.clerkId === buyerId);
  const listing = db.listings.find(l => l.id === listingId);

  if (!buyer || !listing) {
    return res.status(404).json({ error: 'Buyer or Listing not found' });
  }

  if (listing.status !== 'active') {
    return res.status(400).json({ error: 'This listing is no longer available for purchase.' });
  }

  // Set listing status to sold
  listing.status = 'sold';

  // Create order
  const newOrder: Order = {
    id: 'ord_' + Math.random().toString(36).substring(2, 11),
    buyerId,
    buyerName: buyer.name,
    sellerId: listing.sellerId,
    sellerName: listing.sellerName,
    listingId,
    listingTitle: listing.title,
    listingImage: listing.images[0],
    amount: listing.price,
    paymentId: 'pay_rzp_test_' + Math.random().toString(36).substring(2, 11), // Simulated Razorpay ID
    status: 'paid', // Instant paid in test mode
    shippingAddress,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Update sales stats
  const seller = db.users.find(u => u.clerkId === listing.sellerId);
  if (seller) seller.totalSales += 1;
  buyer.totalPurchases += 1;

  // Add notification to seller
  db.notifications.unshift({
    id: 'not_' + Math.random().toString(36).substring(2, 11),
    userId: listing.sellerId,
    type: 'order_update',
    message: `CONGRATS! "${listing.title}" has been purchased by ${buyer.name} for Rs. ${listing.price.toLocaleString()}. Please ship to: ${shippingAddress}.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  // Add notification to buyer
  db.notifications.unshift({
    id: 'not_' + Math.random().toString(36).substring(2, 11),
    userId: buyerId,
    type: 'order_update',
    message: `Payment Successful! Order placed for "${listing.title}". Your shipping address is registered as: ${shippingAddress}.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  writeDatabase(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
  const db = readDatabase();
  const { status } = req.body;
  const orderIndex = db.orders.findIndex(o => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = db.orders[orderIndex];
  order.status = status;

  // Notify buyer of shipment/delivery
  db.notifications.unshift({
    id: 'not_' + Math.random().toString(36).substring(2, 11),
    userId: order.buyerId,
    type: 'order_update',
    message: `Order for "${order.listingTitle}" is now ${status.toUpperCase()}!`,
    read: false,
    createdAt: new Date().toISOString()
  });

  writeDatabase(db);
  res.json(order);
});

// Swap Offer endpoints
app.get('/api/swaps', (req, res) => {
  const db = readDatabase();
  const { proposerId, targetSellerId } = req.query;
  let result = [...db.swaps];

  if (proposerId) {
    result = result.filter(s => s.proposerId === proposerId);
  }
  if (targetSellerId) {
    result = result.filter(s => s.targetSellerId === targetSellerId);
  }

  res.json(result);
});

app.post('/api/swaps', (req, res) => {
  const db = readDatabase();
  const { proposerId, proposerListingId, targetListingId, cashTopUp, message } = req.body;

  if (!proposerId || !proposerListingId || !targetListingId) {
    return res.status(400).json({ error: 'Missing swap offer arguments' });
  }

  const proposer = db.users.find(u => u.clerkId === proposerId);
  const proposerListing = db.listings.find(l => l.id === proposerListingId);
  const targetListing = db.listings.find(l => l.id === targetListingId);

  if (!proposer || !proposerListing || !targetListing) {
    return res.status(404).json({ error: 'User or Listing reference not found' });
  }

  if (proposerListing.status !== 'active' || targetListing.status !== 'active') {
    return res.status(400).json({ error: 'One or both of the listings are no longer active.' });
  }

  const newSwapOffer: SwapOffer = {
    id: 'swap_' + Math.random().toString(36).substring(2, 11),
    proposerId,
    proposerName: proposer.name,
    proposerListingId,
    proposerListingTitle: proposerListing.title,
    proposerListingImage: proposerListing.images[0],
    targetSellerId: targetListing.sellerId,
    targetListingId,
    targetListingTitle: targetListing.title,
    targetListingImage: targetListing.images[0],
    cashTopUp: Number(cashTopUp || 0),
    status: 'pending',
    message: message || `Hi! I would love to trade my ${proposerListing.title} for your ${targetListing.title}.`,
    createdAt: new Date().toISOString()
  };

  db.swaps.unshift(newSwapOffer);

  // Notify target listing owner
  db.notifications.unshift({
    id: 'not_' + Math.random().toString(36).substring(2, 11),
    userId: targetListing.sellerId,
    type: 'offer',
    message: `${proposer.name} sent you a Swap Offer on "${targetListing.title}"! Offered: "${proposerListing.title}" with a cash top up of Rs. ${Number(cashTopUp || 0).toLocaleString()}.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  writeDatabase(db);
  res.status(201).json(newSwapOffer);
});

app.put('/api/swaps/:id/status', (req, res) => {
  const db = readDatabase();
  const { status, message } = req.body as { status: SwapOfferStatus, message?: string };
  const swapIndex = db.swaps.findIndex(s => s.id === req.params.id);

  if (swapIndex === -1) {
    return res.status(404).json({ error: 'Swap offer not found' });
  }

  const swap = db.swaps[swapIndex];
  swap.status = status;

  if (status === 'accepted') {
    // Both items are swapped! Update listing statuses
    const targetList = db.listings.find(l => l.id === swap.targetListingId);
    const proposerList = db.listings.find(l => l.id === swap.proposerListingId);

    if (targetList) targetList.status = 'swapped';
    if (proposerList) proposerList.status = 'swapped';

    // Create virtual orders for tracking & payment
    const virtualOrder: Order = {
      id: 'ord_' + Math.random().toString(36).substring(2, 11),
      buyerId: swap.proposerId,
      buyerName: swap.proposerName,
      sellerId: swap.targetSellerId,
      sellerName: targetList ? targetList.sellerName : 'Seller',
      listingId: swap.targetListingId,
      listingTitle: `[SWAP MATCH] ${swap.targetListingTitle} <-> ${swap.proposerListingTitle}`,
      listingImage: swap.targetListingImage,
      amount: Math.abs(swap.cashTopUp),
      paymentId: swap.cashTopUp !== 0 ? 'pay_rzp_swap_' + Math.random().toString(36).substring(2, 11) : 'pay_none_swap',
      status: 'paid',
      shippingAddress: 'Verified Swap Point Delivery Center',
      createdAt: new Date().toISOString()
    };
    db.orders.unshift(virtualOrder);

    // Update user swap analytics
    const proposer = db.users.find(u => u.clerkId === swap.proposerId);
    const targetSeller = db.users.find(u => u.clerkId === swap.targetSellerId);
    if (proposer) {
      proposer.totalSales += 1;
      proposer.totalPurchases += 1;
    }
    if (targetSeller) {
      targetSeller.totalSales += 1;
      targetSeller.totalPurchases += 1;
    }

    // Cancel other swap offers on either listing
    db.swaps.forEach(s => {
      if (s.id !== swap.id && s.status === 'pending' && 
         (s.targetListingId === swap.targetListingId || s.proposerListingId === swap.targetListingId ||
          s.targetListingId === swap.proposerListingId || s.proposerListingId === swap.proposerListingId)) {
        s.status = 'rejected';
        db.notifications.unshift({
          id: 'not_' + Math.random().toString(36).substring(2, 11),
          userId: s.proposerId,
          type: 'offer',
          message: `Your swap proposal for "${s.targetListingTitle}" has been archived because the listing was traded elsewhere.`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    // Notify proposer
    db.notifications.unshift({
      id: 'not_' + Math.random().toString(36).substring(2, 11),
      userId: swap.proposerId,
      type: 'offer',
      message: `CONGRATULATIONS! Your swap offer for "${swap.targetListingTitle}" was ACCEPTED! Your trade is now finalized.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    // Notify seller
    db.notifications.unshift({
      id: 'not_' + Math.random().toString(36).substring(2, 11),
      userId: swap.targetSellerId,
      type: 'offer',
      message: `Swap finalized! You accepted ${swap.proposerName}'s offer trading your "${swap.targetListingTitle}" for their "${swap.proposerListingTitle}".`,
      read: false,
      createdAt: new Date().toISOString()
    });

  } else if (status === 'rejected') {
    // Notify proposer
    db.notifications.unshift({
      id: 'not_' + Math.random().toString(36).substring(2, 11),
      userId: swap.proposerId,
      type: 'offer',
      message: `Your swap offer for "${swap.targetListingTitle}" was declined by the seller. Reason: ${message || 'No additional details provided.'}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  writeDatabase(db);
  res.json(swap);
});

// Review endpoints
app.get('/api/reviews', (req, res) => {
  const db = readDatabase();
  const { revieweeId } = req.query;
  let result = [...db.reviews];

  if (revieweeId) {
    result = result.filter(r => r.revieweeId === revieweeId);
  }

  res.json(result);
});

app.post('/api/reviews', (req, res) => {
  const db = readDatabase();
  const { reviewerId, revieweeId, rating, comment, targetType, targetId } = req.body;

  if (!reviewerId || !revieweeId || !rating || !comment) {
    return res.status(400).json({ error: 'Missing review attributes' });
  }

  const reviewer = db.users.find(u => u.clerkId === reviewerId);
  const reviewee = db.users.find(u => u.clerkId === revieweeId);

  if (!reviewer || !reviewee) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newReview: Review = {
    id: 'rev_' + Math.random().toString(36).substring(2, 11),
    reviewerId,
    reviewerName: reviewer.name,
    revieweeId,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
    targetType,
    targetId
  };

  db.reviews.unshift(newReview);

  // Recalculate average rating for reviewee
  const revieweeReviews = db.reviews.filter(r => r.revieweeId === revieweeId);
  const totalRating = revieweeReviews.reduce((sum, r) => sum + r.rating, 0);
  reviewee.rating = Number((totalRating / revieweeReviews.length).toFixed(1));

  // Notify reviewee
  db.notifications.unshift({
    id: 'not_' + Math.random().toString(36).substring(2, 11),
    userId: revieweeId,
    type: 'review_received',
    message: `${reviewer.name} left you a ${rating}-star review: "${comment.substring(0, 40)}..."`,
    read: false,
    createdAt: new Date().toISOString()
  });

  writeDatabase(db);
  res.status(201).json(newReview);
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const db = readDatabase();
  const { userId } = req.query;
  let result = [...db.notifications];

  if (userId) {
    result = result.filter(n => n.userId === userId);
  }

  res.json(result);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const db = readDatabase();
  const notIndex = db.notifications.findIndex(n => n.id === req.params.id);

  if (notIndex === -1) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  db.notifications[notIndex].read = true;
  writeDatabase(db);
  res.json(db.notifications[notIndex]);
});

app.post('/api/notifications/read-all', (req, res) => {
  const db = readDatabase();
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  db.notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });

  writeDatabase(db);
  res.json({ success: true });
});

// VITE MIDDLEWARE SETUP / ASSETS
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AutoBoyexpress.ng Backend] Server running at http://localhost:${PORT}`);
  });
}

startServer();
