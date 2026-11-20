# itstory

## SVG 수정/생성 후 중복 속성 검증 필수

SVG 파일(특히 `assets/images/story_*.svg`)을 수정하거나 스크립트로 일괄 생성한 뒤에는 **한 태그 안에 동일 속성명이 두 번 들어갔는지** 반드시 확인할 것.

예:
```xml
<text x="295" ... x="500">...</text>   <!-- 중복 x -->
<rect rx="10" rx="10"/>                <!-- 값이 같아도 무효 -->
```

### 왜 중요한가

브라우저는 `<img src="*.svg">`로 로드된 SVG를 **엄격한 XML 파서**로 처리한다. XML 스펙상 같은 요소에 동일 속성명이 두 번 존재하면 well-formedness 위반이라 해당 SVG 전체가 렌더링되지 않는다 (이미지가 깨진 채 안 뜸). 값이 같은 중복조차 거부된다.

2026-04-08 `web-structure.html`의 1967년 삽화가 안 뜨는 증상을 조사하다 발견됐고, 180개 중 5개 파일에서 같은 패턴이 있었다. HTML/CSS 문제로 오진하기 쉬우므로 "이미지가 안 뜬다" 증상이면 SVG 소스부터 확인.

### 전수 스캔 방법 (bash/awk)

```bash
cd d:/workspace/itstory
for f in assets/images/story_*.svg; do
  awk '/<(text|rect|circle|line|polygon|path|g|use|image|ellipse)[ >]/ {
    line=$0
    while (line !~ /\/?>/ && (getline nxt) > 0) line = line " " nxt
    match(line, /<[a-zA-Z]+[^>]*>/)
    tag = substr(line, RSTART, RLENGTH)
    for (attr in seen) delete seen[attr]
    t = tag
    while (match(t, /[ \t]([a-zA-Z_:][a-zA-Z0-9_:.-]*)="[^"]*"/)) {
      attr_start = RSTART + 1
      attr_len = index(substr(t, attr_start), "=") - 1
      attr = substr(t, attr_start, attr_len)
      if (seen[attr]) print FILENAME ":" NR ": duplicate " attr
      seen[attr] = 1
      t = substr(t, RSTART + RLENGTH)
    }
  }' "$f"
done
```

### 수정 원칙

중복 발견 시 **뒤쪽 속성을 유지**하고 앞쪽을 제거. 편집자가 override 의도로 뒤에 추가한 경우가 많기 때문.

## Image Asset Storage Optimization & Quality Gate (Permanent, 2026-11-20)
- Apply this rule across every project under `D:\workspace` (including `harem`, `cupid`, `chatbot`) whenever adding, regenerating, editing, or optimizing PNG/WebP image assets.
- **원본 해상도(`width x height`) 절대 축소 금지**: 사용자가 별도로 리사이즈를 명시하지 않는 한 원본 픽셀 해상도를 그대로 유지하고 포맷 압축으로만 용량을 줄인다.
- **불투명 이미지 알파 제거**: 실제 투명이 필요 없는 불투명 이미지(`alpha == 255` 전체)는 불필요한 알파 채널을 제거(`RGBA -> RGB`)해 저장한다.
- **투명 이미지 무손실 PNG 최소 바이트 선택**:
  - 투명 배경(RGBA) PNG는 저장 전 `alpha == 0` 픽셀의 RGB를 반드시 `(0, 0, 0)`으로 초기화한다.
  - Pillow(`format="PNG", optimize=True, compress_level=9`)와 `sharp`(`.png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })` — `palette: false` 누락 시 `sharp@0.35.4`에서 자동 팔레트 양자화가 발생할 수 있으므로 반드시 명시)를 비교해 4채널 무손실(`max_abs_diff == 0`) 검증을 통과한 더 작은 바이트 버퍼를 채택한다.
- **정확 알파 WebP 서빙 인코딩 및 정량 화질 게이트**:
  - 최종 무손실 PNG로부터 `sharp.webp({ quality: q, alphaQuality: 100, effort: 6, smartSubsample: false })`로 인코딩하며, `q`를 `92 -> 95 -> 98` 순으로 상향해 아래 기준을 모두 충족하는 최소 `q`를 채택한다:
    1. PNG와 픽셀 해상도(`width x height`) 100% 일치.
    2. 알파 채널 최대 오차 `alphaMaxDiff == 0` (완전 무손실 알파).
    3. 어두운 배경(`#181824`) 및 흰 배경(`#FFFFFF`) 합성 비교 기준 모두 `SSIM >= 0.99`, `MAE <= 1.5`.
    4. PNG 대비 용량 절감 `>= 15%` 달성(기존 미수정 에셋 최적화 시 기존 WebP가 이미 기준을 통과하고 `<= 250KB`이며 추가 절감 폭이 미미하면 불필요한 교체를 생략할 수 있다).
  - 정량 기준을 1건이라도 통과하지 못한 파일은 R2 게시·커밋·배포하지 않는다.
