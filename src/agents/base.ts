import { EventEmitter } from 'eventemitter3';

export interface AgentConfig {
  name: string;
  role: string;
  specialty: string;
  capabilities: string[];
}

export interface AgentTask {
  id: string;
  description: string;
  context?: any;
}

export interface AgentResult {
  agent: string;
  success: boolean;
  output?: string;
  error?: string;
  artifacts?: any[];
}

export abstract class BaseAgent extends EventEmitter {
  name: string;
  role: string;
  specialty: string;
  capabilities: string[];
  
  constructor(config: AgentConfig) {
    super();
    this.name = config.name;
    this.role = config.role;
    this.specialty = config.specialty;
    this.capabilities = config.capabilities;
  }
  
  abstract execute(task: AgentTask): Promise<AgentResult>;
  
  canHandle(task: AgentTask): boolean {
    return this.capabilities.some(cap => 
      task.description.toLowerCase().includes(cap.toLowerCase())
    );
  }
  
  protected log(message: string): void {
    console.log(`[${this.name}] ${message}`);
    this.emit('log', { agent: this.name, message });
  }
}
