export default function AnalyticsCard({ label, value, subtext }) {
  return (
    <div className="rounded-xl bg-white px-5 py-4 shadow-sm">
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>

      {subtext && (
        <p className="text-xs opacity-60 mt-1">
          {subtext}
        </p>
      )}
    </div>
  );
}
