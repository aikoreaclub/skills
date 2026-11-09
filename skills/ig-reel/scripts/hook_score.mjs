#!/usr/bin/env node
// 릴스·쇼츠 대본 검사기 — 조회 50만 넘은 한국어 AI·업무 쇼츠 82편(말 있는 60편 첫 문장 분류, 길이·말 속도 측정)에서 뽑은 기준.
// 사용: node hook_score.mjs 대본.txt [--sec 40]   (대본은 한 줄 = 한 장면. 첫 줄이 첫 문장)
import fs from "node:fs";
const a = process.argv.slice(2); const si = a.indexOf("--sec"); const sec = si >= 0 ? Number(a[si + 1]) : null;
const file = a.find((x, i) => !x.startsWith("--") && a[i - 1] !== "--sec");
const src = file && file !== "-" ? fs.readFileSync(file, "utf8") : fs.readFileSync(0, "utf8");
const scenes = src.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean);
const first = scenes[0] || ""; const R = []; let score = 100; const hit = (n, p, w) => { R.push({ n, p, w }); score += p; };
const len = (s) => s.replace(/[\s.,!?'"“”‘’…]/g, "").length;

// 1. 첫 문장 유형(82편 조회 중앙값): 숨은 기능·모르면 손해 321만 · 문제 상황 공감 282만(말 있는 60편 중 42%) · 질문 191만 · 새 소식 선언 169만 · 결과 먼저 158만 · 개수 예고 142만
let kind = null;
if (/(모르면|숨은|숨겨|아직도|손해|놓치|몰랐)/.test(first)) kind = ["숨은 기능·모르면 손해", 321];
else if (/(셨죠|없으세요|계셨나요|하시죠|분들은|할 때|때마다|어려우|귀찮|막막)/.test(first)) kind = ["문제 상황 공감", 282];
else if (/\?$/.test(first)) kind = ["질문", 191];
else if (/(했더니|해 봤|만든 |만들었|풀어봤|시켜 봤|나왔습니다$|나옵니다$)/.test(first) && /\d/.test(first)) kind = ["결과·시연 먼저", 158];
else if (/(드디어|나왔|출시|공개|발표|등장)/.test(first)) kind = ["새 소식 선언", 169];
else if (/(\d+\s?가지|세 가지|두 가지|하나만|딱 )/.test(first)) kind = ["개수 예고", 142];
else if (/(나는|저는|제가|나야|입니다\.?$)/.test(first) && /(AI|챗GPT|클로드|제미나이)/.test(first)) kind = ["의인화·상황극", 83];
if (!kind) hit("첫 문장 유형", -15, `분류가 안 된다. 가장 센 둘: "회사에서 ○○할 때 어려우셨죠"(공감, 42%) / "이거 모르면 매달 손해 봅니다"(숨은 기능, 조회 중앙 321만)`);
else hit("첫 문장 유형", kind[1] >= 280 ? 0 : kind[1] >= 150 ? -5 : -10, `${kind[0]} (이 유형 조회 중앙 ${kind[1]}만)`);
// 2. 첫 문장 요소: 0.5초 안에 말 시작(93%), 15자 안팎, 핵심 단어(숫자·서비스 이름) 1.5초 안, 화면 속 실물 가리키기(45%), 시청자에게 직접 묻기(30%), 숫자(47%)
const fl = len(first);
if (fl > 28) hit("첫 문장 길이", -10, `${fl}자. 15~25자. 배경 설명을 빼고 궁금증 하나만`);
else hit("첫 문장 길이", 0, `${fl}자`);
if (!/\d|챗GPT|클로드|제미나이|엑셀|아이폰|갤럭시|윈도우|노션|AI/.test(first)) hit("핵심 단어", -8, "첫 문장 안에 숫자나 서비스 이름이 없다(1.5초 안에 들려야 한다)");
if (/(이렇게|이런|이거|여기|이 화면|이 버튼)/.test(first)) hit("실물 가리키기", 0, "화면 속 실물을 가리키는 말 있음(터진 60편 중 45%)");
if (/(회사|직장|업무|보고서|상사|팀장)/.test(first)) hit("내 업무", 0, "회사·업무 단어 있음(27%)");
// 결론 노출: 첫 문장에 결말을 말하면 볼 이유가 사라진다
if (/(결국|그래서|때문에|덕분에).*(됐|했|됩니다|합니다)$/.test(first)) hit("결론 노출", -10, "첫 문장이 결말까지 말한다. 결론은 끝에서 두 번째 장면에");

// 3. 이야기 사슬: "그런데/그래서"로 잇고 "그리고" 나열 금지, 중간 재훅, 끝은 질문 금지(반전 한 줄)
const body = scenes.slice(1).join("\n");
const andCount = (body.match(/그리고/g) || []).length, turnCount = (body.match(/(그런데|근데|그래서|하지만|반전은|진짜 무서운 건|문제는)/g) || []).length;
if (andCount >= 2) hit("나열", -10, `"그리고" ${andCount}번. 장면은 "그런데/그래서"로만 잇는다`);
if (turnCount === 0 && scenes.length > 3) hit("사슬", -10, `장면 사이에 "그런데·그래서"가 없다. 사건 → 더 큰 문제 → 내 일로 판을 키우기`);
else hit("사슬", 0, `뒤집기·연결 ${turnCount}번`);
const mid = scenes[Math.floor(scenes.length / 2)] || "";
if (scenes.length >= 5 && !/(근데|진짜|무서운|문제는|여기서부터|이 다음)/.test(mid + (scenes[Math.floor(scenes.length / 2) + 1] || ""))) hit("재훅", -5, `중간(50% 지점)에 "근데 진짜 무서운 건 이 다음이에요" 같은 재훅 한 줄`);
const last = scenes[scenes.length - 1] || "";
if (/\?$/.test(last)) hit("끝", -8, "끝이 질문. 쇼츠 끝은 질문 말고 반전 한 줄로 첫 장면을 다시 보게(댓글 유도는 자막·캡션에서)");
else hit("끝", 0, "반전·한 방으로 끝남");
// 저장할 물건: 복사할 프롬프트·설정 경로 한 줄이 끝에서 세 번째쯤 고정(저장 중앙 14.6 vs 없는 편 4.8)
if (!/(이렇게 치세요|이 문장|이 한 줄|설정에서|메뉴에서|누르면|입력하면|복사|저장해 두)/.test(body)) hit("저장할 물건", -8, "따라 할 한 줄(복사할 문장·설정 경로)이 없다. 끝에서 세 번째 장면에 2초 이상 고정");
// 4. 낯선 말
const JARGON = ["프롬프트", "에이전트", "토큰", "API", "MCP", "파인튜닝", "벡터", "RAG", "LLM", "오픈소스", "깃허브", "벤치마크", "파라미터", "컨텍스트", "임베딩", "멀티모달", "플러그인", "터미널", "온디바이스", "양자화", "가중치", "모델"];
const found = JARGON.filter((w) => src.includes(w)); if (found.length >= 2) hit("낯선 말", -10, `${found.join("·")}. 하나만 남기고 풀어 쓰기`);
// 5. 길이·말 속도: 30~60초가 조회 중앙 227~237만, 60초 넘으면 118만. 터진 편 초당 7.6자(우리 첫 주 5.2~5.8)
const total = scenes.reduce((s, l) => s + len(l), 0);
if (sec) { const cps = +(total / sec).toFixed(1); if (sec > 60) hit("길이", -10, `${sec}초. 60초 넘으면 조회 중앙이 절반(118만)`); else if (sec < 25) hit("길이", -5, `${sec}초. 30~60초가 가장 좋다`); else hit("길이", 0, `${sec}초`); if (cps < 6.5) hit("말 속도", -8, `초당 ${cps}자. 터진 편은 7.6자. 말을 더 붙이거나 길이를 줄이기`); else hit("말 속도", 0, `초당 ${cps}자`); }
else hit("길이", 0, `글자 ${total}자 → 초당 7.5자면 약 ${Math.round(total / 7.5)}초(--sec 로 실제 길이를 주면 말 속도를 본다)`);
if (/(충격|경악|꼭 보세요|실화)/.test(src)) hit("과장", -5, "충격·경악·꼭 보세요 금지");
if (/[\u4e00-\u9fff]/.test(src)) hit("한자", -30, "한자 금지");
score = Math.max(0, Math.min(100, score));
console.log(`릴스·쇼츠 대본 검사  ${score}점 — ${score >= 85 ? "찍어도 됨" : score >= 65 ? "첫 문장·끝 손보기" : "다시 쓰기"}\n`);
for (const r of R) console.log(`${r.p < 0 ? "▼" : "·"} ${r.n.padEnd(7, " ")} ${r.p ? `(${r.p}) ` : ""}${r.w}`);
console.log(`\n첫 문장: ${first}\n` + JSON.stringify({ score, kind: kind ? kind[0] : null, firstLen: fl, scenes: scenes.length, chars: total, sec, issues: R.filter((r) => r.p < 0).map((r) => r.n) }));
