# TODO

배포

- [ ] 터미널에서 로그인
  ```bash
  npm login
  ```
- [ ] 로그인 확인
  ```bash
  npm whoami
  ```
- [ ] 배포
  ```bash
  npm publish
  ```
- [ ] 배포 확인
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
