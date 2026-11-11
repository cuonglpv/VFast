import { useState, type MouseEvent } from "react";
import { LicenseListSection } from "@/sections/licenses";
import { useLicenses } from "@/data/licenses";
import { InfoTooltip } from "@/components/InfoTooltip";

const categoryColors: Record<string, string> = {
  design: "#6c5cff",
  "design & creative": "#6c5cff",
  security: "#f44719",
  utilities: "#475569",
  devops: "#156bb8",
  "dev & devops": "#156bb8",
  productivity: "#0095d9",
  communication: "#00a1aa",
};
const fallbackColors = [
  "#6c5cff",
  "#f44719",
  "#475569",
  "#156bb8",
  "#0095d9",
  "#00a1aa",
];
export default function LicenseManagementPage() {
  const { records } = useLicenses();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const categoryCounts = [
    ...new Set(records.map((record) => record.category)),
  ].map((label, index) => ({
    label,
    count: records.filter((record) => record.category === label).length,
    color:
      categoryColors[label.toLowerCase()] ??
      fallbackColors[index % fallbackColors.length],
  }));
  let sliceStart = 0;
  const categoryGradient = `conic-gradient(${categoryCounts
    .map((category) => {
      const sliceEnd = sliceStart + (category.count / records.length) * 100;
      const slice = `${category.color} ${sliceStart}% ${sliceEnd}%`;
      sliceStart = sliceEnd;
      return slice;
    })
    .join(", ")})`;
  const highlightedCategory =
    activeCategory === null ? undefined : categoryCounts[activeCategory];
  function highlightSlice(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    const distance = Math.hypot(x, y);
    if (distance > bounds.width / 2 || distance < bounds.width * 0.32) {
      setActiveCategory(null);
      return;
    }
    const angle = (Math.atan2(x, -y) + Math.PI * 2) % (Math.PI * 2);
    let cumulative = 0;
    const index = categoryCounts.findIndex((category) => {
      cumulative +=
        (category.count / Math.max(1, records.length)) * Math.PI * 2;
      return angle < cumulative;
    });
    setActiveCategory(index >= 0 ? index : null);
  }
  return (
    <div className="license-management">
      <div className="page-heading">
        <h1 className="inline-flex items-center gap-2">
          <span>License Management</span>
          <InfoTooltip title="View the total number of licenses, compliance status, category breakdown, and top 5 app usage." />
        </h1>
      </div>
      <section className="management-overview" aria-label="License overview">
        <div className="summary-stack">
          <article className="portal-card summary-card">
            <h2>Total Licenses</h2>
            <strong>{records.length}</strong>
            <span style={{ marginTop: "1.5rem" }}>+5 MoM</span>
          </article>
          <article className="portal-card summary-card">
            <h2>Unsanitized</h2>
            <strong>
              {
                records.filter(
                  (record) => record.complianceStatus !== "Compliant",
                ).length
              }
            </strong>
            <span style={{ marginTop: "1.5rem" }}>+1 MoM</span>
          </article>
        </div>
        <article className="portal-card category-card">
          <h2>Category Breakdown</h2>
          <div className="category-content">
            <div className="category-donut-wrap">
              <div
                className="category-donut"
                role="img"
                aria-label={`${records.length} licenses across ${categoryCounts.map((category) => `${category.label} ${category.count}`).join(", ")}`}
                onMouseMove={highlightSlice}
                onMouseLeave={() => setActiveCategory(null)}
                style={{
                  background: categoryCounts.length
                    ? categoryGradient
                    : "#e2e8f0",
                }}
              >
                <span className="category-donut-total">
                  {records.length.toLocaleString("en-US")}
                </span>
              </div>
              {highlightedCategory && (
                <div
                  className="chart-tooltip category-donut-tooltip"
                  role="status"
                >
                  <strong>{highlightedCategory.label}</strong>
                  <span>
                    {highlightedCategory.count} licenses ·{" "}
                    {(
                      (highlightedCategory.count / records.length) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              )}
            </div>
            <ul className="chart-legend">
              {categoryCounts.map((category, index) => (
                <li key={category.label}>
                  <button
                    type="button"
                    aria-label={`${category.label}: ${category.count} licenses`}
                    onMouseEnter={() => setActiveCategory(index)}
                    onMouseLeave={() => setActiveCategory(null)}
                    onFocus={() => setActiveCategory(index)}
                    onBlur={() => setActiveCategory(null)}
                  >
                    <i style={{ background: category.color }} />
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </article>
        <article className="portal-card app-usage-card">
          <h2>Top 5 App Usage</h2>
          <div className="usage-list">
            {records.slice(0, 5).map((record) => {
              const rate = record.entitlementSeats
                ? Math.round(
                    (record.activeUsers / record.entitlementSeats) * 100,
                  )
                : 0;
              return (
                <div
                  className="usage-item"
                  key={record.id}
                  tabIndex={0}
                  aria-label={`${record.softwareName}: ${record.activeUsers} active of ${record.entitlementSeats} seats, ${rate}% utilization`}
                >
                  <div>
                    <span>{record.softwareName}</span>
                    <span>{rate}%</span>
                  </div>
                  <div className="usage-track">
                    <span style={{ width: `${Math.min(rate, 100)}%` }} />
                  </div>
                  <span
                    className="chart-tooltip usage-tooltip"
                    aria-hidden="true"
                  >
                    <strong>{record.softwareName}</strong>
                    <span>
                      {record.activeUsers} / {record.entitlementSeats} active
                      seats ({rate}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </article>
      </section>
      <LicenseListSection />
    </div>
  );
}
