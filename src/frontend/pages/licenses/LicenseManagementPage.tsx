import { LicenseListSection } from './components/LicenseListSection';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/cards/KpiCard';
import { useLicenseOverview } from './hooks/useLicenseOverview';

export default function LicenseManagementPage() {
  const { records, categoryCounts, categoryGradient, highlightedCategory, highlightSlice, setActiveCategory } = useLicenseOverview();
  return (
    <div className="license-management">
      <PageHeader title="License Management" tooltip="View the total number of licenses, compliance status, category breakdown, and top 5 app usage." />
      <section className="management-overview" aria-label="License overview">
        <div className="summary-stack">
          <KpiCard variant="summary" title="Total Licenses" value={records.length} footer={<span style={{ marginTop: '1.5rem' }}>+5 MoM</span>} />
          <KpiCard variant="summary" title="Unsanitized" value={records.filter(record => record.complianceStatus !== 'Compliant').length} footer={<span style={{ marginTop: '1.5rem' }}>+1 MoM</span>} />
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
