#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error.message);
  }
}

async function createReferenceFile(taskName, targetDir, extension) {
  const fileName = `${taskName}.${extension}`;
  const targetPath = path.join(targetDir, fileName);
  
  const content = `# ${taskName.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')} Command

## Command
\`${taskName}\`

## Description
docs/tasks/${taskName}.mdに記載されている手順に従って実行します。

## Usage
詳細な実行手順と説明については、\`docs/tasks/${taskName}.md\`を参照してください。`;

  await fs.writeFile(targetPath, content, 'utf-8');
  return fileName;
}

async function syncTasksToClaudeAndCursor() {
  const projectRoot = process.cwd();
  const tasksDir = path.join(projectRoot, 'docs', 'tasks');
  const claudeCommandsDir = path.join(projectRoot, '.claude', 'commands');
  const cursorRulesDir = path.join(projectRoot, '.cursor', 'rules');

  try {
    // Ensure directories exist
    await ensureDirectoryExists(claudeCommandsDir);
    await ensureDirectoryExists(cursorRulesDir);

    // Read all task files
    const taskFiles = await fs.readdir(tasksDir);
    
    for (const file of taskFiles) {
      if (file.endsWith('.md')) {
        const taskName = path.basename(file, '.md');
        
        // Create reference file in .claude/commands
        const claudeFile = await createReferenceFile(taskName, claudeCommandsDir, 'md');
        console.log(`✅ Created: .claude/commands/${claudeFile}`);
        
        // Create reference file in .cursor/rules
        const cursorFile = await createReferenceFile(taskName, cursorRulesDir, 'mdc');
        console.log(`✅ Created: .cursor/rules/${cursorFile}`);
      }
    }
    
    console.log('\n✨ Sync completed successfully!');
    console.log('📝 Task definitions are in: docs/tasks/');
    console.log('🔗 Reference files created in: .claude/commands/ and .cursor/rules/');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the sync
syncTasksToClaudeAndCursor();