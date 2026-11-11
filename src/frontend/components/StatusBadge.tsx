type StatusDomain = 'compliance' | 'usage' | 'account' | 'renewal' | 'budget' | 'classification';
type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const toneByDomain: Record<StatusDomain, Record<string, StatusTone>> = {
  compliance: { Compliant: 'success', 'At Risk': 'warning', 'Over-allocated': 'error' },
  usage: { 'Actively used': 'success', Active: 'success', Inactive: 'warning', 'Never used': 'warning', 'No activity': 'warning', 'Not monitored': 'neutral' },
  account: { Active: 'success', Pending: 'info', Inactive: 'neutral', Suspended: 'warning', Deactivated: 'neutral' },
  renewal: { Healthy: 'success', Warning: 'warning', Critical: 'error' },
  budget: { Optimal: 'success', Warning: 'warning', 'High Burn': 'warning', Actionable: 'warning', 'Over budget': 'error' },
  classification: {},
};

export function StatusBadge({ domain, status }: { domain: StatusDomain; status: string | null | undefined }) {
  const label = status?.trim() || 'Unknown';
  const tone = toneByDomain[domain][label] ?? (domain === 'usage' && label.startsWith('Idle') ? 'warning' : 'neutral');
  return <span className="status-badge" data-tone={tone}>{label}</span>;
}
