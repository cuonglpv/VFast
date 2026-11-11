import { LicenseListSection } from '@/sections/licenses';
import { useLicenses } from '@/data/licenses';

const categories = [
  ['Design', '#7063ff'], ['Security', '#f05024'], ['Utilities', '#1368b5'],
  ['Dev & DevOps', '#475569'], ['Productivity', '#008ed5'], ['Communication', '#00a4ad'],
];
export default function LicenseManagementPage() {
  const { records } = useLicenses();
  return <div className="license-management">
    <div className="page-heading"><h1>License Management</h1><p>Software inventory, utilization and compliance overview</p></div>
    <section className="management-overview" aria-label="License overview">
      <div className="summary-stack">
        <article className="portal-card summary-card"><h2>Total Licenses</h2><strong>284</strong><span>+11 MoM</span></article>
        <article className="portal-card summary-card"><h2>Sanctioned</h2><strong>52</strong><span>+4.5% MoM</span></article>
      </div>
      <article className="portal-card category-card"><h2>Category Breakdown</h2><div className="category-content"><div className="category-donut" role="img" aria-label="1,284 licenses across Design, Security, Utilities, Dev and DevOps, Productivity and Communication"><span>1,284</span></div><ul className="chart-legend">{categories.map(([label, color]) => <li key={label}><i style={{ background: color }} />{label}</li>)}</ul></div></article>
      <article className="portal-card app-usage-card"><h2>Top 5 App Usage</h2><div className="usage-list">{records.slice(0, 5).map(record => {
        const rate = record.entitlementSeats ? Math.round(record.activeUsers / record.entitlementSeats * 100) : 0;
        return <div className="usage-item" key={record.id}><div><span>{record.softwareName}</span><span>{rate}%</span></div><div className="usage-track"><span style={{ width: `${Math.min(rate, 100)}%` }} /></div></div>;
      })}</div></article>
    </section>
    <LicenseListSection />
  </div>;
}
