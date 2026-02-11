# 📝 Markdown 메모장

Markdown을 지원하는 실시간 프리뷰 메모장 웹 애플리케이션입니다.

![GitHub stars](https://img.shields.io/github/stars/yyBro/markdown-memo-app)
![GitHub license](https://img.shields.io/github/license/yyBro/markdown-memo-app)

## ✨ 주요 기능

- **Markdown 에디터**: 완전한 Markdown 문법 지원
- **실시간 프리뷰**: 입력과 동시에 우측에 렌더링 결과 표시
- **메모 관리**:
  - 새 메모 생성
  - 메모 저장 (자동 저장 + 수동 저장)
  - 메모 삭제
  - 메모 검색
- **로컬 저장소**: `localStorage`를 사용하여 브라우저에 메모 저장
- **키보드 단축키**:
  - `Ctrl+S` (또는 `Cmd+S`): 메모 저장
  - `Ctrl+N` (또는 `Cmd+N`): 새 메모 생성

## 🎨 디자인 특징

- 세련된 다크 테마 인터페이스
- 그라디언트 효과와 부드러운 애니메이션
- 반응형 디자인
- Google Fonts의 Inter 폰트 사용

## 🚀 사용 방법

### 로컬에서 실행

1. 저장소 클론:
```bash
git clone https://github.com/yyBro/markdown-memo-app.git
cd markdown-memo-app
```

2. 로컬 서버 실행:
```bash
# Python이 설치되어 있다면
python -m http.server 5500

# 또는 Node.js가 설치되어 있다면
npx serve
```

3. 브라우저에서 `http://localhost:5500` 접속

### 메모 작성

1. **새 메모 생성**: 좌측 상단의 "새 메모" 버튼 클릭
2. **제목 입력**: 상단의 제목 입력란에 메모 제목 입력
3. **내용 작성**: 중앙 에디터에 Markdown 문법으로 내용 작성
4. **실시간 확인**: 우측 프리뷰에서 렌더링 결과 즉시 확인
5. **저장**: 자동으로 저장되며, "저장" 버튼으로 수동 저장 가능

### Markdown 문법 예시

```markdown
# 제목 1
## 제목 2
### 제목 3

**굵은 글씨** 또는 __굵은 글씨__
*기울임* 또는 _기울임_

- 목록 항목 1
- 목록 항목 2

1. 순서 있는 목록
2. 두 번째 항목

`인라인 코드`

```javascript
// 코드 블록
console.log('Hello, World!');
```

> 인용구

[링크 텍스트](https://example.com)
```

## 🛠️ 기술 스택

- **HTML5**: 페이지 구조
- **CSS3**: 스타일링 (CSS Variables, Flexbox, 애니메이션)
- **JavaScript (ES6+)**: 애플리케이션 로직
- **Marked.js**: Markdown → HTML 변환
- **localStorage**: 데이터 영속성

## 📂 프로젝트 구조

```
markdown-memo-app/
├── index.html      # HTML 구조
├── styles.css      # 스타일시트
├── app.js          # JavaScript 로직
└── README.md       # 프로젝트 문서
```

## 📄 라이선스

MIT License

## 🤝 기여

Pull Request와 Issue는 언제나 환영합니다!

---

**Made with ❤️**