#!/usr/bin/env node
// SNS 성과 복기 — 편별 CSV를 읽어 계정 기준선(P25·중앙·P75), 형식별·첫 줄 꼴별 중앙값, 편마다 배수(조회÷계정 중앙)·병목(노출/시청/가치)을 낸다.
// 사용: node audit.mjs posts.csv [--days 30]
// CSV 머리: date,platform,format,hook,views,reach,likes,replies,saves,shares,watch_pct,duration_sec  (없는 칸은 비워 둔다. format=릴스/캐러셀/쓰레드/쇼츠, hook=첫 줄 꼴 이름)
import fs from "node:fs";
const a = process.argv.slice(2); const di = a.indexOf("--days"); const days = di >= 0 ? Number(a[di + 1]) : 30; const file = a.find((x, i) => !x.startsWith("--") && a[i - 1] !== "--days");
if (!file) { console.error("사용: node audit.mjs posts.csv [--days 30]"); process.exit(1); }
const rows = parse(fs.readFileSync(file, "utf8")); const since = Date.now() - days * 864e5;
const R = rows.filter((r) => !r.date || new Date(r.date).getTime() >= since); const q = (arr, p) => { const s = arr.filter((x) => x != null && !isNaN(x)).sort((x, y) => x - y); if (!s.length) return null; const i = (s.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return +(s[lo] + (s[hi] - s[lo]) * (i - lo)).toFixed(1); };
const med = (arr) => q(arr, 0.5); const num = (v) => v === "" || v == null ? null : Number(String(v).replace(/[, ]/g, ""));
const by = (key) => { const g = {}; for (const r of R) { const k = r[key] || "(없음)"; (g[k] ||= []).push(r); } return g; };
const out = [];
out.push(`# SNS 성과 복기 (${R.length}편, 최근 ${days}일)\n`);
for (const [plat, prs] of Object.entries(by("platform"))) {
  const v = prs.map((r) => num(r.views)); const P25 = q(v, 0.25), P50 = med(v), P75 = q(v, 0.75);
  const savesK = prs.map((r) => num(r.reach) ? (num(r.saves) || 0) / num(r.reach) * 1000 : null), sharesK = prs.map((r) => num(r.reach) ? (num(r.shares) || 0) / num(r.reach) * 1000 : null);
  const rl = prs.map((r) => num(r.likes) ? (num(r.replies) || 0) / num(r.likes) : null), wp = prs.map((r) => num(r.watch_pct));
  out.push(`## ${plat} (${prs.length}편)\n기준선: 조회 P25 ${P25} · 중앙 ${P50} · P75 ${P75}${med(wp) != null ? ` · 시청 비율 중앙 ${med(wp)}%` : ""}${med(savesK) != null ? ` · 저장/천 ${med(savesK)} · 공유/천 ${med(sharesK)}` : ""}${med(rl) != null ? ` · 답글÷좋아요 중앙 ${med(rl)}` : ""}\n`);
  for (const key of ["format", "hook"]) { const g = {}; for (const r of prs) (g[r[key] || "(없음)"] ||= []).push(num(r.views)); const ks = Object.entries(g).filter(([k]) => k !== "(없음)"); if (ks.length < 2) continue;
    out.push(`${key === "format" ? "형식" : "첫 줄 꼴"}별 조회 중앙: ` + ks.sort((x, y) => (med(y[1]) || 0) - (med(x[1]) || 0)).map(([k, v]) => `${k} ${med(v)}(${v.length}편)`).join(" · ")); }
  // 편별 배수·병목(계정 기준선 안 비교. 계정 전체가 낮으면 '기준 안'으로 숨으니 다른 계정 숫자와도 본다)
  const scored = prs.map((r) => { const vv = num(r.views); const mult = P50 ? +(vv / P50).toFixed(2) : null; let bn = "-"; if (vv != null && P25 != null) { if (vv < P25) bn = (num(r.watch_pct) != null && num(r.watch_pct) < (q(wp, 0.25) ?? 0)) ? "시청(첫 3초·전개)" : "노출(첫 줄·표지·시간대)"; else if (num(r.reach) && (num(r.saves) || 0) / num(r.reach) * 1000 < (q(savesK, 0.25) ?? 0)) bn = "가치(저장할 물건 없음)"; else bn = "기준 안"; } return { ...r, mult, bn }; }).sort((x, y) => (y.mult || 0) - (x.mult || 0));
  out.push(`\n| 날짜 | 형식 | 첫 줄 꼴 | 조회 | 배수 | 병목 |\n|---|---|---|---|---|---|`);
  for (const r of scored) out.push(`| ${r.date || ""} | ${r.format || ""} | ${r.hook || ""} | ${r.views || ""} | ${r.mult ?? ""} | ${r.bn} |`);
  const top = scored.filter((r) => r.mult >= 2), low = scored.filter((r) => r.mult && r.mult < 0.5);
  out.push(`\n배수 2 이상 ${top.length}편${top.length ? `: ${top.map((r) => `${r.hook || r.format || r.date}`).join(", ")}` : ""} / 0.5 미만 ${low.length}편${low.length ? `: ${low.map((r) => r.hook || r.format || r.date).join(", ")}` : ""}`);
  // 다음 조치(규칙): 최근 5편 중앙이 P25 아래면 포맷 수준 개편, 배수 2 이상 꼴이 있으면 그 꼴을 늘린다
  const recent5 = prs.slice(-5).map((r) => num(r.views)); const r5 = med(recent5);
  out.push(`\n다음 조치: ${r5 != null && P25 != null && r5 < P25 ? `최근 5편 중앙 ${r5}이 P25 ${P25} 아래 → 편 단위 손질 말고 포맷 수준 개편(소재 갈래·첫 줄 형식·화면 컨셉 중 하나)을 정해 3편 48시간 판정` : top.length ? `잘 된 꼴(${[...new Set(top.map((r) => r.hook || r.format))].join(", ")})을 다음 주 비율 절반 이상으로` : "기준 안. 첫 줄 꼴 하나를 바꿔 3편 시험"}\n`);
}
console.log(out.join("\n"));
function parse(t) { const L = t.replace(/\r/g, "").split("\n").filter((l) => l.trim()); const h = L[0].split(",").map((s) => s.trim()); return L.slice(1).map((l) => { const c = l.split(","); const o = {}; h.forEach((k, i) => o[k] = (c[i] || "").trim()); return o; }); }
