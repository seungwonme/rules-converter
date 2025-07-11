const fs = require('fs-extra');
const path = require('path');
const { RuleType, extractExtensionsFromGlobs } = require('./parser');

/**
 * Generate content for Always rules
 * @param {Array} rules - Array of Always rules
 * @returns {string} Generated content
 */
function generateAlwaysRulesContent(rules) {
  if (rules.length === 0) return '';

  const rulesList = rules
    .map((rule) => `@.cursor/rules/${rule.relativePath || rule.fileName}`)
    .join('\n');

  return `The following rules should be considered foundational. Make sure you're familiar with them before working on this project:
${rulesList}`;
}

/**
 * Generate content for Agent Requested rules
 * @param {Array} rules - Array of Agent Requested rules
 * @returns {string} Generated content
 */
function generateAgentRequestedRulesContent(rules) {
  if (rules.length === 0) return '';

  return rules
    .map(
      (rule) =>
        `${rule.frontmatter.description}:\n@.cursor/rules/${rule.relativePath || rule.fileName}`,
    )
    .join('\n\n');
}

/**
 * Generate content for Auto Attached rules
 * @param {Array} rules - Array of Auto Attached rules
 * @returns {string} Generated content
 */
function generateAutoAttachedRulesContent(rules) {
  if (rules.length === 0) return '';

  // Group rules by their extension patterns
  const extensionGroups = new Map();

  rules.forEach((rule) => {
    const extensions = extractExtensionsFromGlobs(rule.frontmatter.globs);
    const extensionKey = extensions.sort().join(','); // Create a consistent key

    if (!extensionGroups.has(extensionKey)) {
      extensionGroups.set(extensionKey, {
        extensions,
        rules: [],
      });
    }

    extensionGroups.get(extensionKey).rules.push(rule);
  });

  // Generate content for each extension group
  const groupContents = Array.from(extensionGroups.values()).map(
    ({ extensions, rules }) => {
      const extensionList = extensions.map((ext) => `.${ext}`).join(', ');
      const rulesList = rules
        .map((rule) => `@.cursor/rules/${rule.relativePath || rule.fileName}`)
        .join('\n');

      return `When working with files that match the following extensions (${extensionList}), review and apply the relevant rules:
${rulesList}`;
    },
  );

  return groupContents.join('\n\n');
}

/**
 * Write the converted rules to a markdown file
 * @param {Object} categorizedRules - Rules categorized by type
 * @param {string} outputPath - Path to output file
 * @param {string} target - Target format ('claude' or 'gemini')
 */
async function writeRulesToFile(categorizedRules, outputPath, target) {
  const sections = [];

  // Add Always rules
  const alwaysContent = generateAlwaysRulesContent(
    categorizedRules[RuleType.ALWAYS],
  );
  if (alwaysContent) {
    sections.push(alwaysContent);
  }

  // Add Agent Requested rules
  const agentRequestedContent = generateAgentRequestedRulesContent(
    categorizedRules[RuleType.AGENT_REQUESTED],
  );
  if (agentRequestedContent) {
    sections.push(agentRequestedContent);
  }

  // Add Auto Attached rules
  const autoAttachedContent = generateAutoAttachedRulesContent(
    categorizedRules[RuleType.AUTO_ATTACHED],
  );
  if (autoAttachedContent) {
    sections.push(autoAttachedContent);
  }

  // Combine all sections
  const content = sections.join('\n\n');

  // Wrap content in <rules> tags
  const wrappedContent = `<rules>\n${content}\n</rules>`;

  // Ensure the output directory exists
  await fs.ensureDir(path.dirname(outputPath));

  // Check if file exists
  const fileExists = await fs.pathExists(outputPath);

  if (fileExists) {
    // Append to existing file with newlines for separation
    await fs.appendFile(outputPath, `\n\n${wrappedContent}`, 'utf8');
  } else {
    // Create new file
    await fs.writeFile(outputPath, wrappedContent, 'utf8');
  }

  // Return statistics
  return {
    alwaysCount: categorizedRules[RuleType.ALWAYS].length,
    agentRequestedCount: categorizedRules[RuleType.AGENT_REQUESTED].length,
    autoAttachedCount: categorizedRules[RuleType.AUTO_ATTACHED].length,
    manualCount: categorizedRules[RuleType.MANUAL].length,
    totalProcessed: Object.values(categorizedRules).reduce(
      (sum, rules) => sum + rules.length,
      0,
    ),
    fileAction: fileExists ? 'appended' : 'created',
  };
}

module.exports = {
  writeRulesToFile,
};
