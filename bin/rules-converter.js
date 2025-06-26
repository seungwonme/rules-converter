#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { convertRules } = require('../src/index');

const program = new Command();

program
  .name('rules-converter')
  .description('Convert cursor rules to CLAUDE.md or GEMINI.md format')
  .version('1.0.0');

program
  .argument('<target>', 'Target format: "claude" or "gemini"')
  .option('-r, --rules-dir <path>', 'Path to rules directory', '.cursor/rules')
  .option('-o, --output <path>', 'Output file path')
  .action(async (target, options) => {
    try {
      // Validate target
      if (!['claude', 'gemini'].includes(target.toLowerCase())) {
        console.error(
          chalk.red('Error: Target must be either "claude" or "gemini"'),
        );
        process.exit(1);
      }

      // Set default output path
      const outputPath = options.output || `${target.toUpperCase()}.md`;

      console.log(
        chalk.cyan(`Converting rules to ${target.toUpperCase()} format...`),
      );
      console.log(chalk.gray(`Rules directory: ${options.rulesDir}`));
      console.log(chalk.gray(`Output file: ${outputPath}`));

      await convertRules({
        target: target.toLowerCase(),
        rulesDir: options.rulesDir,
        outputPath: outputPath,
      });

      console.log(chalk.green(`✅ Successfully created ${outputPath}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
