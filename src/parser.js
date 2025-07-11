const fs = require('fs-extra');
const path = require('path');

/**
 * Rule types
 */
const RuleType = {
  ALWAYS: 'always',
  AGENT_REQUESTED: 'agent_requested',
  AUTO_ATTACHED: 'auto_attached',
  MANUAL: 'manual',
};

/**
 * Parse a single rule file
 * @param {string} filePath - Path to the rule file
 * @returns {Object} Parsed rule object
 */
async function parseRuleFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  
  // Custom parsing to handle globs without quotes
  let frontmatter = {};
  let mainContent = content;
  
  // Check if file has frontmatter
  if (content.startsWith('---\n')) {
    const endIndex = content.indexOf('\n---\n', 4);
    if (endIndex !== -1) {
      const frontmatterText = content.substring(4, endIndex);
      mainContent = content.substring(endIndex + 5);
      
      // Parse frontmatter manually to handle unquoted globs
      const lines = frontmatterText.split('\n');
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          
          // Parse boolean values
          if (value === 'true') {
            frontmatter[key] = true;
          } else if (value === 'false') {
            frontmatter[key] = false;
          } else if (value === '') {
            frontmatter[key] = '';
          } else {
            frontmatter[key] = value;
          }
        }
      }
    }
  }
  
  const fileName = path.basename(filePath);

  return {
    fileName,
    filePath,
    frontmatter,
    content: mainContent,
    type: determineRuleType(frontmatter),
  };
}

/**
 * Determine the type of rule based on frontmatter
 * @param {Object} frontmatter - The parsed frontmatter
 * @returns {string} Rule type
 */
function determineRuleType(frontmatter) {
  // Always rule: alwaysApply is true
  if (frontmatter.alwaysApply === true) {
    return RuleType.ALWAYS;
  }

  // Auto Attached rule: has globs field
  if (frontmatter.globs && frontmatter.globs.trim() !== '') {
    return RuleType.AUTO_ATTACHED;
  }

  // Agent Requested rule: alwaysApply is false and has description
  if (
    frontmatter.alwaysApply === false &&
    frontmatter.description &&
    frontmatter.description.trim() !== ''
  ) {
    return RuleType.AGENT_REQUESTED;
  }

  // Default to Manual rule
  return RuleType.MANUAL;
}

/**
 * Recursively find all .mdc files in a directory
 * @param {string} dir - Directory to search
 * @param {string} baseDir - Base directory for relative paths
 * @returns {Array} Array of file paths with relative paths
 */
async function findRuleFiles(dir, baseDir = dir) {
  const files = await fs.readdir(dir);
  const ruleFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      const subFiles = await findRuleFiles(filePath, baseDir);
      ruleFiles.push(...subFiles);
    } else if (file.endsWith('.mdc')) {
      // Calculate relative path from base directory
      const relativePath = path.relative(baseDir, filePath);
      ruleFiles.push({
        fullPath: filePath,
        relativePath: relativePath,
      });
    }
  }

  return ruleFiles;
}

/**
 * Parse all rules in a directory
 * @param {string} rulesDir - Path to the rules directory
 * @returns {Object} Categorized rules
 */
async function parseRules(rulesDir) {
  // Check if rules directory exists
  const dirExists = await fs.pathExists(rulesDir);
  if (!dirExists) {
    throw new Error(`Rules directory not found: ${rulesDir}`);
  }

  // Find all rule files recursively
  const ruleFiles = await findRuleFiles(rulesDir);

  if (ruleFiles.length === 0) {
    throw new Error(`No rule files found in directory: ${rulesDir}`);
  }

  // Parse all rule files
  const parsedRules = await Promise.all(
    ruleFiles.map(async ({ fullPath, relativePath }) => {
      const rule = await parseRuleFile(fullPath);
      // Add relative path to the rule object
      rule.relativePath = relativePath;
      return rule;
    }),
  );

  // Categorize rules by type
  const categorizedRules = {
    [RuleType.ALWAYS]: [],
    [RuleType.AGENT_REQUESTED]: [],
    [RuleType.AUTO_ATTACHED]: [],
    [RuleType.MANUAL]: [],
  };

  parsedRules.forEach((rule) => {
    categorizedRules[rule.type].push(rule);
  });

  return categorizedRules;
}

/**
 * Extract file extensions from globs pattern
 * @param {string} globs - Glob pattern string
 * @returns {string[]} Array of file extensions
 */
function extractExtensionsFromGlobs(globs) {
  const extensions = [];
  const patterns = globs.split(',').map((p) => p.trim());

  patterns.forEach((pattern) => {
    // Match patterns like **/*.js, *.tsx, etc.
    const match = pattern.match(/\*\.(\w+)/);
    if (match) {
      extensions.push(match[1]);
    }
  });

  return [...new Set(extensions)]; // Remove duplicates
}

module.exports = {
  parseRules,
  RuleType,
  extractExtensionsFromGlobs,
};
