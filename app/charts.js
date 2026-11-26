// Hearth charts: hand-built SVG, no library. A donut for spending by
// category and bars for the six-month trend. Both return plain SVG strings
// the views drop into the page.

import { CATEGORY_COLORS } from "./data.js";

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, rOuter, rInner, start, end) {
  const [x1, y1] = polar(cx, cy, rOuter, start);
  const [x2, y2] = polar(cx, cy, rOuter, end);
  const [x3, y3] = polar(cx, cy, rInner, end);
  const [x4, y4] = polar(cx, cy, rInner, start);
  const large = end - start > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${rInner} ${rInner} 0 ${large} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
}

export function donutChart(slices, size = 220) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 6;
  const rInner = size / 2 - 44;
  let angle = 0;
  let parts = "";
  for (const s of slices) {
    const sweep = (s.value / total) * 360;
    if (sweep <= 0) continue;
    if (sweep >= 359.9) {
      parts += `<circle cx="${cx}" cy="${cy}" r="${(rOuter + rInner) / 2}" fill="none" stroke="${s.color}" stroke-width="${rOuter - rInner}" />`;
    } else {
      parts += `<path d="${arcPath(cx, cy, rOuter, rInner, angle, angle + sweep - 0.6)}" fill="${s.color}"><title>${s.label}: $${Math.round(s.value).toLocaleString()}</title></path>`;
    }
    angle += sweep;
  }
  const pct = Math.round(((slices.find((s) => s.label === "Savings") || { value: 0 }).value / total) * 100);
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donut chart of spending by category">${parts}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26" font-weight="800" fill="#1c2b22">$${Math.round(total).toLocaleString()}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#5b6b60">spent in November</text><text x="${cx}" y="${cy + 36}" text-anchor="middle" font-size="11" fill="#5b6b60">${pct}% of it went to savings</text></svg>`;
}

export function legendItems(slices) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  return slices
    .map((s) => {
      const pct = Math.round((s.value / total) * 100);
      return `<li><span class="dot" style="background:${s.color}"></span><span class="leg-name">${s.label}</span><span class="leg-val">$${Math.round(s.value).toLocaleString()} · ${pct}%</span></li>`;
    })
    .join("");
}

export function barChart(months, width = 560, height = 220) {
  const max = Math.max(...months.map((m) => m.spent), 1);
  const padL = 46;
  const padB = 26;
  const padT = 14;
  const innerW = width - padL - 12;
  const innerH = height - padT - padB;
  const gap = 10;
  const bw = (innerW - gap * (months.length - 1)) / months.length;
  let bars = "";
  let labels = "";
  let grid = "";
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = padT + innerH - (innerH * v) / max;
    grid += `<line x1="${padL}" y1="${y}" x2="${width - 6}" y2="${y}" stroke="#e7e0d2" stroke-width="1" /><text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#8a968d">$${Math.round(v / 1000)}k</text>`;
  }
  months.forEach((m, i) => {
    const h = (innerH * m.spent) / max;
    const x = padL + i * (bw + gap);
    const y = padT + innerH - h;
    const last = i === months.length - 1;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="6" fill="${last ? "#d97706" : "#14532d"}" opacity="${last ? 1 : 0.75}"><title>${m.month}: $${m.spent.toLocaleString()} spent</title></rect>`;
    labels += `<text x="${(x + bw / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="12" font-weight="${last ? 700 : 400}" fill="${last ? "#1c2b22" : "#5b6b60"}">${m.month}</text>`;
    bars += `<text x="${(x + bw / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#1c2b22">$${(m.spent / 1000).toFixed(1)}k</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" role="img" aria-label="Bar chart of monthly spending, June to November">${grid}${bars}${labels}</svg>`;
}

export function categoryColor(cat) {
  return CATEGORY_COLORS[cat] || "#475569";
}
