# portfolio1 — 예십추크 콘스탄틴 포트폴리오

예십추크 콘스탄틴(Konstantin Yessipchuk)의 개인 포트폴리오 사이트입니다.
대학교 교수님과 앞으로 함께 일할 분들이 "콘스탄틴이 어떤 사람인지" 빠르게 알 수 있도록 만든 한 페이지짜리 사이트입니다.

- 주소: https://knstysp2257-ui.github.io/portfolio1/
- 언어: 한국어(기본) · 러시아어 · 영어 (오른쪽 위 KO / RU / EN 버튼)
- 라이트 / 다크 테마, 휴대폰과 PC 모두 지원
- 정적 사이트: HTML / CSS / JavaScript만 사용합니다. 빌드 과정과 서버가 없습니다. 연락은 이메일(`mailto:`) 링크로만 받습니다.

## 파일 구조

```
index.html            페이지 구조 (섹션, 버튼, 이미지 위치)
404.html              없는 주소로 들어왔을 때 보이는 페이지
css/tokens.css        색상·둥글기·그림자 등 디자인 변수 (라이트/다크)
css/style.css         레이아웃과 컴포넌트 스타일
js/main.js            언어 전환, 테마 전환, 스크롤 애니메이션
i18n/ko.js            한국어 텍스트
i18n/ru.js            러시아어 텍스트
i18n/en.js            영어 텍스트
assets/               이미지 (SVG 자리표시 그림, 파비콘, 공유용 OG 이미지)
robots.txt            검색 엔진 안내 (아래 "검색 엔진 등록" 참고)
sitemap.xml           사이트 지도 (검색 엔진용)
.nojekyll             GitHub Pages가 파일을 그대로 보여 주도록 하는 빈 파일
prototype/            승인된 프로토타입 (참고용, 메뉴에는 연결되지 않지만 공개 주소로 열림 — 아래 참고)
PLAN.md               사이트 계획서 (공개 주소로 열림 — 아래 참고)
```

## 텍스트 수정하기

모든 문구는 `i18n/` 폴더의 세 파일에 있습니다. 파일은 이런 모양입니다.

```js
window.I18N = window.I18N || {};
window.I18N.ko = {
  "hero.name": "예십추크 콘스탄틴",
  "hero.desc": "…",
  // ...
};
```

1. 바꾸고 싶은 언어의 파일(`ko.js`, `ru.js`, `en.js`)을 메모장이나 VS Code로 엽니다.
2. 따옴표 `"…"` 안의 **오른쪽 값만** 고칩니다. 왼쪽 키(예: `"hero.desc"`)는 바꾸지 마세요. `index.html`의 `data-i="키"`와 연결되어 있습니다.
3. 줄바꿈은 `<br>`로 넣을 수 있습니다. 문장 안에 큰따옴표가 필요하면 `\"`처럼 씁니다.
4. 세 언어 파일에 **같은 키**가 있어야 합니다. 새 문구를 추가하면 세 파일 모두에 넣어 주세요.
5. **한국어를 고쳤다면 `index.html`도 함께 고쳐 주세요.** `index.html` 안에는 `ko.js`의 한국어 문구가 그대로 복사되어 있습니다 (JavaScript를 실행하지 않는 검색 엔진·카카오톡 미리보기용). 같은 `data-i="키"`가 붙은 태그 안의 글자를 `ko.js`와 똑같이 맞추면 됩니다.
6. 저장한 뒤 `index.html`을 브라우저에서 새로고침해서 확인합니다. (서버 없이 파일을 더블클릭해도 동작합니다.)

> 텍스트는 JSON이 아니라 `.js` 파일로 되어 있습니다. 그래서 `file://`로 열어도, GitHub Pages에서도 똑같이 동작합니다.

## 자리표시 이미지 바꾸기

지금은 본인 사진 대신 자리표시 그림(SVG)을 사용합니다.

| 파일 | 위치 |
|---|---|
| `assets/hero-placeholder.svg` | 첫 화면 오른쪽 그림 (세로 4:5 비율) |
| `assets/case-culture.svg` | 경험 — 컬처 링크 카드 |
| `assets/case-venti.svg` | 경험 — 더벤티 카드 |
| `assets/og-image.svg` | 링크 공유 미리보기 원본 (1200×630) |
| `assets/og-image.png` | 링크 공유 미리보기 — 실제로 사용되는 파일 (SVG를 PNG로 변환한 것) |
| `assets/favicon.svg` | 브라우저 탭 아이콘 |

바꾸는 방법:

1. **가장 쉬운 방법:** 새 이미지를 **같은 이름**으로 `assets/`에 덮어씁니다.
2. 다른 형식(예: `.jpg`, `.webp`)을 쓰려면 파일을 `assets/`에 넣고, `index.html`에서 해당 `src="assets/…svg"` 경로를 새 파일 이름으로 바꿉니다.
3. 비율을 맞춰 주세요 (첫 화면 그림은 4:5). 용량은 가능하면 500KB 이하로 줄여 주세요.
4. 경로는 항상 `assets/…`처럼 **상대 경로**로 씁니다. `/assets/…`처럼 `/`로 시작하면 GitHub Pages에서 이미지가 깨집니다.
5. 공유 미리보기: 카카오톡·페이스북·X 등은 SVG를 보여 주지 않기 때문에 `index.html`의 `og:image`, `twitter:image`는 `assets/og-image.png`(1200×630)를 가리킵니다. `og-image.svg`를 고쳤다면 PNG도 다시 만들어 덮어써 주세요 (예: 브라우저에서 SVG를 1200×630으로 열고 캡처).

## GitHub Pages로 배포하기

1. 모든 파일을 `knstysp2257-ui/portfolio1` 저장소의 `main` 브랜치에 올립니다 (`index.html`이 저장소 맨 위에 있어야 합니다).
2. 저장소에서 **Settings → Pages**로 갑니다.
3. **Build and deployment → Source:** `Deploy from a branch`
4. **Branch:** `main` / `/ (root)` 을 고르고 **Save**를 누릅니다.
5. 1–2분 뒤 https://knstysp2257-ui.github.io/portfolio1/ 에서 확인합니다.

파일을 수정해서 다시 `main`에 올리면 사이트도 자동으로 업데이트됩니다.

### 공개되는 파일 주의

저장소 맨 위(root)를 배포하면 **저장소의 모든 파일이 공개 주소로 열립니다.** 예: `/portfolio1/PLAN.md`, `/portfolio1/prototype/`. `PLAN.md`는 내부 계획서이고, 사이트에 넣지 않기로 한 내용도 들어 있습니다. 공개하고 싶지 않다면 두 가지를 `main` 브랜치에 올리지 않거나(다른 브랜치·내 컴퓨터에만 보관) 삭제하세요. 어떻게 할지는 콘스탄틴이 정하면 됩니다.

### 검색 엔진 등록

GitHub Pages 프로젝트 사이트에서는 `robots.txt`가 `/portfolio1/robots.txt`에 올라갑니다. 검색 엔진은 도메인 맨 위(`knstysp2257-ui.github.io/robots.txt`)의 파일만 읽기 때문에, 이 파일과 안의 `Sitemap` 줄은 **효과가 없습니다.** 대신 Google Search Console과 네이버 서치어드바이저에 사이트를 등록하고 사이트맵 주소 https://knstysp2257-ui.github.io/portfolio1/sitemap.xml 을 직접 제출하세요.

---

## Кратко по-русски

**Что это.** Личный сайт-портфолио Константина Есипчука (예십추크 콘스탄틴): одна страница на корейском (по умолчанию), русском и английском, светлая и тёмная тема. Статический сайт — только HTML, CSS и JS, без сборки и без сервера; связь через ссылку на почту.

**Структура.** `index.html` — разметка; `css/tokens.css` — цвета и переменные; `css/style.css` — стили; `js/main.js` — переключение языка и темы, анимации; `i18n/ko.js`, `ru.js`, `en.js` — все тексты; `assets/` — картинки-заглушки, favicon, OG-картинка; `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll` — служебные файлы для GitHub Pages; `prototype/` — утверждённый прототип (для справки).

**Как править тексты.** Откройте нужный файл в `i18n/` и меняйте только значение справа (текст в кавычках). Ключ слева (`"hero.desc"`) не трогайте — он связан с `data-i="…"` в `index.html`. Перенос строки — `<br>`. Ключи во всех трёх файлах должны совпадать.

**Как заменить картинки.** Положите новую картинку в `assets/` с тем же именем (например, `hero-placeholder.svg`) или поменяйте путь `src="assets/…"` в `index.html`. Пути всегда относительные, без `/` в начале. Для превью в KakaoTalk и соцсетях используется `assets/og-image.png` (1200×630): если меняете `og-image.svg`, пересоздайте и PNG.

**Важно про корейский текст.** В `index.html` продублированы корейские тексты из `i18n/ko.js` (для поисковиков и превью без JS). Меняя `ko.js`, поправьте тот же `data-i="…"` и в `index.html`.

**Как включить GitHub Pages.** Загрузите файлы в ветку `main` репозитория `knstysp2257-ui/portfolio1` → **Settings → Pages → Deploy from a branch → `main` / `(root)`** → Save. Через 1–2 минуты сайт откроется по адресу https://knstysp2257-ui.github.io/portfolio1/

**Что публикуется.** При публикации из корня ветки `main` открыты все файлы репозитория, включая `PLAN.md` (внутренний план) и `prototype/`. Если это нежелательно — не держите их в `main` или удалите. Решать Константину.

**robots.txt.** Для сайта проекта на GitHub Pages он лежит по адресу `/portfolio1/robots.txt` и поисковиками не читается (они смотрят только корень домена). Отправьте https://knstysp2257-ui.github.io/portfolio1/sitemap.xml вручную в Google Search Console и Naver Search Advisor.
