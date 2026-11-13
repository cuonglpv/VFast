"""Xuất ảnh mind map của ELMS từ docs/mindmap/vfast.xmind.

Chạy trong thư mục docs/diagrams:  python ve_mindmap.py
Ra: docs/mindmap.png (render SVG bằng Chrome headless, tỉ lệ 2x).
Bố cục theo kiểu XMind Map: nửa đầu các nhánh bên phải (trên xuống), phần còn lại bên trái (dưới lên),
nên đọc theo chiều kim đồng hồ đúng thứ tự trong file. Topic có nhãn 'key' được tô đậm.
Cần Windows (font Segoe UI) và Chrome.
"""
import html
import json
import os
import subprocess
import tempfile
import zipfile

from PIL import ImageFont

XMIND = os.path.join('..', 'mindmap', 'vfast.xmind')
OUT = os.path.join('..', 'mindmap.png')
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
FONTS = {False: r'C:\Windows\Fonts\segoeui.ttf', True: r'C:\Windows\Fonts\segoeuib.ttf'}

# Màu theo nhánh (tên nhánh → màu nền nhánh, màu chữ đậm). Nhánh mới chưa có màu thì lấy theo thứ tự.
COLORS = {
    'License Management': ('#E57373', '#7A2222'),
    'Usage': ('#EF93B6', '#7A2347'),
    'Budget Management': ('#EBA676', '#7A3F14'),
    'Optimization': ('#93D5C4', '#1F5C4D'),
    'Analytics': ('#8EC5EA', '#1D4F72'),
    'User & Organization': ('#C88BE0', '#5A2373'),
    'Connection Management': ('#E3BE4F', '#6B5310'),
}
SPARE = [('#A9CF6A', '#3E5A12'), ('#9FA8DA', '#283593')]

SIZE = {0: 40, 1: 22, 2: 16, 3: 15}  # cỡ chữ theo cấp
PAD = {1: (20, 12), 2: (10, 6), 3: (10, 6)}  # (ngang, dọc)
HGAP = {0: 130, 1: 70, 2: 50}  # khoảng cách từ cấp này sang cấp con
VGAP = {1: 46, 2: 14, 3: 10}  # khoảng cách giữa hai anh em ở cấp này
MARGIN = 40

_fonts = {}


def text_width(text, size, bold):
    key = (size, bold)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(FONTS[bold], size)
    return _fonts[key].getlength(text)


class Node:
    def __init__(self, topic, level):
        self.title = topic.get('title', '')
        self.level = min(level, 3)
        self.bold = level <= 1 or 'key' in topic.get('labels', [])
        self.children = [Node(t, level + 1) for t in topic.get('children', {}).get('attached', [])]
        size = SIZE[self.level]
        if self.level == 0:
            self.lines = self.title.split(' ', 2)
            self.lines = [' '.join(self.lines[:2]), self.lines[2]] if len(self.lines) == 3 else [self.title]
            self.w = max(text_width(l, size, True) for l in self.lines)
            self.h = size * 1.25 * len(self.lines)
        else:
            px, py = PAD[self.level]
            self.w = text_width(self.title, size, self.bold) + 2 * px
            self.h = size * 1.35 + 2 * py
        self.span = self.h  # chiều cao cả cây con, tính trong measure()

    def measure(self):
        if self.children:
            for c in self.children:
                c.measure()
            stack = sum(c.span for c in self.children) + VGAP[self.children[0].level] * (len(self.children) - 1)
            self.span = max(self.h, stack)
        return self.span


def place(node, ax, top, d):
    """ax: mép gần cha; d = 1 (bên phải) hoặc -1 (bên trái)."""
    node.d = d
    node.x = ax if d == 1 else ax - node.w
    node.y = top + (node.span - node.h) / 2
    if not node.children:
        return
    gap = VGAP[node.children[0].level]
    stack = sum(c.span for c in node.children) + gap * (len(node.children) - 1)
    y = top + (node.span - stack) / 2
    far = node.x + node.w if d == 1 else node.x
    for c in node.children:
        place(c, far + d * HGAP[node.level], y, d)
        y += c.span + gap


def walk(node):
    yield node
    for c in node.children:
        yield from walk(c)


def curve(x1, y1, x2, y2, color, width):
    mx = (x1 + x2) / 2
    return (f'<path d="M{x1:.1f},{y1:.1f} C{mx:.1f},{y1:.1f} {mx:.1f},{y2:.1f} {x2:.1f},{y2:.1f}" '
            f'fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round"/>')


def build_svg(root):
    branches = root.children
    for b in branches:
        b.measure()
    half = (len(branches) + 1) // 2
    right, left = branches[:half], list(reversed(branches[half:]))

    edges, boxes = [], []
    for side, d in ((right, 1), (left, -1)):
        total = sum(b.span for b in side) + VGAP[1] * (len(side) - 1)
        y = -total / 2
        for b in side:
            place(b, d * (root.w / 2 + HGAP[0]), y, d)
            y += b.span + VGAP[1]

    spare = iter(SPARE)
    for b in branches:
        fill, dark = COLORS.get(b.title) or next(spare)
        # gốc → nhánh: xuất phát từ mép trên/dưới chữ gốc, giống XMind
        bx = b.x if b.d == 1 else b.x + b.w
        by = b.y + b.h / 2
        if abs(by) < root.h / 2:  # nhánh ngang tầm chữ gốc: nối từ mép bên
            sx, sy = b.d * (root.w / 2 + 12), by
        else:
            sx, sy = b.d * root.w * 0.28, (root.h / 2 + 6) * (1 if by > 0 else -1)
        edges.append(curve(sx, sy, bx, by, fill, 3))
        for n in walk(b):
            if n is not b:
                tint = 0.42 if n.children else 0.2
                boxes.append(f'<rect x="{n.x:.1f}" y="{n.y:.1f}" width="{n.w:.1f}" height="{n.h:.1f}" '
                             f'fill="{fill}" fill-opacity="{tint}"/>')
                boxes.append(f'<line x1="{n.x:.1f}" y1="{n.y + n.h:.1f}" x2="{n.x + n.w:.1f}" y2="{n.y + n.h:.1f}" '
                             f'stroke="{fill}" stroke-width="2"/>')
            else:
                boxes.append(f'<rect x="{n.x:.1f}" y="{n.y:.1f}" width="{n.w:.1f}" height="{n.h:.1f}" '
                             f'rx="10" fill="{fill}"/>')
            color = '#1A1A1A' if n is b else dark
            weight = 700 if n.bold else 400
            boxes.append(f'<text x="{n.x + n.w / 2:.1f}" y="{n.y + n.h / 2:.1f}" font-size="{SIZE[n.level]}" '
                         f'font-weight="{weight}" fill="{color}" text-anchor="middle" dominant-baseline="central">'
                         f'{html.escape(n.title)}</text>')
            for c in n.children:
                px = n.x + n.w if n.d == 1 else n.x
                cx = c.x if c.d == 1 else c.x + c.w
                # nhánh → con: nối vào giữa hộp nhánh; các cấp dưới: nối vào gạch chân
                py = n.y + n.h / 2 if n is b else n.y + n.h
                edges.append(curve(px, py, cx, c.y + c.h, fill, 2))

    lh = SIZE[0] * 1.25
    y0 = -lh * (len(root.lines) - 1) / 2
    for i, line in enumerate(root.lines):
        boxes.append(f'<text x="0" y="{y0 + i * lh:.1f}" font-size="{SIZE[0]}" font-weight="700" fill="#111" '
                     f'text-anchor="middle" dominant-baseline="central">{html.escape(line)}</text>')

    nodes = [n for b in branches for n in walk(b)]
    x0 = min(min(n.x for n in nodes), -root.w / 2) - MARGIN
    x1 = max(max(n.x + n.w for n in nodes), root.w / 2) + MARGIN
    y0 = min(min(n.y for n in nodes), -root.h / 2) - MARGIN
    y1 = max(max(n.y + n.h for n in nodes), root.h / 2) + MARGIN
    w, h = int(x1 - x0 + 1), int(y1 - y0 + 1)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{x0:.1f} {y0:.1f} {w} {h}" '
           f'font-family="Segoe UI, sans-serif"><rect x="{x0:.1f}" y="{y0:.1f}" width="{w}" height="{h}" fill="#fff"/>'
           + ''.join(edges) + ''.join(boxes) + '</svg>')
    return svg, w, h


def main():
    with zipfile.ZipFile(XMIND) as z:
        sheet = json.loads(z.read('content.json'))[0]
    root = Node(sheet['rootTopic'], 0)
    svg, w, h = build_svg(root)
    with tempfile.TemporaryDirectory() as tmp:
        page = os.path.join(tmp, 'mindmap.html')
        with open(page, 'w', encoding='utf-8') as f:
            f.write(f'<!doctype html><html><body style="margin:0">{svg}</body></html>')
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
                        '--force-device-scale-factor=2', f'--window-size={w},{h}',
                        f'--screenshot={os.path.abspath(OUT)}', 'file:///' + page.replace('\\', '/')],
                       check=True, capture_output=True)
    print(f'{OUT}: {w * 2}x{h * 2}')


if __name__ == '__main__':
    main()
