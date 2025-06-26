const { parseRules, RuleType } = require('../src/parser');
const { writeRulesToFile } = require('../src/writer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function runTests() {
  console.log(chalk.blue('\n🧪 Running tests...\n'));

  try {
    // Test 1: Parse rules from .cursor/rules directory
    console.log(chalk.cyan('Test 1: Parsing .mdc rules from .cursor/rules'));
    const rulesDir = path.join(__dirname, '..', '.cursor', 'rules');
    const categorizedRules = await parseRules(rulesDir);

    console.log(chalk.green('✓ Successfully parsed rules'));
    console.log(
      `  - Always rules: ${categorizedRules[RuleType.ALWAYS].length}`,
    );
    console.log(
      `  - Agent Requested rules: ${
        categorizedRules[RuleType.AGENT_REQUESTED].length
      }`,
    );
    console.log(
      `  - Auto Attached rules: ${
        categorizedRules[RuleType.AUTO_ATTACHED].length
      }`,
    );
    console.log(
      `  - Manual rules: ${categorizedRules[RuleType.MANUAL].length}`,
    );

    // Test 2: Write to CLAUDE.md
    console.log(chalk.cyan('\nTest 2: Writing CLAUDE.md'));
    const claudeOutput = path.join(__dirname, 'output', 'CLAUDE.md');
    await writeRulesToFile(categorizedRules, claudeOutput, 'claude');
    console.log(chalk.green('✓ Successfully created CLAUDE.md'));

    // Test 3: Write to GEMINI.md
    console.log(chalk.cyan('\nTest 3: Writing GEMINI.md'));
    const geminiOutput = path.join(__dirname, 'output', 'GEMINI.md');
    await writeRulesToFile(categorizedRules, geminiOutput, 'gemini');
    console.log(chalk.green('✓ Successfully created GEMINI.md'));

    // Test 4: Verify file contents
    console.log(chalk.cyan('\nTest 4: Verifying file contents'));
    const claudeContent = await fs.readFile(claudeOutput, 'utf8');
    const geminiContent = await fs.readFile(geminiOutput, 'utf8');

    // Check that comment headers are NOT present
    if (claudeContent.includes('<!-- CLAUDE.md -->')) {
      throw new Error('CLAUDE.md should not contain comment header');
    }
    if (geminiContent.includes('<!-- GEMINI.md -->')) {
      throw new Error('GEMINI.md should not contain comment header');
    }

    // Check that always rules are included
    if (
      categorizedRules[RuleType.ALWAYS].length > 0 &&
      !claudeContent.includes(
        'The following rules should be considered foundational',
      )
    ) {
      throw new Error('Always rules format is incorrect');
    }

    console.log(chalk.green('✓ File contents verified'));

    // Test 5: Test glob parsing
    console.log(chalk.cyan('\nTest 5: Testing glob parsing'));

    // Find a rule with globs
    const autoAttachedRule = categorizedRules[RuleType.AUTO_ATTACHED][0];
    if (autoAttachedRule) {
      console.log(`  - Globs: ${autoAttachedRule.frontmatter.globs}`);
      console.log(`  - File: ${autoAttachedRule.fileName}`);

      // Verify it appears in the output
      if (!claudeContent.includes(autoAttachedRule.fileName)) {
        throw new Error('Auto-attached rule not found in output');
      }
    }
    console.log(chalk.green('✓ Glob parsing verified'));

    // Clean up test files
    await fs.remove(path.join(__dirname, 'output'));

    console.log(chalk.green('\n✅ All tests passed!\n'));
  } catch (error) {
    console.error(chalk.red(`\n❌ Test failed: ${error.message}\n`));
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
