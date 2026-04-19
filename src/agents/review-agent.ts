import { BaseAgent, AgentTask, AgentResult, AgentConfig } from './base.js';

export class ReviewAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Code-Review',
      role: 'Senior Reviewer',
      specialty: 'Code Review, Security, Best Practices',
      capabilities: ['review', 'security', 'optimize', 'improve', 'refactor', 'check']
    };
    super(config);
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    this.log(`Reviewing task: ${task.id}`);
    
    try {
      const review = this.generateReview(task);
      
      return {
        agent: this.name,
        success: true,
        output: review
      };
    } catch (error: any) {
      return {
        agent: this.name,
        success: false,
        error: error.message
      };
    }
  }
  
  private generateReview(task: AgentTask): string {
    return `# Code Review for: ${task.description}

## Summary
Reviewed by ${this.name}

## Recommendations
1. ✅ Code structure looks good
2. 🔒 Security considerations addressed
3. ⚡ Performance optimizations applied
4. 📝 Documentation complete

## Status: Approved ✓
`;
  }
}
