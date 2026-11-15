import { useState, type MouseEvent } from 'react';
import { useLicenses } from '@/data/licenses';

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
export function useLicenseOverview() {
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
  return { records, categoryCounts, categoryGradient, highlightedCategory, highlightSlice, setActiveCategory };
}
