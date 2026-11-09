#!/usr/bin/env node
// 한국어 SNS 글 AI 티 검사기 — 번역투·기계적 병렬·AI 관용구 20패턴 + 말끝 분포(전부 "~요"면 AI 티) + 줄표 나열·"무엇: 무엇" 제목·이모지 남발.
// 사용: node kr_ai_tone.mjs 글.txt [--fix]   --fix 는 문장이 깨지지 않는 치환(~를 통해→~로, "결론적으로," 삭제, 줄표→쉼표)만 적용해 표준출력에 낸다. 나머지는 보고만 한다.
import fs from "node:fs";
const a = process.argv.slice(2); const fix = a.includes("--fix"); const file = a.find((x) => !x.startsWith("--"));
let src = file && file !== "-" ? fs.readFileSync(file, "utf8") : fs.readFileSync(0, "utf8");
const P = [ // [정규식, 이름, 바꿀 말 또는 null, 감점]
  [/를 통해(서)?/g, "번역투 '~를 통해'", "로", 4], [/을 통해(서)?/g, "번역투 '~을 통해'", "로", 4],
  [/에 있어서/g, "번역투 '~에 있어서'", null, 4], [/에 의해(서)?/g, "번역투 '~에 의해'", null, 3],
  [/에 대한/g, "번역투 '~에 대한'", null, 2], [/에 대해(서)?/g, "번역투 '~에 대해'", null, 2],
  [/결론적으로,?\s?/g, "AI 관용구 '결론적으로'", "", 6], [/시사하는 바가 크다/g, "AI 관용구 '시사하는 바'", null, 6],
  [/주목할 만하다|주목할 필요가 있다/g, "AI 관용구 '주목할'", null, 5], [/중요한 점은|핵심은 바로/g, "AI 관용구 '중요한 점은'", null, 3],
  [/첫째[,.]|둘째[,.]|셋째[,.]/g, "기계적 병렬 '첫째·둘째'", null, 5], [/뿐만 아니라/g, "번역투 '뿐만 아니라'", null, 3],
  [/다양한 /g, "뭉뚱그림 '다양한'", null, 2], [/혁신적인|획기적인|놀라운 /g, "과장 형용사", null, 3],
  [/할 수 있습니다|할 수 있어요/g, "'~할 수 있다' 남발", null, 1], [/것으로 보입니다|것으로 예상됩니다/g, "얼버무림", null, 4],
  [/—|–/g, "줄표(—) 나열", ",", 3], [/^[^\n:：]{2,14}[:：]\s?\S/gm, "'무엇: 무엇' 제목 꼴", null, 3],
  [/^\s*[-•*]\s/gm, "불릿 목록(SNS 글엔 안 어울림)", null, 2], [/\p{Extended_Pictographic}/gu, "이모지", null, 0.5],
  [/것입니다|것이다/g, "'~것이다' 단정 종결", null, 2], [/하였다|되었다/g, "문어체 '~하였다'", null, 2],
];
const R = []; let score = 100;
for (const [re, name, rep, pts] of P) { const m = src.match(re) || []; if (!m.length) continue; const over = name === "이모지" ? Math.max(0, m.length - 3) : m.length; if (!over) continue; const p = Math.min(15, Math.round(over * pts)); R.push({ name, n: m.length, p, ex: [...new Set(m)].slice(0, 3).map((x) => x.trim()) }); score -= p; if (fix && rep !== null && !/^\^/.test(re.source)) src = src.replace(re, rep); }
// 말끝 분포: 줄 끝(또는 문장 끝) 어미. 전부 "~요"면 AI 티. 섞여야 사람 글(~습니다·~죠·~요·~거든요·명사 끊기·질문·~음/~임)
const sents = src.replace(/\r/g, "").split(/\n|(?<=[.!?])\s/).map((s) => s.trim()).filter((s) => s && !/^#/.test(s) && !/https?:/.test(s));
const END = { "~요/~죠": /(요|죠)[.!?]?$/, "~습니다": /(습니다|입니다)[.!?]?$/, "~음/~임/~함": /(음|임|함|됨|큼|같음|있음|없음)[.!?]?$/, "질문": /\?$/, "명사·끊기": /[가-힣A-Za-z0-9)\]]$/, "~다": /(다|였다|했다|된다|있다|없다)[.!]?$/ };
const dist = {}; for (const s of sents) { let k = "기타"; for (const [n, re] of Object.entries(END)) if (re.test(s)) { k = n; break; } dist[k] = (dist[k] || 0) + 1; }
const top = Object.entries(dist).sort((x, y) => y[1] - x[1])[0];
if (sents.length >= 4 && top && top[1] / sents.length >= 0.85) { score -= 12; R.push({ name: `말끝 단조로움(${top[0]} ${top[1]}/${sents.length})`, n: top[1], p: 12, ex: ["~습니다·~죠·~요·~거든요·명사로 끊기·질문을 섞기"] }); }
// 문두 접속사 남발
const conj = sents.filter((s) => /^(또한|그리고|하지만|그러나|따라서|즉|한편)[, ]/.test(s)).length; if (conj >= 3) { score -= 6; R.push({ name: "문두 접속사 남발", n: conj, p: 6, ex: ["또한·그리고·따라서로 시작하는 문장 줄이기"] }); }
// 한 문장 길이
const long = sents.filter((s) => s.replace(/\s/g, "").length > 60).length; if (long) { score -= Math.min(10, long * 4); R.push({ name: "60자 넘는 문장", n: long, p: Math.min(10, long * 4), ex: ["한 줄에 사실 하나, 두 문장으로 쪼개기"] }); }
score = Math.max(0, Math.min(100, score));
if (fix) { console.log(src); console.error(`\n[자동 교정 적용] 점수 ${score} → 사람이 다시 읽기. 바뀐 것: ${R.filter((r) => P.find((p) => p[1] === r.name && p[2] !== null)).map((r) => r.name).join(", ") || "없음"}`); process.exit(0); }
console.log(`한국어 AI 티 검사  ${score}점 — ${score >= 85 ? "사람 글처럼 읽힘" : score >= 65 ? "표시된 곳만 고치기" : "말투부터 다시"}\n`);
for (const r of R) console.log(`▼ ${r.name} ×${r.n} (-${r.p})  예: ${r.ex.join(" | ")}`);
console.log(`\n말끝 분포(${sents.length}문장): ${Object.entries(dist).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
console.log("\n" + JSON.stringify({ score, sentences: sents.length, endings: dist, issues: R.map((r) => ({ name: r.name, n: r.n })) }));
