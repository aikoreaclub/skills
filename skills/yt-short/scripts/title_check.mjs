#!/usr/bin/env node
// 유튜브 쇼츠 제목 검사기 — 조회 50만+ 한국 쇼츠 82편 제목 분석(중앙 21.5자, 숫자 35%, 방법·해결 20%, 숨은·모르면 15%, 물음표 11%)과 "쉬운 말·큰 의미·질문형" 규칙.
// 사용: node title_check.mjs "제목" ["제목2" ...]   여러 개 주면 나란히 비교한다.
const titles = process.argv.slice(2).filter(Boolean); if (!titles.length) { console.error('사용: node title_check.mjs "제목" ["제목2"]'); process.exit(1); }
const HARD = ["난제", "비공개", "탐지기", "선언문", "모델", "에이전트", "프롬프트", "토큰", "API", "벤치마크", "파라미터", "추론", "멀티모달", "오픈소스", "온디바이스", "생태계", "로드맵", "패러다임", "거버넌스", "레거시", "아키텍처", "인프라", "솔루션", "플랫폼"];
const BAN = ["충격", "경악", "실화", "【", "】", "#shorts", "#Shorts", "ㄷㄷ", "미쳤", "소름"];
const rows = titles.map((t) => {
  const n = t.replace(/[.,!?'"“”‘’…]/g, "").trim().length; const R = []; let s = 100; const hit = (k, p, w) => { R.push({ k, p, w }); s += p; };
  if (n < 10) hit("길이", -10, `${n}자. 15~20자(터진 82편 중앙 21.5자)`); else if (n > 26) hit("길이", -10, `${n}자. 쇼츠 피드엔 한두 줄만 보인다. 20자 안쪽`); else hit("길이", 0, `${n}자`);
  const hard = HARD.filter((w) => t.includes(w)); if (hard.length) hit("어려운 말", -15 * hard.length, `${hard.join("·")} — 초등학생도 읽히게 풀기(난제→"수학 문제", 탐지기→"AI가 썼는지 잡아내는 것")`);
  const ban = BAN.filter((w) => t.includes(w)); if (ban.length) hit("금지어", -20, `${ban.join(" ")} — 쓰지 않는다`);
  if (/\?$/.test(t.trim()) || /(려는|한다고|이라고|라니|이제)/.test(t)) hit("궁금증", 0, "질문형·반쯤 놀란 말투"); else hit("궁금증", -10, `질문형(~?) 또는 반쯤 놀란 말투가 아니다. 예) "수학자도 대체하려는 AI?"`);
  if (/(내|나|당신|여러분|우리|직장인|회사원|사람|일자리|사진|월급|돈|수학자|의사|변호사|디자이너|개발자|학생|선생|사장|알바|자영업)/.test(t)) hit("큰 의미", 0, "사람한테 무슨 일인지 보인다"); else hit("큰 의미", -10, `사건 자체 말고 "그래서 내 일자리·내 사진·내 돈에 무슨 일?"로 올려 말하기`);
  if (/\d/.test(t)) hit("숫자", 0, "숫자 있음(터진 제목 35%)");
  if (/(AI|챗GPT|클로드|제미나이|엑셀|아이폰|갤럭시|윈도우)/.test(t)) hit("검색어", 0, "기본 검색어 있음"); else hit("검색어", -5, "AI·챗GPT 같은 기본 검색어 하나는 넣기");
  if (/(숨은|모르면|대부분 모르는|고수|1%|99%|아직도)/.test(t)) hit("공식", 0, "'숨은·모르면' 꼴(터진 제목 15%)");
  if (/(하는 법|해결|만드는 법|쓰는 법)/.test(t)) hit("공식", 0, "'방법·해결' 꼴(터진 제목 20%)");
  if (/[\u4e00-\u9fff]/.test(t)) hit("한자", -30, "한자 금지");
  if (/^\[.*(긴급|속보).*\]/.test(t)) hit("날짜 머리", -3, "날짜·긴급 머리말은 발표 24시간 안 속보에만");
  return { t, n, s: Math.max(0, Math.min(100, s)), R };
});
rows.sort((a, b) => b.s - a.s);
for (const r of rows) { console.log(`${String(r.s).padStart(3)}점  ${r.t}`); for (const x of r.R) if (x.p) console.log(`       ▼ ${x.k} (${x.p}) ${x.w}`); else if (/궁금증|큰 의미|공식|숫자/.test(x.k)) console.log(`       · ${x.k}: ${x.w}`); }
console.log("\n" + JSON.stringify(rows.map((r) => ({ title: r.t, score: r.s, chars: r.n, issues: r.R.filter((x) => x.p < 0).map((x) => x.k) }))));
