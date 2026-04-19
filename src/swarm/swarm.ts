import { EventEmitter } from 'eventemitter3';
import { BaseAgent, AgentTask, AgentResult } from '../agents/base.js';
import { FrontendAgent, BackendAgent, TestingAgent, ReviewAgent } from '../agents/index.js';
import { Task, TaskResult, Artifact, TaskManager } from '../tasks/task.js';

export interface SwarmConfig {
  parallelAgents: boolean;
  enableReview: boolean;
  enableTesting: boolean;
}

export class SwarmCoordinator extends EventEmitter {
  private agents: BaseAgent[] = [];
  private taskManager: TaskManager;
  private config: SwarmConfig;
  
  constructor(config: Partial<SwarmConfig> = {}) {
    super();
    this.taskManager = new TaskManager();
    this.config = {
      parallelAgents: config.parallelAgents ?? true,
      enableReview: config.enableReview ?? true,
      enableTesting: config.enableTesting ?? true,
      ...config
    };
    
    this.registerDefaultAgents();
  }
  
  private registerDefaultAgents(): void {
    this.agents.push(new FrontendAgent());
    this.agents.push(new BackendAgent());
    this.agents.push(new TestingAgent());
    this.agents.push(new ReviewAgent());
    
    console.log(`[Swarm] Registered ${this.agents.length} agents`);
  }
  
  registerAgent(agent: BaseAgent): void {
    this.agents.push(agent);
    console.log(`[Swarm] Registered agent: ${agent.name}`);
  }
  
  async execute(task: Task): Promise<TaskResult> {
    console.log(`\n🐝 Swarm: Processing task ${task.id}`);
    console.log(`   Type: ${task.type}`);
    console.log(`   Description: ${task.description}\n`);
    
    this.emit('task:start', task);
    
    const artifacts: Artifact[] = [];
    const errors: string[] = [];
    
    try {
      if (task.type === 'fullstack') {
        // Run frontend and backend in parallel
        const results = await this.runParallelAgents(task);
        
        for (const result of results) {
          if (result.success && result.artifacts) {
            artifacts.push(...result.artifacts);
          }
          if (!result.success && result.error) {
            errors.push(result.error);
          }
        }
        
        // Run testing if enabled
        if (this.config.enableTesting) {
          const testResult = await this.runAgent(new TestingAgent(), task);
          if (testResult.success && testResult.artifacts) {
            artifacts.push(...testResult.artifacts);
          }
        }
      } else {
        // Run single or targeted agents
        const results = await this.runAppropriateAgents(task);
        
        for (const result of results) {
          if (result.success) {
            artifacts.push(...(result.artifacts || []));
          }
          if (!result.success && result.error) {
            errors.push(result.error);
          }
        }
      }
      
      // Run review if enabled
      if (this.config.enableReview && artifacts.length > 0) {
        const reviewResult = await this.runAgent(new ReviewAgent(), task);
        if (reviewResult.success) {
          artifacts.push({
            type: 'review',
            code: reviewResult.output || '',
            language: 'markdown'
          });
        }
      }
      
    } catch (error: any) {
      errors.push(error.message);
    }
    
    const result: TaskResult = {
      taskId: task.id,
      success: errors.length === 0,
      artifacts,
      errors
    };
    
    this.emit('task:complete', result);
    
    return result;
  }
  
  private async runAppropriateAgents(task: Task): Promise<AgentResult[]> {
    const matchingAgents = this.agents.filter(agent => agent.canHandle({
      id: task.id,
      description: task.description
    }));
    
    if (matchingAgents.length === 0) {
      // Fallback to all agents
      return this.runAllAgents(task);
    }
    
    return this.runAgents(matchingAgents, task);
  }
  
  private async runAllAgents(task: Task): Promise<AgentResult[]> {
    return this.runAgents(this.agents, task);
  }
  
  private async runAgents(agents: BaseAgent[], task: Task): Promise<AgentResult[]> {
    if (this.config.parallelAgents) {
      return this.runParallelAgents(task, agents);
    } else {
      return this.runSequentialAgents(task, agents);
    }
  }
  
  private async runParallelAgents(task: Task, agents?: BaseAgent[]): Promise<AgentResult[]> {
    const targetAgents = agents || this.agents;
    
    console.log(`[Swarm] Running ${targetAgents.length} agents in parallel...`);
    
    const promises = targetAgents.map(agent => this.runAgent(agent, task));
    return Promise.all(promises);
  }
  
  private async runSequentialAgents(task: Task, agents?: BaseAgent[]): Promise<AgentResult[]> {
    const targetAgents = agents || this.agents;
    const results: AgentResult[] = [];
    
    console.log(`[Swarm] Running ${targetAgents.length} agents sequentially...`);
    
    for (const agent of targetAgents) {
      const result = await this.runAgent(agent, task);
      results.push(result);
    }
    
    return results;
  }
  
  private async runAgent(agent: BaseAgent, task: Task): Promise<AgentResult> {
    console.log(`[Swarm] Agent ${agent.name} starting...`);
    
    const agentTask: AgentTask = {
      id: task.id,
      description: task.description,
      context: task.context
    };
    
    try {
      const result = await agent.execute(agentTask);
      
      if (result.success) {
        console.log(`[Swarm] ✓ ${agent.name} completed`);
      } else {
        console.log(`[Swarm] ✗ ${agent.name} failed: ${result.error}`);
      }
      
      return result;
    } catch (error: any) {
      console.log(`[Swarm] ✗ ${agent.name} error: ${error.message}`);
      return {
        agent: agent.name,
        success: false,
        error: error.message
      };
    }
  }
  
  listAgents(): string[] {
    return this.agents.map(a => `${a.name} (${a.role})`);
  }
}
