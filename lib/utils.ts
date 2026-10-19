export function formatNaira(amount: number): string {
  if (amount === 0) return 'Free';
  return '₦' + amount.toLocaleString('en-NG');
}

export function generateTicketCode(prefix: string = 'EVT'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${Math.floor(100 + Math.random() * 900)}-${result}`;
}
