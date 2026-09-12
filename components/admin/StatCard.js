export default function StatCard({ label, value, tone = 'default' }) {
  const toneClasses = {
    default: 'text-navy',
    danger: 'text-danger',
    success: 'text-success',
  }

  return (
    <div className="border border-navy/10 bg-white px-6 py-5">
      <p className="text-xs uppercase tracking-wide2 text-navyText/50">{label}</p>
      <p className={`mt-2 font-display text-3xl ${toneClasses[tone]}`}>{value}</p>
    </div>
  )
}
