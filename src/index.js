const { parseRules } = require('./parser');
const { writeRulesToFile } = require('./writer');
const chalk = require('chalk');

/**
 * Main function to convert rules
 * @param {Object} options - Configuration options
 * @param {string} options.target - Target format ('claude' or 'gemini')
 * @param {string} options.rulesDir - Path to rules directory
 * @param {string} options.outputPath - Path to output file
 */
async function convertRules(options) {
  const { target, rulesDir, outputPath } = options;

  try {
    // Parse all rules
    console.log(chalk.gray('Parsing rules...'));
    const categorizedRules = await parseRules(rulesDir);

    // Write to output file
    console.log(chalk.gray('Writing output file...'));
    const stats = await writeRulesToFile(categorizedRules, outputPath, target);

    // Log statistics
    console.log(chalk.cyan('\nConversion statistics:'));
    console.log(chalk.gray(`  Always rules: ${stats.alwaysCount}`));
    console.log(
      chalk.gray(`  Agent Requested rules: ${stats.agentRequestedCount}`),
    );
    console.log(
      chalk.gray(`  Auto Attached rules: ${stats.autoAttachedCount}`),
    );
    console.log(chalk.gray(`  Manual rules (excluded): ${stats.manualCount}`));
    console.log(chalk.gray(`  Total processed: ${stats.totalProcessed}`));

    return { ...stats, fileAction: stats.fileAction };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  convertRules,
};
