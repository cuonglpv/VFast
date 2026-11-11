"""Vẽ ERD của ELMS từ docs/database/elms.dbml bằng srsdiagram.

Chạy trong thư mục docs/diagrams:  python ve_erd.py
Ra trong docs/database/diagrams/:
  erd_<nhóm>.drawio/.png/.svg  một sơ đồ cho mỗi nhóm bảng, chỉ vẽ quan hệ trong nhóm;
                               khoá ngoại sang nhóm khác ghi đích ngay trên cột (org_unit_id → org_units)
  erd_overview.svg/.png        render từ erd_overview.mmd (Mermaid, sửa tay) — quan hệ giữa mọi bảng
Xoá các file .drawio/.png/.svg cũ trước khi ghi. Bố cục (cột, thứ tự bảng) đặt trong LAYOUT.
Cần mạng để tải Mermaid khi render erd_overview.
"""
import glob
import os
import re

import srsdiagram as sd

DBML = os.path.join('..', 'database', 'elms.dbml')
OUT = os.path.join('..', 'database', 'diagrams')
OVERVIEW = os.path.join(OUT, 'erd_overview.mmd')
MERMAID = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
ELK = 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0/dist/mermaid-layout-elk.esm.min.mjs'

HIDDEN = {'created_at', 'updated_at'}
# Cột chỉ ghi ai thao tác: luôn ghi '→ user_accounts' trên cột, không vẽ đường.
ACTOR = {'created_by', 'granted_by', 'assigned_by', 'uploaded_by', 'imported_by', 'entered_by', 'declared_by',
         'activated_by', 'closed_by', 'decided_by', 'overridden_by', 'updated_by', 'owner_id', 'actor_id'}
GAP = 70  # khoảng trống giữa hai cột bảng

LAYOUT = {
    'erd_organization': [
        ['org_units', 'permissions', 'system_settings'],
        ['employees', 'manager_org_units', 'role_permissions', 'roles'],
        ['user_accounts', 'user_sessions'],
    ],
    'erd_license_catalog': [
        ['vendors', 'software_categories'],
        ['software_products', 'provider_accounts', 'contracts'],
        ['license_plans', 'entitlement_lines', 'product_links'],
        ['entitlement_allocations'],
    ],
    'erd_collection': [
        ['files', 'connectors'],
        ['import_batches', 'plan_data_sources', 'sync_runs'],
        ['collection_coverage', 'raw_records'],
    ],
    'erd_holders_usage': [
        ['subjects', 'plan_daily_snapshots'],
        ['license_assignments', 'usage_records'],
        ['plan_unit_daily_snapshots'],
    ],
    'erd_budget_cost': [
        ['budget_plans', 'accounting_periods', 'exchange_rates'],
        ['budget_plan_lines', 'cost_allocations', 'expenses'],
    ],
    'erd_optimization': [
        ['detection_runs'],
        ['detection_results'],
        ['recommendations'],
    ],
    'erd_audit': [
        ['audit_logs'],
        ['data_overrides'],
    ],
}
TITLES = {'erd_organization': 'Organization and access', 'erd_license_catalog': 'License catalog',
          'erd_collection': 'Collection pipeline', 'erd_holders_usage': 'Holders and usage',
          'erd_budget_cost': 'Budget, cost, and expenses', 'erd_optimization': 'Optimization', 'erd_audit': 'Audit'}


def parse(path):
    """Bảng → [{name, nn, pk, uq}], và FK: (bảng, cột) → (bảng cha, quan hệ 1-1?)."""
    tables, refs, cur = {}, {}, None
    for line in open(path, encoding='utf-8'):
        m = re.match(r'^Table (\w+) \{', line)
        if m:
            cur = m.group(1)
            tables[cur] = []
            continue
        if cur is None:
            continue
        if line.startswith('}'):
            cur = None
            continue
        # Cột: đúng hai dấu cách đầu dòng; khối indexes/checks/Note không khớp mẫu này.
        m = re.match(r'^  (\w+) ([\w(),]+)(?: \[(.*)\])?\s*$', line)
        if m:
            name, attrs = m.group(1), m.group(3) or ''
            flags = [a.strip() for a in re.split(r',(?![^\[]*\])', re.sub(r"note: '.*?'", '', attrs))]
            tables[cur].append(dict(name=name, pk='pk' in flags, nn='not null' in flags or 'pk' in flags,
                                    uq='unique' in flags))
            r = re.search(r'ref: ([<>-]) (\w+)\.(\w+)', attrs)
            if r:
                refs[(cur, name)] = (r.group(2), r.group(1) == '-')
    return tables, refs


def rows(tables, refs, t, group):
    """(khoá, chữ trên dòng); khoá ngoại sang bảng ngoài nhóm ghi đích: 'org_unit_id → org_units'."""
    out = []
    for c in tables[t]:
        if c['name'] in HIDDEN:
            continue
        keys, text = [], c['name']
        if c['pk']:
            keys.append('PK')
        ref = refs.get((t, c['name']))
        if ref:
            keys.append('FK')
            if ref[0] not in group or c['name'] in ACTOR:
                text += f' → {ref[0]}'
        if c['uq'] and not c['pk']:
            keys.append('UQ')
        out.append((', '.join(keys), text))
    return out


class ERD(sd.ERD):
    """ERD của srsdiagram, thêm: cột rộng theo chữ, đường tự tham chiếu, đường trục riêng cho mỗi bảng cha."""

    def row_y(self, key, colname):
        t = self.tables[key]
        names = [c.split(' → ')[0] for _, c in t['cols']]
        i = names.index(colname) if colname in names else 0
        return t['y'] + self.rh + 2 + (i + 0.5) * self.rh

    def build(self):
        d = sd.Doc()
        for t in self.tables.values():
            f, s = sd.STYLE['erd_main']
            d.table(t['x'], t['y'], t['w'], t['name'], t['cols'], fs=self.fs, fill=f, stroke=s)
        for p, c, fk, kind, off in self.rels:
            P, C = self.tables[p], self.tables[c]
            ms, me = self.KIND[kind]
            if p == c:  # tự tham chiếu: vòng bên phải bảng
                ya, yb = self.row_y(p, 'id'), self.row_y(c, fk)
                x = P['x'] + P['w']
                pts = [(x, ya), (x + 18, ya), (x + 18, yb), (x, yb)]
            elif abs(P['x'] - C['x']) < 1:  # cùng cột: nối dọc
                x = P['x'] + min(P['w'], C['w']) / 2
                pts = [(x, P['y'] + P['h']), (x, C['y'])] if C['y'] > P['y'] else [(x, P['y']), (x, C['y'] + C['h'])]
            else:
                yc = self.row_y(c, fk)
                right = C['x'] > P['x']
                xp = P['x'] + P['w'] if right else P['x']
                xc = C['x'] if right else C['x'] + C['w']
                if P['y'] + self.rh + 2 <= yc <= P['y'] + P['h'] - 4:
                    pts = [(xp, yc), (xc, yc)]
                else:
                    yp = self.row_y(p, 'id')
                    bus = xp + off if right else xp - off
                    pts = [(xp, yp), (bus, yp), (bus, yc), (xc, yc)]
            d.line(pts, start=ms, end=me, sw=1.1)
        return d


def build(key, layout, tables, refs):
    e = ERD()
    group = {t for col in layout for t in col}
    x = 20
    col_of = {}
    for ci, col in enumerate(layout):
        cols = {t: rows(tables, refs, t, group) for t in col}
        w = max(sd.tw(f'{k}  {c}', e.fs, True) for t in col for k, c in cols[t] + [('', t)]) + 40
        y = 20
        for t in col:
            h = e.rh * (1 + len(cols[t])) + 4
            e.tables[t] = dict(x=x, y=y, w=w, h=h, name=t, cols=cols[t], ext=False)
            col_of[t] = ci
            y += h + 40
        x += w + GAP

    rels = []
    for t in group:
        for c in tables[t]:
            ref = refs.get((t, c['name']))
            if not ref or ref[0] not in group or c['name'] in ACTOR:
                continue
            kind = '1-01' if ref[1] else ('1-n' if c['nn'] else '01-n')
            rels.append((ref[0], t, c['name'], kind))
    # Mỗi bảng cha một đường trục riêng trong khe giữa hai cột.
    buses = {}
    for p, t, fk, kind in sorted(rels, key=lambda r: (col_of[r[0]], e.tables[r[0]]['y'])):
        lst = buses.setdefault((col_of[p], col_of[t] > col_of[p]), [])
        if p not in lst:
            lst.append(p)
        e.rel(p, t, fk, kind, off=14 + 10 * lst.index(p))
    return e.build()


def render_overview():
    """erd_overview.mmd → .svg và .png bằng Mermaid trong Chromium."""
    from playwright.sync_api import sync_playwright
    code = open(OVERVIEW, encoding='utf-8').read()
    html = (f'<html><body style="margin:0;background:#fff"><pre class="mermaid">{code}</pre>'
            f'<script type="module">import mermaid from "{MERMAID}"; import elk from "{ELK}";'
            'mermaid.registerLayoutLoaders(elk);'
            'mermaid.initialize({startOnLoad:false, theme:"neutral", er:{useMaxWidth:false}});'
            'try { await mermaid.run(); document.title = "ok"; } catch (e) { document.title = "ERR " + e; }'
            '</script></body></html>')
    base = OVERVIEW[:-4]
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(device_scale_factor=sd.STYLE['png_scale'], viewport={'width': 4000, 'height': 2000})
        pg.set_content(html)
        pg.wait_for_function('document.title.length > 0', timeout=60000)
        if pg.title() != 'ok':
            raise SystemExit(f'erd_overview.mmd: {pg.title()}')
        svg = pg.locator('pre.mermaid svg')
        open(base + '.svg', 'w', encoding='utf-8').write(svg.evaluate('e => e.outerHTML'))
        svg.screenshot(path=base + '.png')
        b.close()
    return base + '.png'


def check_overview(tables):
    """Mọi bảng trong erd_overview.mmd phải có trong elms.dbml."""
    names = set(re.findall(r'^\s+(\w+) [|}o]', open(OVERVIEW, encoding='utf-8').read(), re.M))
    names |= set(re.findall(r'[|}{o]{2} (\w+) :', open(OVERVIEW, encoding='utf-8').read()))
    unknown = names - set(tables)
    if unknown:
        raise SystemExit(f'erd_overview.mmd có bảng không còn trong elms.dbml: {sorted(unknown)}')


def main():
    tables, refs = parse(DBML)
    missing = set(tables) - {t for lay in LAYOUT.values() for col in lay for t in col}
    if missing:
        raise SystemExit(f'Bảng chưa có trong LAYOUT: {sorted(missing)}')
    check_overview(tables)
    for ext in ('drawio', 'png', 'svg'):
        for f in glob.glob(os.path.join(OUT, f'*.{ext}')):
            os.remove(f)
    docs = {k: (build(k, lay, tables, refs), TITLES[k]) for k, lay in LAYOUT.items()}
    for png in sd.save(docs, OUT) + [render_overview()]:
        print(png)


if __name__ == '__main__':
    main()
