#!/usr/bin/env node
// 쓰레드 답글 검사기 — 답글 묶음(JSON: {"replies":[{"id":"1","reply":"…"},{"id":"2","skip":"이유"}]})을 읽어 길이·마침표·링크·인사치레·되물음 비율을 본다.
// 사용: node reply_check.mjs replies.json
import fs from "node:fs";
const f = process.argv[2]; if (!f) { console.error("사용: node reply_check.mjs replies.json"); process.exit(1); }
const d = JSON.parse(fs.readFileSync(f, "utf8")); const rs = d.replies || d; const R = []; let bad = 0;
const CLICHE = /^(감사합니다|좋은 의견이에요|공감합니다|맞아요!?$|좋은 지적이에요|소중한 의견)/;
let asks = 0, written = 0;
for (const r of rs) {
  if (r.skip) { R.push(`· ${r.id}  건너뜀(${r.skip})${r.sensitive ? " · 민감 → 사람이 답" : ""}`); continue; }
  written++; const t = String(r.reply || "").trim(); const n = t.replace(/\s/g, "").length; const why = [];
  if (n > 80) why.push(`${n}자(80자 안쪽)`); if (t.split("\n").length > 2) why.push("3줄 이상");
  if (/[.。]$/m.test(t)) why.push("줄 끝 마침표"); if (/https?:\/\/|DM|디엠|프로필 링크|링크 참고/.test(t)) why.push("링크·DM 유도(쓰레드가 막는다)");
  if (CLICHE.test(t)) why.push("뻔한 인사로 시작"); if ((t.match(/\p{Extended_Pictographic}/gu) || []).length > 1) why.push("이모지 2개 이상");
  if (/(월 ?\d+만|수익|부업)/.test(t)) why.push("수익·부업 말"); if (/[\u4e00-\u9fff]/.test(t)) why.push("한자");
  if (/\?$/.test(t)) asks++;
  if (why.length) bad++; R.push(`${why.length ? "▼" : "·"} ${r.id}  ${t.replace(/\n/g, " / ")}${why.length ? `\n     → ${why.join(", ")}` : ""}`);
}
const ratio = written ? asks / written : 0;
console.log(`쓰레드 답글 검사  ${written}개 씀 · ${rs.length - written}개 건너뜀 · 고칠 것 ${bad}개\n`); console.log(R.join("\n"));
console.log(`\n되물음 비율 ${(ratio * 100).toFixed(0)}% ${ratio > 0.7 ? "— 너무 자주 묻는다. 절반쯤만" : ratio < 0.3 && written >= 4 ? "— 대화가 이어지게 절반쯤은 가벼운 되물음으로 끝내기" : "— 적당"}`);
console.log("\n" + JSON.stringify({ written, skipped: rs.length - written, bad, askRatio: +ratio.toFixed(2) }));
