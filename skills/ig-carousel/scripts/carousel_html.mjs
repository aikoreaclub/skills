#!/usr/bin/env node
// 인스타 캐러셀 10장 만들기 — slides.json → 한 파일 HTML(1080×1350, 장마다 다른 판) → 가능하면 PNG 10장.
// 사용: node carousel_html.mjs slides.json [출력폴더]      PNG는 playwright-core(또는 playwright)가 설치돼 있을 때만 만들고, 없으면 HTML만 만든다(브라우저에서 열어 장마다 캡처).
// slides.json 예시는 ../references/slides.example.json. 장 필드: layout(cover|photo|accent|dark-list|quote|steps|save), kicker, title, body(줄바꿈 \n), items[], img(파일 경로나 URL), source
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const [, , inFile, outDir = "carousel_out"] = process.argv; if (!inFile) { console.error("사용: node carousel_html.mjs slides.json [출력폴더]"); process.exit(1); }
const d = JSON.parse(fs.readFileSync(inFile, "utf8")); const S = d.slides || []; fs.mkdirSync(outDir, { recursive: true });
const T = { brand: d.brand || "", accent: d.accent || "#ff6a1a", ink: d.ink || "#17181c", paper: d.paper || "#ffffff", font: d.font || "'Pretendard','Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif" }; // 한글 명조체는 쓰지 않는다
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const br = (s) => esc(s).replace(/\n/g, "<br>");
const img = (s) => s.img ? (/^https?:|^data:/.test(s.img) ? s.img : "file://" + path.resolve(path.dirname(inFile), s.img)) : "";
const warn = [];
const slide = (s, i) => {
  const n = i + 1, L = s.layout || (n === 1 ? "cover" : n === S.length ? "save" : ["photo", "accent", "dark-list", "quote", "steps"][i % 5]);
  if (L === "quote" && !s.img) warn.push(`${n}장: 인용(quote) 판은 사진이 있어야 한다(글자만 있는 미색 판 금지) → photo 판으로 바꿈`);
  const lay = L === "quote" && !s.img ? "photo" : L; const pic = img(s);
  const num = `<div class="num">${n}/${S.length}</div>`, brand = T.brand ? `<div class="brand">${esc(T.brand)}</div>` : "", src = s.source ? `<div class="src">${esc(s.source)}</div>` : "";
  const items = (s.items || []).map((x, k) => `<li><b>${k + 1}</b><span>${br(x)}</span></li>`).join("");
  const body = { // 장마다 다른 판(연달아 같은 배치 금지)
    cover: `<section class="sl cover" style="background-image:url('${pic}')"><div class="shade"></div>${brand}<div class="k">${esc(s.kicker || "")}</div><h1>${br(s.title)}</h1><p>${br(s.body || "")}</p><div class="swipe">옆으로 넘기기 →</div></section>`,
    photo: `<section class="sl photo">${pic ? `<div class="pic" style="background-image:url('${pic}')"></div>` : `<div class="pic ph"></div>`}<div class="txt">${s.kicker ? `<div class="k">${esc(s.kicker)}</div>` : ""}<h2>${br(s.title)}</h2><p>${br(s.body || "")}</p></div>${num}${src}</section>`,
    accent: `<section class="sl accent"><div class="k">${esc(s.kicker || "")}</div><h2>${br(s.title)}</h2><p>${br(s.body || "")}</p>${pic ? `<div class="pic small" style="background-image:url('${pic}')"></div>` : ""}${num}${src}</section>`,
    "dark-list": `<section class="sl dark"><div class="k">${esc(s.kicker || "")}</div><h2>${br(s.title)}</h2><ol class="list">${items}</ol>${pic ? `<div class="pic small" style="background-image:url('${pic}')"></div>` : ""}${num}${src}</section>`,
    quote: `<section class="sl quote" style="background-image:url('${pic}')"><div class="shade"></div><blockquote>${br(s.title)}</blockquote><p>${br(s.body || "")}</p>${num}${src}</section>`,
    steps: `<section class="sl steps"><div class="k">${esc(s.kicker || "")}</div><h2>${br(s.title)}</h2>${pic ? `<div class="pic wide" style="background-image:url('${pic}')"></div>` : `<div class="pic wide ph"></div>`}<div class="step">${br(s.body || "")}</div>${num}${src}</section>`,
    save: `<section class="sl save">${brand}<h2>${br(s.title || "저장해 두세요")}</h2><p>${br(s.body || "")}</p><div class="cta">${esc(s.cta || "저장 · 팔로우 · 친구에게 공유")}</div></section>`,
  }[lay] || `<section class="sl photo"><h2>${br(s.title)}</h2></section>`;
  return body;
};
const css = `*{box-sizing:border-box;margin:0}body{background:#222;font-family:${T.font};color:${T.ink}}
.sl{position:relative;width:1080px;height:1350px;overflow:hidden;padding:88px 84px;display:flex;flex-direction:column;background:${T.paper};word-break:keep-all;line-height:1.3;page-break-after:always}
.k{font-size:30px;font-weight:800;letter-spacing:.02em;color:${T.accent};margin-bottom:22px}
h1{font-size:92px;font-weight:900;line-height:1.12;letter-spacing:-.02em}h2{font-size:72px;font-weight:900;line-height:1.14;letter-spacing:-.02em}p{font-size:38px;line-height:1.5;margin-top:34px;opacity:.9}
.num{position:absolute;right:84px;top:76px;font-size:26px;font-weight:700;opacity:.55}.brand{position:absolute;left:84px;top:76px;font-size:28px;font-weight:800;letter-spacing:.04em}
.src{position:absolute;left:84px;bottom:52px;font-size:22px;opacity:.55}
.cover{justify-content:flex-end;color:#fff;background-size:cover;background-position:center;background-color:${T.ink}}.cover .shade,.quote .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05) 30%,rgba(0,0,0,.78))}.cover>*:not(.brand):not(.shade),.quote>*:not(.shade){position:relative}.cover .brand{color:#fff;z-index:1}.cover .k{color:#ffd166}.cover p{color:rgba(255,255,255,.9)}.swipe{margin-top:54px;font-size:28px;opacity:.8}
.photo{padding:0}.photo .pic{height:760px;background-size:cover;background-position:center}.photo .txt{padding:64px 84px}.ph{background:repeating-linear-gradient(45deg,#e9e6df 0 24px,#f3f1ec 24px 48px)}
.accent{background:${T.accent};color:#fff}.accent .k{color:#fff;opacity:.85}.accent p{opacity:.95}
.dark{background:${T.ink};color:#fff}.dark .k{color:#ffd166}.list{list-style:none;margin-top:44px;display:grid;gap:28px}.list li{display:flex;gap:26px;align-items:flex-start;font-size:40px;line-height:1.4}.list b{flex:none;width:64px;height:64px;border-radius:50%;background:${T.accent};display:grid;place-items:center;font-size:30px}
.pic.small{margin-top:auto;height:360px;border-radius:28px;background-size:cover;background-position:center}.pic.wide{margin-top:40px;height:560px;border-radius:28px;background-size:cover;background-position:center}
.quote{justify-content:flex-end;color:#fff;background-size:cover;background-position:center;background-color:${T.ink}}blockquote{font-size:66px;font-weight:900;line-height:1.2}
.steps .step{margin-top:40px;font-size:40px;line-height:1.5;padding:34px 40px;border-radius:24px;background:#f3f1ec;border-left:14px solid ${T.accent}}
.save{justify-content:center;align-items:flex-start;background:#f6f4ee}.save h2{font-size:84px}.cta{margin-top:60px;padding:28px 44px;border-radius:999px;background:${T.ink};color:#fff;font-size:34px;font-weight:800}`;
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${esc(d.title || "캐러셀")}</title><style>${css}</style></head><body>${S.map(slide).join("\n")}</body></html>`;
fs.writeFileSync(path.join(outDir, "carousel.html"), html);
console.log(`HTML: ${path.join(outDir, "carousel.html")} (${S.length}장)`); for (const w of warn) console.log("주의: " + w);
// PNG: 설치된 브라우저 도구가 있을 때만
const req = createRequire(path.resolve("package.json")); let pw = null; for (const m of [process.env.PLAYWRIGHT_PATH, "playwright-core", "playwright"].filter(Boolean)) { try { pw = req(m); break; } catch {} }
if (!pw) { console.log("PNG 건너뜀: playwright-core 가 없다. 브라우저로 carousel.html 을 열어 장마다 1080×1350 캡처하거나 `npm i -D playwright-core` 후 다시 실행"); process.exit(0); }
const b = await pw.chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" }).catch(() => pw.chromium.launch()); const pg = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await pg.goto("file://" + path.resolve(outDir, "carousel.html")); await pg.waitForTimeout(600);
const els = await pg.locator(".sl").all(); for (let i = 0; i < els.length; i++) { const f = path.join(outDir, `${String(i + 1).padStart(2, "0")}.png`); await els[i].screenshot({ path: f }); console.log("PNG: " + f); }
await b.close();
