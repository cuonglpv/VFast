import type { LicenseRecord } from '@/data/licenses';

export const licenseCsvTemplate = 'License Name,Publisher,Category,Compliance,Purchased,Entitlement,Active Users,Total Users,Expiry Date\nExample App,Example Vendor,Productivity,Compliant,12000,100,80,90,2027-12-31\n';

// Accept quoted fields (including commas and newlines) and CRLF exports from Excel.
function csvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (char === '"') {
      if (quoted && source[index + 1] === '"') { field += '"'; index++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(field.trim()); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[index + 1] === '\n') index++;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; field = '';
    } else field += char;
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function parseLicenseCsv(text: string): LicenseRecord[] {
  const [headers, ...rows] = csvRows(text);
  const expected = ['License Name', 'Publisher', 'Category', 'Compliance', 'Purchased', 'Entitlement', 'Active Users', 'Total Users', 'Expiry Date'];
  if (!headers || expected.some(header => !headers.includes(header))) throw new Error('Missing CSV columns. Please use the import template.');
  if (!rows.length) throw new Error('The CSV contains no licenses.');
  const names = new Set<string>();
  return rows.map((row, index) => {
    const get = (header: string) => row[headers.indexOf(header)] ?? '';
    const fail = () => new Error('Invalid values on CSV row ' + (index + 2) + '. Check names, compliance, dates and seat counts.');
    const name = get('License Name');
    const status = get('Compliance');
    const date = get('Expiry Date');
    const numbers = ['Purchased', 'Entitlement', 'Active Users', 'Total Users'].map(header => Number(get(header)));
    if (!name || !get('Publisher') || !get('Category') || names.has(name.toLowerCase()) || row.length !== headers.length
      || !['Compliant', 'At Risk', 'Over-allocated'].includes(status)
      || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date
      || ['Purchased', 'Entitlement', 'Active Users', 'Total Users'].some(header => !get(header))
      || numbers.some(value => !Number.isFinite(value) || value < 0) || numbers.slice(1).some(value => !Number.isInteger(value))
      || numbers[2] > numbers[3]) throw fail();
    names.add(name.toLowerCase());
    return {
      id: 'lic-' + crypto.randomUUID(), softwareName: name, publisher: get('Publisher'), vendor: get('Publisher'),
      category: get('Category'), description: '', subcategory: '', licenseType: 'Subscription',
      complianceStatus: status as LicenseRecord['complianceStatus'], purchasedAmount: numbers[0], monthlyCost: Math.round(numbers[0] / 12),
      entitlementSeats: numbers[1], activeUsers: numbers[2], totalUsers: numbers[3], expiryDate: date, tiers: 'Standard', contracts: 1,
    };
  });
}
