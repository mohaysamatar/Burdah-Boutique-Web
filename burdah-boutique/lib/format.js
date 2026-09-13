// Formats a number as Kenyan Shillings, e.g. 4500 -> "KSh 4,500"
export function formatKES(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount)
}
