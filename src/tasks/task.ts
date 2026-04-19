export interface Task {
  id: string;
  type: 'generation' | 'review' | 'testing' | 'fullstack';
  description: string;
  requirements: string[];
  context?: any;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  artifacts: Artifact[];
  errors: string[];
}

export interface Artifact {
  type: 'frontend' | 'backend' | 'tests' | 'review' | 'config';
  code: string;
  language: string;
  fileName?: string;
}

export class TaskManager {
  private tasks: Map<string, Task> = new Map();
  
  create(type: Task['type'], description: string, requirements: string[] = []): Task {
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      description,
      requirements
    };
    this.tasks.set(task.id, task);
    return task;
  }
  
  get(id: string): Task | undefined {
    return this.tasks.get(id);
  }
  
  list(): Task[] {
    return [...this.tasks.values()];
  }
  
  complete(id: string): void {
    this.tasks.delete(id);
  }
}
