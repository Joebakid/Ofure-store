import AnalyticsCard from "./AnalyticsCard";

export default function AnalyticsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <AnalyticsCard label="Admins" value={stats.admins} />
      <AnalyticsCard label="Products" value={stats.products} />
      <AnalyticsCard label="Visits" value={stats.visits} />
      <AnalyticsCard label="Countries" value={stats.countries} />
    </div>
  );
}
