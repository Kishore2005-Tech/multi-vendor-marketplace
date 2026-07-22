/**
 * Lightweight notification stub — logs for now, swap in
 * an email provider (Resend/SendGrid) or in-app model later.
 */

interface NotificationPayload {
  to: string;
  subject: string;
  message: string;
}

export async function sendNotification({ to, subject, message }: NotificationPayload) {
  // TODO: wire up real email provider (e.g. Resend, SendGrid)
  console.log(`[notification] To: ${to} | Subject: ${subject} | ${message}`);
  return true;
}

export async function notifyOrderPlaced(vendorEmail: string, orderId: string) {
  return sendNotification({
    to: vendorEmail,
    subject: "New order received",
    message: `You have a new order (#${orderId}). Log in to your vendor dashboard to fulfill it.`,
  });
}

export async function notifyVendorApproved(vendorEmail: string) {
  return sendNotification({
    to: vendorEmail,
    subject: "Your vendor account is approved",
    message: "Congratulations! You can now list products on the marketplace.",
  });
}