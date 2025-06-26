# rules-converter

Convert cursor rules to CLAUDE.md or GEMINI.md format.

## Installation

```bash
npm install -g rules-converter
# or
npx rules-converter
```

## Usage

```bash
# Convert to CLAUDE.md
npx rules-converter claude

# Convert to GEMINI.md
npx rules-converter gemini

# Specify custom rules directory
npx rules-converter claude --rules-dir ./my-rules

# Specify custom output file
npx rules-converter claude --output ./output/CLAUDE.md
```

## How it works

This tool reads cursor rule files from `.cursor/rules` directory and converts them to a format suitable for Claude Code or Gemini Code.

### Rule Types

1. **Always Rules** (`alwaysApply: true`)
   - These rules are attached to every chat and command+k request
   - Output format: `프로젝트에서 반드시 아래 파일의 내용을 참고하세요: @.cursor/rules/<filename>`

2. **Agent Requested Rules** (`alwaysApply: false` with `description`)
   - Rules that agents use when the description matches the current context
   - Output format: `<description>: @.cursor/rules/<filename>`

3. **Auto Attached Rules** (with `globs` field)
   - Automatically applied when editing files matching the glob pattern
   - Output format: `<extensions> 해당 확장자 파일을 수정할 때 아래의 룰을 적용하세요: @.cursor/rules/<filename>`

4. **Manual Rules** (others)
   - Rules that need to be manually referenced
   - Not included in the output

### Rule File Format

Each rule file should have YAML frontmatter:

```markdown
---
description: Your rule description
globs: **/*.js,**/*.ts
alwaysApply: false
---

Your rule content here...
```

## Example

Given a `.cursor/rules` directory with:

```
.cursor/rules/
├── always-rule.md (alwaysApply: true)
├── git-convention.md (alwaysApply: false, with description)
├── typescript-rules.md (with globs: **/*.ts,**/*.tsx)
└── manual-rule.md (no special fields)
```

Running `npx rules-converter claude` will create:

```markdown
<!-- CLAUDE.md -->

프로젝트에서 반드시 아래 파일의 내용을 참고하세요:
@.cursor/rules/always-rule.md

Git convention defining branch naming, commit message format:
@.cursor/rules/git-convention.md

.ts, .tsx 해당 확장자 파일을 수정할 때 아래의 룰을 적용하세요:
@.cursor/rules/typescript-rules.md
```

## Options

- `-r, --rules-dir <path>`: Path to rules directory (default: `.cursor/rules`)
- `-o, --output <path>`: Output file path (default: `CLAUDE.md` or `GEMINI.md`)
- `-h, --help`: Display help
- `-V, --version`: Display version

## License

MIT