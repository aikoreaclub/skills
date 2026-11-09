#!/usr/bin/env node
// 인스타 캡션 검사기 — '더 보기' 전에 보이는 글자, 첫 줄 훅, 검색어, 해시태그 3단 구조, 공유 유도 줄을 본다.
// 사용: node caption_check.mjs 캡션.txt [--brand 밤샘AI]   또는 cat 캡션.txt | node caption_check.mjs
import fs from "node:fs";
const args = process.argv.slice(2); const bi = args.indexOf("--brand"); const brand = bi >= 0 ? args[bi + 1] : null;
const file = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--brand");
const src = file && file !== "-" ? fs.readFileSync(file, "utf8") : fs.readFileSync(0, "utf8");
const lines = src.replace(/\r/g, "").split("\n"); const nonEmpty = lines.filter((l) => l.trim());
const first = nonEmpty[0] || ""; const tags = src.match(/#[^\s#]+/g) || [];
const bodyNoTags = src.replace(/#[^\s#]+/g, "").trim();
const R = []; let score = 100; const hit = (n, p, w) => { R.push({ n, p, w }); score += p; };

// 1. '더 보기' 전 미리보기: 피드에서 약 125자(줄바꿈 포함 첫 2줄)만 보인다.
const preview = src.slice(0, 125).split("\n").slice(0, 2).join(" / ");
// 2. 첫 줄 = 훅. 한글 서비스 이름을 앞세우고 결과는 숨김, 35자 안.
const fl = first.replace(/\s/g, "").length;
if (fl > 35) hit("첫 줄", -10, `${fl}자. 35자 안에서 끊기(피드에서 둘째 줄로 넘어가면 '더 보기'에 가린다)`);
else hit("첫 줄", 0, `${fl}자`);
if (/(출시|공개|발표|업데이트)/.test(first) && !/[?…]/.test(first)) hit("첫 줄 꼴", -10, "소식 선언형. 결과를 숨기고 궁금증 하나로(\"내가 올린 사진, AI가 퍼뜨렸다?\")");
if (/https?:\/\//.test(src)) hit("링크", -10, "캡션 링크는 눌리지 않는다. '프로필 링크' 또는 댓글 키워드로");
if (/^출처[:：]/m.test(src)) hit("출처 줄", -5, "캡션에 '출처:' 줄을 넣지 않는다. 출처는 화면 아래 작게");

// 3. 검색어: 캡션 속 단어가 해시태그보다 검색에 중요. 한글 서비스 이름 + 영문 병기 1회.
const KO = ["챗GPT", "클로드", "제미나이", "오픈AI", "앤트로픽", "엔비디아", "미드저니", "노션", "퍼플렉시티", "코파일럿", "딥시크", "나노바나나", "소라", "런웨이", "클링", "수노", "캔바", "엑셀", "노트북LM"];
const ko = KO.filter((k) => src.includes(k));
const en = (src.match(/\(([A-Za-z][A-Za-z0-9 .-]{2,})\)/g) || []).length;
if (!ko.length) hit("검색어", -15, "사람들이 치는 한글 서비스 이름(챗GPT·클로드·제미나이…)이 캡션에 없다. 첫 두 줄 안에 하나");
else hit("검색어", 0, `${ko.join("·")}${en ? ` + 영문 병기 ${en}회` : " (영문 이름 괄호 병기 1회 넣으면 검색에 더 걸린다)"}`);

// 4. 공유 신호: "○○한 친구한테 보내 주세요"처럼 대상을 집어 보내라고 한다(저장·공유가 도달을 올린다).
if (/(보내|공유|저장해)/.test(bodyNoTags)) hit("공유 유도", 0, "있음");
else hit("공유 유도", -10, `"매일 보고서 쓰는 친구한테 보내 주세요"처럼 대상을 집어 한 줄`);

// 5. 해시태그: 3~5개, 3단(채널 고정 1 + 분류 1 + 주제 1~3). 넓은 태그 단독·스팸 태그·영어 남발 금지.
const BROAD = ["#AI", "#인공지능", "#기술", "#IT", "#뉴스"]; const SPAM = ["#팔로우", "#맞팔", "#좋반", "#선팔", "#스하리", "#소통", "#좋아요반사", "#f4f"]; const HYPE = ["#충격", "#필수", "#꿀팁대방출", "#대박"];
if (tags.length === 0) hit("해시태그", -10, "0개. 3~5개(채널 이름 1 + 분류 1 + 주제 1~3)");
else if (tags.length > 5) hit("해시태그", -10, `${tags.length}개. 인스타는 5개까지(2025-12부터). 주제 태그를 구체적인 것 3개로`);
else hit("해시태그", 0, `${tags.length}개`);
const broad = tags.filter((t) => BROAD.includes(t)); if (broad.length && tags.length <= broad.length + 1) hit("넓은 태그", -8, `${broad.join(" ")}만 있으면 묻힌다. 구체 기능어(#PDF요약·#AI에이전트)로`);
const spam = tags.filter((t) => SPAM.some((s) => t.toLowerCase() === s.toLowerCase())); if (spam.length) hit("스팸 태그", -15, `${spam.join(" ")} — 노출을 깎는다`);
const hype = tags.filter((t) => HYPE.includes(t)); if (hype.length) hit("과장 태그", -5, hype.join(" "));
const eng = tags.filter((t) => /^#[A-Za-z0-9_]+$/.test(t)); if (eng.length > 1) hit("영어 태그", -5, `${eng.join(" ")} — 한국 검색이 기본. 회사명은 한글(#오픈AI #챗GPT)`);
if (brand && !tags.some((t) => t.replace("#", "").toLowerCase() === brand.toLowerCase())) hit("채널 태그", -5, `#${brand} 고정 태그가 없다`);
if (tags.length && !/#[^\s#]+\s*$/.test(src.trim())) hit("태그 위치", -3, "해시태그는 캡션 맨 끝에");

// 6. 길이·말투
const chars = bodyNoTags.replace(/\s/g, "").length;
if (chars > 600) hit("길이", -5, `${chars}자. 캡션은 '무슨 일 2~3줄 → 근데 반전 → 할 일 → 보내 줄 사람 → 한 줄 평'이면 300~450자면 된다`);
else hit("길이", 0, `${chars}자(태그 뺌)`);
if (/[\u4e00-\u9fff]/.test(src)) hit("한자", -30, "한자 금지");
if (/(월 ?\d+만 ?원|수익|부업|돈 버는)/.test(src)) hit("수익 표현", -20, "수익·부업 표현은 계정 노출을 깎는다");
const emoji = (src.match(/\p{Extended_Pictographic}/gu) || []).length; if (emoji > 6) hit("이모지", -5, `${emoji}개. 줄마다 이모지는 AI 티`);

score = Math.max(0, Math.min(100, score));
console.log(`인스타 캡션 검사  ${score}점 — ${score >= 85 ? "올려도 됨" : score >= 65 ? "손보고 올리기" : "다시 쓰기"}\n`);
console.log(`피드에 보이는 부분(더 보기 전): ${preview}${src.length > 125 ? " …" : ""}\n`);
for (const r of R) console.log(`${r.p < 0 ? "▼" : "·"} ${r.n.padEnd(6, " ")} ${r.p ? `(${r.p}) ` : ""}${r.w}`);
console.log("\n" + JSON.stringify({ score, preview, firstLine: first, tags, searchTerms: ko, chars, issues: R.filter((r) => r.p < 0).map((r) => r.n) }));
