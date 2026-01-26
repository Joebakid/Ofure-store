export default function AnalyticsCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="text-sm opacity-60">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
