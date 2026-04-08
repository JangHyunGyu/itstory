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
