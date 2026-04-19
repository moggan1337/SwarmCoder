#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { SwarmCoordinator } from '../swarm/index.js';
import { TaskManager } from '../tasks/task.js';

const program = new Command();

program
  .name('swarmcoder')
  .description('🐝 Multi-agent swarm for distributed code generation')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate code using the swarm')
  .argument('<description>', 'What to generate')
  .option('-t, --type <type>', 'Generation type', 'fullstack')
  .option('-s, --sequential', 'Run agents sequentially instead of parallel')
  .option('--no-review', 'Skip review agent')
  .option('--no-testing', 'Skip testing agent')
  .action(async (description, options) => {
    console.log(chalk.blue(`
╔════════════════════════════════════════════════════╗
║         🐝 SwarmCoder - Code Generation           ║
╚════════════════════════════════════════════════════╝
`));
    
    const swarm = new SwarmCoordinator({
      parallelAgents: !options.sequential,
      enableReview: options.review !== false,
      enableTesting: options.testing !== false
    });
    
    console.log(chalk.gray(`\n📋 Agents registered:`));
    swarm.listAgents().forEach(agent => console.log(chalk.gray(`   • ${agent}`)));
    
    const taskManager = new TaskManager();
    const task = taskManager.create(
      options.type as any,
      description
    );
    
    console.log(chalk.blue(`\n🐝 Starting swarm for: "${description}"\n`));
    
    const result = await swarm.execute(task);
    
    console.log(chalk.blue(`\n📦 Results:\n`));
    
    if (result.success) {
      console.log(chalk.green(`✅ Task completed successfully!\n`));
      
      for (const artifact of result.artifacts) {
        console.log(chalk.cyan(`--- ${artifact.type.toUpperCase()} ---`));
        console.log(artifact.code.substring(0, 500));
        if (artifact.code.length > 500) {
          console.log(chalk.gray(`... (${artifact.code.length - 500} more characters)`));
        }
        console.log('');
      }
    } else {
      console.log(chalk.red(`❌ Task completed with errors:\n`));
      result.errors.forEach(err => console.log(chalk.red(`   • ${err}`)));
    }
  });

program
  .command('agents')
  .description('List available agents')
  .action(() => {
    const swarm = new SwarmCoordinator();
    
    console.log(chalk.blue(`
╔════════════════════════════════════════════════════╗
║              🐝 Swarm Agents                      ║
╚════════════════════════════════════════════════════╝
`));
    
    swarm.listAgents().forEach(agent => {
      console.log(chalk.green(`   • ${agent}`));
    });
    
    console.log(chalk.gray(`
Task Types:
   • generation  - Single component generation
   • review      - Code review only
   • testing     - Test generation only
   • fullstack   - Frontend + Backend + Tests
`));
  });

program.parse();
