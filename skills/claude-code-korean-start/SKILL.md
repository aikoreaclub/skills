---
name: claude-code-korean-start
description: Guide a Korean first-time user through installing and setting up Claude (claude.ai, desktop, mobile) and Claude Code on Mac or Windows, in Korean, with Korean-specific pitfalls (phone verification, PATH on Windows PowerShell, Korean folder names, plan requirements). Use when a Korean user says they want to start using Claude or Claude Code, asks which plan to pick, or hits an install/login error. Ends with a first real deliverable: turning meeting notes into a report.
---

# 클로드·클로드 코드 한국어 시작 스킬 (claude-code-korean-start)

처음 쓰는 한국 사용자를 30분 안에 "설치 끝, 첫 결과물 하나"까지 데려간다. 컴퓨터를 잘 몰라도 따라올 수 있게 한 번에 한 단계씩, 확인 방법을 붙여서 안내한다. AI Korea Club 클로드 설치팩(2026-10-06 기준, 요금은 공식 페이지에서 다시 확인)을 스킬로 옮긴 것이다.

## 언제 쓰나
- "클로드 처음인데 어떻게 시작해?", "클로드 코드 깔아 줘", "요금제 뭐 골라?"
- 설치·로그인 중 오류 메시지를 들고 왔을 때 → `references/troubleshooting.md` 먼저 본다

## 안내 원칙
- 한 번에 한 단계. 단계마다 "이렇게 보이면 성공" 확인 줄을 붙인다.
- 사람의 운영체제(맥/윈도우)를 먼저 묻는다. 모르면 "키보드에 ⌘ 키가 있으면 맥"으로 구분시킨다.
- 명령은 복사해 붙여 넣을 수 있게 한 줄씩 코드 블록으로. 설명은 존댓말.
- 요금·정책은 바뀐다. 금액을 말할 때는 "공식 페이지에서 한 번 더 확인"을 붙인다.

## 단계
1. **계정** — claude.ai 에서 구글로 계속 또는 이메일 링크. 처음엔 휴대폰 문자 인증(6자리)이 필수, 인터넷 전화 번호는 안 됨. 만 18세 이상. 확인: 왼쪽 아래 이름 첫 글자.
2. **요금제** — 1~8단계는 무료로 다 된다. 클로드 코드는 Pro 이상(무료 요금제에선 안 됨). 금액은 claude.com/pricing 에서 확인.
3. **데스크톱 앱** — claude.com/download. 윈도우 ARM 노트북은 arm64 판. 확인: 웹과 같은 대화 목록.
4. **휴대폰 앱** — 앱스토어 "Claude by Anthropic", 구글 플레이 동일. 같은 계정 로그인.
5. **첫 설정(지침)** — 설정 → 클로드에게 주는 지침에 아래를 넣게 한다. [직무]만 바꾸게.
   ```
   나는 [직무]로 일하는 직장인이에요. 답은 한국어 존댓말로 해 주세요. 결론을 맨 위 세 줄 안에 먼저 쓰고, 자세한 설명은 그 아래에 써 주세요. 모르는 건 지어내지 말고 모른다고 말해 주세요. 비교할 게 있으면 표로 정리해 주세요.
   ```
6. **프로젝트** — 프로젝트 하나 만들고 자주 보는 자료 올리기(PDF·DOCX·XLSX·CSV·TXT·이미지, 파일당 30MB). 지침: "올려 둔 자료의 용어와 이름을 그대로, 자료에 없는 내용은 [확인 필요]".
7. **연결(선택)** — 입력창 + → 커넥터에서 지메일·캘린더·드라이브. 기본은 매번 허락을 묻는 방식, 처음엔 그대로.
8. **첫 결과물: 회의 메모 → 보고서** — 아래 프롬프트에 메모를 붙여 넣게 한다. 결과에서 [확인 필요]만 채우면 끝.
   ```
   아래 회의 메모를 팀장님께 올릴 보고서로 정리해 주세요.
   형식: 1. 한 줄 결론 2. 정해진 것 3. 할 일 표(할 일 | 담당 | 마감) 4. 아직 못 정한 것
   규칙: 메모에 없는 내용은 지어내지 말고 [확인 필요]라고 적어 주세요. 존댓말로, A4 반 장 안으로.
   회의 메모:
   [회의 메모]
   ```
9. **(선택) 클로드 코드 설치** — 맥은 터미널, 윈도우는 PowerShell(CMD 아님, 관리자 권한 불필요). 공식 설치 명령은 code.claude.com/docs/en/setup 의 현재 명령을 그대로 복사하게 한다. 끝나면 새 창에서 `claude --version`.
10. **(선택) 클로드 코드 첫 명령** — 정리하고 싶은 폴더로 `cd` 한 뒤 `claude`. 첫 프롬프트는 파일을 바꾸지 않는 것으로:
    ```
    이 폴더에 있는 파일 목록을 보고, 각각 무슨 파일인지 한 줄씩 표로 정리해 줘. 파일은 고치지 마.
    ```

## 한국 사용자가 자주 걸리는 것
- 윈도우에서 `irm` 을 모른다고 하면 CMD 창이다 → PowerShell 로.
- `claude` 를 못 찾으면 터미널 창을 닫고 새로 연다(PATH 반영).
- 로그인 뒤 403 → 무료 요금제. Pro 이상 필요.
- 한글 이름 폴더도 되지만, 명령 복사 시 따옴표로 감싸게 한다: `cd "바탕화면/회의 자료"`.
- 맥에서 "터미널이 데스크탑 폴더에 접근하려고 합니다" 창은 허용.

더 자세한 오류별 답은 `references/troubleshooting.md`.
