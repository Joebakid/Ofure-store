import AnalyticsCard from "./AnalyticsCard";

export default function AnalyticsGrid({ stats }) {
  const productSubtext =
    stats.shirtProducts !== undefined &&
    stats.foreverLivingProducts !== undefined &&
    stats.otherProducts !== undefined
      ? `${stats.shirtProducts} Shirts · ${stats.foreverLivingProducts} Forever Living · ${stats.otherProducts} Other`
      : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <AnalyticsCard
        label="Admins"
        value={stats.admins}
      />

      <AnalyticsCard
        label="Products"
        value={stats.products}
        subtext={productSubtext}
      />

      <AnalyticsCard
        label="Visits"
        value={stats.visits}
      />

      <AnalyticsCard
        label="Countries"
        value={stats.countries}
      />
    </div>
  );
}
