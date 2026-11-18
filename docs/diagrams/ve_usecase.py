"""Vẽ sơ đồ use case theo actor từ bảng "Use case list" của docs/02-use-cases.md.

Chạy trong thư mục docs/diagrams:  python ve_usecase.py
Ra: out/uc_manager, uc_staff, uc_admin (.drawio, .png, .svg).
Mỗi sơ đồ một actor, liệt kê mọi use case actor đó bắt đầu được, nhóm theo nhánh mind map.
Cột Actors (cột thứ tư) của bảng quyết định actor: "Staff, Manager" = cả hai.
"""
import os
import re

import srsdiagram as sd

SRC = os.path.join('..', '02-use-cases.md')
OUT = 'out'
TITLE = 'Enterprise License Management System'
ACTORS = [('uc_manager', 'Manager'), ('uc_staff', 'Staff'), ('uc_admin', 'Admin')]

FS = sd.STYLE['uc_fs']
TITLE_FS = sd.STYLE['uc_title_fs']
LINE = sd.STYLE['uc_line']
BOX = sd.STYLE['uc_box_fill']
GROUP_STROKE = '#CBD5E1'
GROUP_TITLE = '#64748B'
ELL_H = 40          # chiều cao một use case
ELL_GAP = 12        # khoảng cách giữa hai use case
ELL_PAD = 28        # lề chữ trong ellipse
GROUP_PAD = 18      # lề trong khung nhóm
GROUP_GAP = 18      # khoảng cách giữa hai nhóm
BOX_X = 260         # mép trái khung hệ thống
ACTOR_CX = 60


def parse():
    rows, branch, inside = [], None, False
    for line in open(SRC, encoding='utf-8'):
        if line.startswith('### Use case list'):
            inside = True
            continue
        if inside and line.startswith('## '):
            break
        if not inside:
            continue
        m = re.match(r'^\| \| \*\*(.+?)\*\* \|', line)
        if m:
            branch = m.group(1)
            continue
        m = re.match(r'^\| (UC\d+) \| ([^|]+) \| [^|]* \| ([^|]+) \|', line)
        if m:
            rows.append((branch, m.group(1), m.group(2).strip(), m.group(3).strip()))
    return rows


def actors_of(text):
    t = text.lower()
    return {a for a in ('Manager', 'Staff', 'Admin') if a.lower() in t}


def build(actor, rows):
    groups = []
    for branch, _, name, who in rows:
        if actor not in actors_of(who):
            continue
        if not groups or groups[-1][0] != branch:
            groups.append((branch, []))
        groups[-1][1].append(name)

    widths = [sd.tw(n, FS) + 2 * ELL_PAD for _, names in groups for n in names]
    title_w = sd.tw(TITLE, TITLE_FS, True)
    group_w = max(max(widths) + 2 * GROUP_PAD + 40, max(sd.tw(b, FS, True) for b, _ in groups) + 2 * GROUP_PAD)
    box_w = max(group_w + 60, title_w + 60)
    gx = BOX_X + (box_w - group_w) / 2

    d = sd.Doc()
    y = 70
    ells = []
    layout = []
    for branch, names in groups:
        gh = GROUP_PAD + sd.lh(FS) + 10 + len(names) * (ELL_H + ELL_GAP) - ELL_GAP + GROUP_PAD
        layout.append((branch, names, y, gh))
        y += gh + GROUP_GAP
    box_h = y - GROUP_GAP + 30

    d.rect(BOX_X, 0, box_w, box_h, fill=BOX, stroke=LINE, sw=1.3, lines=[TITLE], fs=TITLE_FS, bold=True,
           color='#0f172a', valign='top', pad=18)
    for branch, names, gy, gh in layout:
        d.rect(gx, gy, group_w, gh, fill=BOX, stroke=GROUP_STROKE, sw=1, dashed=True, lines=[branch], fs=FS,
               bold=True, color=GROUP_TITLE, valign='top', pad=GROUP_PAD - 6)
        ey = gy + GROUP_PAD + sd.lh(FS) + 10
        for name in names:
            w = sd.tw(name, FS) + 2 * ELL_PAD
            ex = gx + 40
            d.ellipse(ex, ey, w, ELL_H, fill='#ffffff', stroke=LINE, sw=1.3, lines=[name], fs=FS)
            ells.append((ex, ey + ELL_H / 2))
            ey += ELL_H + ELL_GAP

    top = box_h / 2 - 40
    d.actor(ACTOR_CX, top, actor, fs=sd.STYLE['actor_fs'], bold=True)
    hand = (ACTOR_CX + 11, top + 17)
    for ex, ey in ells:
        d.line([hand, (ex, ey)], color=LINE, sw=1.1)
    return d


def main():
    rows = parse()
    if not rows:
        raise SystemExit('Không đọc được bảng Use case list trong ' + SRC)
    docs = {fname: (build(actor, rows), actor) for fname, actor in ACTORS}
    for png in sd.save(docs, OUT):
        print(png)


if __name__ == '__main__':
    main()
