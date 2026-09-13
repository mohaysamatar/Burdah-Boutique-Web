export default function StockBadge({ stock, threshold = 5 }) {
  if (stock === 0) {
    return <span className="bg-danger/10 px-2 py-1 text-xs text-danger">Out of stock</span>
  }
  if (stock <= threshold) {
    return <span className="bg-goldDark/10 px-2 py-1 text-xs text-goldDark">Low: {stock}</span>
  }
  return <span className="bg-success/10 px-2 py-1 text-xs text-success">{stock} in stock</span>
}
