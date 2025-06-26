# TODO

## 배포

- [x] 터미널에서 로그인
  ```bash
  npm login
  ```
- [x] 로그인 확인
  ```bash
  npm whoami
  ```
- [x] 배포
  ```bash
  npm publish
  ```
- [x] 배포 확인
  ```bash
  npm view rules-converter
  ```
- [ ] 업데이트
  ```bash
  # 코드 수정 후
  npm version patch    # 1.0.0 → 1.0.1 (버그 수정)
  npm version minor    # 1.0.0 → 1.1.0 (새 기능)
  npm version major    # 1.0.0 → 2.0.0 (Breaking changes)

  # 그 후 재배포
  npm publish
  ```

## 문서

- [ ] README.md 더 상세히 작성

## 기능

- [ ] `Always` 룰은 한 프롬프트에 여러 파일 멘션하도록 수정 (프롬프트 중복을 피하기 위해)
- [ ] `Auto Attached`도 마찬가지로 같은 확장자 명인 커서룰 끼리 묶어서 멘션하도록 수정 (프롬프트 중복을 피하기 위해)
