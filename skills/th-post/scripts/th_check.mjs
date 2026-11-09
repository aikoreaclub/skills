#!/usr/bin/env node
// 쓰레드 글 검사기 — 한국어 AI·IT·직장 쓰레드 바이럴 49편(조회 4만+ 16편 vs 1천 미만 12편)과 밤샘AI 125편 분석에서 뽑은 규칙으로 점수를 낸다.
// 사용: node th_check.mjs 글.txt   또는   cat 글.txt | node th_check.mjs
// 의존성 없음. 네트워크 없음. 결과는 사람이 읽는 표 + 마지막 줄 JSON.
import fs from "node:fs";
const src = process.argv[2] && process.argv[2] !== "-" ? fs.readFileSync(process.argv[2], "utf8") : fs.readFileSync(0, "utf8");
const lines = src.replace(/\r/g, "").split("\n").map((l) => l.trimEnd());
const body = lines.filter((l) => !/^(출처|원문|원글|링크)\s/.test(l) && !/https?:\/\//.test(l)); // 출처·링크 줄은 길이에서 뺀다(규칙)
const text = body.join("\n");
const noSpace = text.replace(/\s/g, "").length;
const first = body.find((l) => l.trim()) || "";
const nonEmpty = body.filter((l) => l.trim());
const R = []; let score = 100;
const hit = (name, pts, why) => { R.push({ name, pts, why }); score += pts; };

// 1. 길이: 띄어쓰기 빼고 150~220자가 조회 중앙 최고(176), 280자 넘으면 87. 250자 넘으면 게시 도구가 안 올린다.
if (noSpace > 250) hit("길이", -25, `${noSpace}자. 250자 넘으면 안 올라간다. 사실을 4개까지만 남기고 자르기`);
else if (noSpace > 220) hit("길이", -8, `${noSpace}자. 220자 아래가 조회 중앙 176으로 가장 좋았다`);
else if (noSpace < 60) hit("길이", -10, `${noSpace}자. 너무 짧아 할 말(단정 한 줄·할 일 하나)이 빠졌을 가능성`);
else hit("길이", 0, `${noSpace}자(띄어쓰기 뺌). 적당`);

// 2. 첫 줄 꼴: 바로잡기 / 대상 찌르기 / 아는 이름 vs 한 사람 / 해 봤더니 / 비교·투표. 담담한 소식 첫 줄은 4만+ 16편 중 0편.
const FAMOUS = /(올트먼|머스크|저커버그|놀란|젠슨 황|오픈AI|구글|애플|삼성|네이버|카카오|챗GPT|클로드|제미나이|엔비디아|마이크로소프트|메타|테슬라|아마존|넷플릭스|디즈니|유튜브|인스타|틱톡|윈도우|아이폰|갤럭시|할리우드|봉준호|BTS)/;
const SMALL = /(한 사람|한 명|혼자|집 컴퓨터|노트북 한 대|공짜|무료|며칠|하루 만에|주말에|코딩 한 줄 모르는|16년 차|워킹맘|고등학생)/;
const kinds = [];
if (/(하지 ?마|치지 ?마|라고만|잘못 쓰고|아직도|그렇게 쓰면|틀렸|오해)/.test(first)) kinds.push("바로잡기");
if (/(직장인|취준생|사장님|자영업|회사원|신입|대학생|부모|마케터|디자이너|개발자|1인|프리랜서|쓰는 사람|쓰는 분)/.test(first) && /(만|이면|이제|은 |는 |들은|들,|,)/.test(first)) kinds.push("대상 찌르기");
if (FAMOUS.test(first) && SMALL.test(first)) kinds.push("아는 이름 vs 한 사람");
if (/(했더니|해 봤더니|해보니|써 봤더니|써보니|시켜 봤더니|물어봤더니)/.test(first)) kinds.push("해 봤더니");
if (/( vs |냐 |이냐|둘 중|파\b|파,|고른다면)/.test(first)) kinds.push("비교·투표");
if (/\?$/.test(first.trim()) && !kinds.length) kinds.push("질문");
const newsy = /(출시|공개|발표|업데이트|나왔|등장|선보|도입)/.test(first) && !kinds.length;
if (newsy) hit("첫 줄", -30, `담담하게 소식을 알리는 첫 줄. 4만+ 글 16편 중 0편이 이 꼴. 바로잡기·대상 찌르기·아는 이름 vs 한 사람 중 하나로 다시 쓰기`);
else if (!kinds.length) hit("첫 줄", -15, `꼴이 안 잡힌다. 첫 줄은 셋 중 하나: "○○해 줘라고만 치지 마, ○○ 5개 알려 줄게" / "○○만 반복하는 직장인, 시간 버리는 중" / "놀란이 3천억 쓴 영화를 한 사람이 노트북으로"`);
else hit("첫 줄", 0, `${kinds.join("+")} 꼴`);
if (first.replace(/\s/g, "").length > 45) hit("첫 줄 길이", -5, `첫 줄 ${first.replace(/\s/g, "").length}자. 한 줄에 잡히게 40자 안쪽`);

// 3. 단정하는 의견 한 줄: 4만+ 16편 중 10편. 같은 꿀팁인데 단정이 없던 글은 420.
const ASSERT = /(솔직히|그냥|무조건|절대|진짜|결국|사실상|이건 .*(임|다|큼|맞음)|라고 봄|이라고 봄|더 큼|필요 없|써야 함|외워 둘|하면 됨|쪽$)/m;
if (ASSERT.test(nonEmpty.slice(1).join("\n"))) hit("단정 한 줄", 0, "입장이 있는 줄 있음");
else hit("단정 한 줄", -15, `둘째 덩어리에 단정하는 의견 한 줄이 없다("솔직히 이건 디자이너보다 회사원한테 더 큼")`);

// 4. 낯선 말: 처음 듣는 이름·업계 말은 글 전체 하나까지. 죽은 글(6~19회)은 모두 낯선 말 2개 이상.
const JARGON = ["프롬프트", "에이전트", "토큰", "API", "MCP", "지시문", "파인튜닝", "벡터", "RAG", "LLM", "오픈소스", "깃허브", "레딧", "해커뉴스", "벤치마크", "파라미터", "추론", "컨텍스트", "임베딩", "멀티모달", "하네스", "플러그인", "터미널", "CLI", "코덱스", "워크플로", "온디바이스", "양자화", "가중치", "서버", "클라우드", "배포", "SDK", "토막", "트랜스포머", "GPU", "로컬", "모델"];
const found = JARGON.filter((w) => text.includes(w));
if (found.length >= 2) hit("낯선 말", -10 * Math.min(3, found.length - 1), `${found.join("·")}. 하나만 남기고 쉬운 말로 풀기(도구 이름→"그림 AI", 프롬프트→"시키는 말")`);
else hit("낯선 말", 0, found.length ? `${found[0]} 하나. 허용` : "없음");

// 5. 덩어리·줄: 첫 글은 3~5줄(덩어리 5~7개, 한 줄에 사실 하나). 단계 목록(→ 나열) 금지.
const arrows = (text.match(/→|➡|->/g) || []).length;
if (arrows >= 2) hit("단계 나열", -15, `화살표 ${arrows}개. "설정 → 시스템 → 정보" 식 단계 목록은 41분에 좋아요 1이었다. 방법은 답글로 미루거나 한 줄로`);
const numbered = nonEmpty.filter((l) => /^\d+[.)]\s/.test(l)).length;
if (numbered >= 4) hit("목록", -5, `번호 목록 ${numbered}줄. 첫 글엔 개수만 약속하고 목록은 답글로(4만+ 목록형 8편 중 5편이 이 방식)`);
if (nonEmpty.length > 12) hit("줄 수", -8, `${nonEmpty.length}줄. 덩어리 5~7개로`);

// 6. 본문 링크·해시태그: 4만+ 16편 모두 본문 링크 0. 해시태그 단 5편 중 4편이 조회 120 이하.
if (/https?:\/\//.test(src)) hit("본문 링크", -15, "링크는 본문 말고 댓글로");
if (/(^|\s)#[^\s#]+/.test(src)) hit("해시태그", -15, "쓰레드 본문 해시태그는 조회를 죽인다. 주제 태그는 게시 설정에서 1개");

// 7. 마침표·말투: 줄 끝 마침표 안 찍음(SNS 규칙), 전부 존댓말 "~요"면 AI 티
const periods = nonEmpty.filter((l) => /[.。]$/.test(l)).length;
if (periods) hit("마침표", -3 * Math.min(3, periods), `줄 끝 마침표 ${periods}줄. SNS 글은 줄 끝에 마침표를 안 찍는다`);
const yo = nonEmpty.filter((l) => /(요|죠)[?!]?$/.test(l)).length;
if (nonEmpty.length >= 4 && yo === nonEmpty.length) hit("말끝", -5, "모든 줄이 ~요. 명사 끊기·~음·~임·질문을 섞기");

// 8. 반전과 끝: 중간에 한 번 뒤집기("근데", "반전은"). 끝은 답글 받고 싶을 때만 판정·투표 요청(답글÷좋아요 7배).
if (!/(근데|반전은|하지만|그런데|알고 보니|사실은)/.test(text)) hit("반전", -8, `중간에 한 번 뒤집는 줄("근데 댓글 1등은 칭찬이 아니라…")이 없다`);
const last = nonEmpty[nonEmpty.length - 1] || "";
const asksVote = /(\?|너넨|너네는|스친들은|몇 번|어느 쪽|대 봐|골라)/.test(last);
hit("끝", 0, asksVote ? "판정·투표 요청으로 끝남(답글이 7배 붙는 꼴)" : "질문 없이 끝남. 비교·논쟁 글이 아니면 괜찮다");

// 9. 금지 표현: 수익·부업(부업 글은 44~516으로 낮았다), 과장
if (/(월 ?\d+만 ?원|수익|부업|돈 버는|벌었)/.test(text)) hit("수익 표현", -20, "수익·부업 표현 금지. 부업 글은 조회 44~516으로 바닥이었다");
if (/(충격|경악|실화|난리|소름|미쳤)/.test(first)) hit("과장", -5, "첫 줄 감탄사는 쓰레드에서 안 먹힌다(쇼츠 제목과 다르다)");
if (/[\u4e00-\u9fff]/.test(src)) hit("한자", -30, "한자 금지");

score = Math.max(0, Math.min(100, score));
const grade = score >= 85 ? "올려도 됨" : score >= 65 ? "첫 줄·단정 손보고 올리기" : "다시 쓰기";
console.log(`쓰레드 글 검사  ${score}점 — ${grade}\n`);
for (const r of R) console.log(`${r.pts < 0 ? "▼" : "·"} ${r.name.padEnd(6, " ")} ${r.pts ? `(${r.pts}) ` : ""}${r.why}`);
console.log(`\n첫 줄: ${first}`);
console.log(JSON.stringify({ score, grade, chars: noSpace, lines: nonEmpty.length, firstLine: first, firstKinds: kinds, jargon: found, issues: R.filter((r) => r.pts < 0).map((r) => r.name) }));
