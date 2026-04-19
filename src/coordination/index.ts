// Coordination utilities for multi-agent workflows
export interface CoordinationMessage {
  from: string;
  to: string;
  type: 'task' | 'result' | 'error' | 'sync';
  payload: any;
  timestamp: number;
}

export class MessageBus {
  private messages: CoordinationMessage[] = [];
  
  publish(message: Omit<CoordinationMessage, 'timestamp'>): void {
    this.messages.push({
      ...message,
      timestamp: Date.now()
    });
  }
  
  getMessages(filter?: { from?: string; to?: string }): CoordinationMessage[] {
    let filtered = this.messages;
    
    if (filter?.from) {
      filtered = filtered.filter(m => m.from === filter.from);
    }
    if (filter?.to) {
      filtered = filtered.filter(m => m.to === filter.to);
    }
    
    return filtered;
  }
  
  clear(): void {
    this.messages = [];
  }
}
