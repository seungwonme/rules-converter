# 설명

@.cursor/rules 폴더에 있는 모든 커서룰을 CLAUDE.md 파일에 옮기는 npm 패키지를 만들고 싶어

커서룰에는 총 4가지 종류가 있어

## Always

- This rule is attached to every chat and command+k request.
- 예시:
  ```markdown
  ---
  description:
  globs:
  alwaysApply: true
  ---
  ```
  으로 시작, 하단에 룰 내용을 작성

## Agent Requested

- 이 룰은 에이전트가 설명을 보고 현재 상황에 필요하면 사용하는 룰
- 예시:
  ```markdown
  ---
  description: Git convention defining branch naming, commit message format, and issue labeling based on GitFlow and Conventional Commits.
  globs:
  alwaysApply: false
  ---
  ```
  으로 시작, 하단에 룰 내용을 작성

## Auto Attached

- globs 필드에 있는 패턴과 맞는 파일을 수정할 때 자동으로 적용되는 룰
- 예시:
  ```markdown
  ---
  description: This rule defines unified conventions and best practices for building scalable, maintainable, and consistent fullstack applications with Next.js, covering file naming, directory structure, component architecture, and technology stack guidelines based on React 19 and Next.js 15.
  globs: **/*.js,**/*.jsx,**/*.ts,**/*.tsx
  alwaysApply: false

  ---
  ```
  으로 시작, 하단에 룰 내용을 작성

## Manual

- This rule needs to be mentioned to be included
- 예시:
  ```markdown
  ---
  description:
  globs:
  alwaysApply: false
  ---
  ```
  으로 시작, 하단에 룰 내용을 작성

# 실행 예시:

## Claude Code
```bash
$ npx rules-converter claude # For Claude Code
```

```markdown
<!-- CLAUDE.md -->

프로젝트에서 반드시 아래 파일의 내용을 참고하세요:
@.cursor/rules/<Always인 룰 파일명>

프로젝트에서 반드시 아래 파일의 내용을 참고하세요:
@.cursor/rules/<Always인 룰 파일명>

... <!-- Always 룰 반복 -->

<Agent Requested 룰의 Description 필드에 있는 프롬프트>:
@.cursor/rules/<Agent Requested 룰 파일명>

<Agent Requested 룰의 Description 필드에 있는 프롬프트>:
@.cursor/rules/<Agent Requested 룰 파일명>

... <!-- Agent Requested 룰 반복 -->

<Auto Attached 룰의 globs 필드에 있는 파일 확장자명> 해당 확장자 파일을 수정할 때 아래의 룰을 적용하세요:
@.cursor/rules/<Auto Attached 룰 파일명>

<Auto Attached 룰의 globs 필드에 있는 파일 확장자명> 해당 확장자 파일을 수정할 때 아래의 룰을 적용하세요:
@.cursor/rules/<Auto Attached 룰 파일명>

... <!-- Auto Attached 룰 반복 -->

<!-- Manual 룰은 따로 추가하지 않음 -->

```


## Gemini Code
```bash
$ npx rules-converter gemini # For Gemini Code
```

```markdown
<!-- GEMINI.md -->

프로젝트에서 반드시 아래 파일의 내용을 참고하세요:
@.cursor/rules/<Always인 룰 파일명>

프로젝트에서 반드시 아래 파일의 내용을 참고하세요:
@.cursor/rules/<Always인 룰 파일명>

... <!-- Always 룰 반복 -->

<Agent Requested 룰의 Description 필드에 있는 프롬프트>:
@.cursor/rules/<Agent Requested 룰 파일명>

<Agent Requested 룰의 Description 필드에 있는 프롬프트>:
@.cursor/rules/<Agent Requested 룰 파일명>

... <!-- Agent Requested 룰 반복 -->

<Auto Attached 룰의 globs 필드에 있는 파일 확장자명> 해당 확장자 파일을 수정할 때 아래의 룰을 적용하세요:
@.cursor/rules/<Auto Attached 룰 파일명>

<Auto Attached 룰의 globs 필드에 있는 파일 확장자명> 해당 확장자 파일을 수정할 때 아래의 룰을 적용하세요:
@.cursor/rules/<Auto Attached 룰 파일명>

... <!-- Auto Attached 룰 반복 -->

<!-- Manual 룰은 따로 추가하지 않음 -->

```
