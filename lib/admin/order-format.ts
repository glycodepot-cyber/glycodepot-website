export function isOrderId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
export function orderLabel(id: string, number?: string | number | null): string {
  return number ? `#${number}` : id;
}
export function orderStatus(status: string): string {
  const labels: Record<string,string> = {
    paid: 'Paid', pending_payment: 'Awaiting payment', pending: 'Pending',
    payment_failed: 'Payment failed', checkout_failed: 'Checkout failed', expired: 'Expired',
    processing: 'Processing', shipped: 'Shipped', completed: 'Completed', cancelled: 'Cancelled', refunded: 'Refunded',
  };
  return labels[status] ?? status.replaceAll('_', ' ');
}
export function adminMoney(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {style:'currency',currency}).format(cents / 100);
}
export function adminDate(value: string): string {
  return new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/New_York'}).format(new Date(value));
}
export function addressLines(address: Record<string,unknown> | null | undefined): string[] {
  if (!address) return [];
  const text = (key: string) => typeof address[key] === 'string' ? String(address[key]).trim() : '';
  return [text('name') || [text('firstName'),text('lastName')].filter(Boolean).join(' '),text('company'),
    text('address1') || text('line1'),text('address2') || text('line2'),
    [text('city'),text('state'),text('postal') || text('postalCode') || text('postal_code')].filter(Boolean).join(', '),
    text('country'),text('phone')].filter(Boolean);
}
