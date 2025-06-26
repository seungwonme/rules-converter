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
   - **✨ New in v1.1.0**: Multiple Always rules are grouped under one prompt to reduce redundancy
   - Output format:

     ```
     The following rules should be considered foundational. Make sure you're familiar with them before working on this project:

     @.cursor/rules/<filename1>
     @.cursor/rules/<filename2>
     @.cursor/rules/<filename3>
     ```

2. **Agent Requested Rules** (`alwaysApply: false` with `description`)

   - Rules that agents use when the description matches the current context
   - Output format: `<description>: @.cursor/rules/<filename>`

3. **Auto Attached Rules** (with `globs` field)

   - Automatically applied when editing files matching the glob pattern
   - **✨ New in v1.1.0**: Rules with identical file extensions are grouped together to reduce redundancy
   - Output format:
     ```
     When working with files that match the following extensions (.js, .jsx, .ts, .tsx), review and apply the relevant rules:
     @.cursor/rules/<filename1>
     @.cursor/rules/<filename2>
     ```

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

The following rules should be considered foundational. Make sure you're familiar with them before working on this project:

@.cursor/rules/always-rule.md

Git convention defining branch naming, commit message format:
@.cursor/rules/git-convention.md

When working with files that match the following extensions (.ts, .tsx), review and apply the relevant rules:
@.cursor/rules/typescript-rules.md
```

## Options

- `-r, --rules-dir <path>`: Path to rules directory (default: `.cursor/rules`)
- `-o, --output <path>`: Output file path (default: `CLAUDE.md` or `GEMINI.md`)
- `-h, --help`: Display help
- `-V, --version`: Display version

## Advanced Usage

### Multiple File Extensions

If you have rules that apply to different file extensions, they will be grouped appropriately:

```markdown
---
description: Frontend coding standards
globs: **/*.js,**/*.jsx,**/*.ts,**/*.tsx
alwaysApply: false
---
```

```markdown
---
description: Python coding standards
globs: **/*.py,**/*.pyi
alwaysApply: false
---
```

Output:

```
When working with files that match the following extensions (.js, .jsx, .ts, .tsx), review and apply the relevant rules:
@.cursor/rules/frontend-standards.md

When working with files that match the following extensions (.py, .pyi), review and apply the relevant rules:
@.cursor/rules/python-standards.md
```

### Custom Directory Structure

You can organize your rules in subdirectories:

```
.cursor/rules/
├── languages/
│   ├── typescript.md
│   └── python.md
├── frameworks/
│   ├── nextjs.md
│   └── django.md
└── general/
    └── git-convention.md
```

All `.md` and `.mdc` files will be processed recursively.

## Changelog

### v1.1.0

- ✨ **New**: Always rules are now grouped under one prompt to reduce redundancy
- ✨ **New**: Auto Attached rules with identical file extensions are grouped together
- 🔧 **Improved**: More concise output format with less repetitive text
- 📝 **Updated**: Enhanced documentation with examples

### v1.0.0

- 🎉 Initial release
- ✅ Support for Always, Agent Requested, Auto Attached, and Manual rules
- ✅ CLI interface with customizable options
- ✅ Support for both CLAUDE and GEMINI formats

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
