# SwarmCoder

> 🐝 Multi-agent swarm for distributed code generation

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)](package.json)
[![Stars](https://img.shields.io/github/stars/moggan1337/SwarmCoder)](https://github.com/moggan1337/SwarmCoder/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/moggan1337/SwarmCoder)](https://github.com/moggan1337/SwarmCoder/commits)

## 🚀 Overview

SwarmCoder is a multi-agent swarm system that coordinates multiple AI agents to work together on code generation tasks. Unlike single-agent systems, SwarmCoder spawns specialized agents that collaborate in parallel, share context, and produce better code through collective intelligence.

### Why Swarm Architecture?

| Single Agent | Swarm Architecture |
|--------------|-------------------|
| Limited context | Distributed context across agents |
| Single perspective | Multiple specialized perspectives |
| Sequential work | Parallel execution |
| Generic solutions | Specialized expertise |
| Single point of failure | Redundancy and resilience |

## ✨ Features

### 🐝 Agent Swarm

Four specialized agents work together:

| Agent | Role | Capabilities |
|-------|------|-------------|
| **Frontend-Dev** | UI/UX Specialist | React, Vue, CSS, SwiftUI, Components |
| **Backend-Dev** | Server Specialist | APIs, Databases, Node.js, Python |
| **Testing-Dev** | QA Specialist | Jest, Vitest, Cypress, TDD |
| **Code-Review** | Senior Reviewer | Security, Best Practices, Refactoring |

### 🔄 Coordination Modes

```bash
# Parallel execution (default) - fastest
swarmcoder generate "Create a login page" --type fullstack

# Sequential execution - for debugging
swarmcoder generate "Create an API" --sequential
```

### 📦 Task Types

| Type | Agents Invoked | Output |
|------|---------------|--------|
| `generation` | Targeted agent | Single component |
| `frontend` | Frontend-Dev | UI components |
| `backend` | Backend-Dev | API/Database code |
| `testing` | Testing-Dev | Test suites |
| `review` | Code-Review | Review report |
| `fullstack` | All agents | Complete feature |

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- API key for LLM provider (optional for template generation)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/moggan1337/SwarmCoder.git
cd SwarmCoder

# Install dependencies
npm install

# Build the project
npm run build

# Run the swarm
npm start

# Or use the CLI
npm run dev -- generate "Create a login button"
```

## 💻 Usage

### Command Line Interface

#### List Available Agents

```bash
swarmcoder agents
```

Output:
```
╔════════════════════════════════════════════════════╗
║              🐝 Swarm Agents                      ║
╚════════════════════════════════════════════════════╝

   • Frontend-Dev (Frontend Developer)
   • Backend-Dev (Backend Developer)
   • Testing-Dev (QA Engineer)
   • Code-Review (Senior Reviewer)
```

#### Generate Code

```bash
# Generate a single component
swarmcoder generate "Create a login button" --type generation

# Generate fullstack application
swarmcoder generate "Build a user authentication system" --type fullstack

# Generate with specific agents
swarmcoder generate "Create an API endpoint" --type backend

# Sequential execution (slower but more debuggable)
swarmcoder generate "Create a dashboard" --sequential
```

### Programmatic Usage

```typescript
import { SwarmCoordinator } from './swarm';
import { TaskManager } from './tasks/task';

// Initialize swarm
const swarm = new SwarmCoordinator({
  parallelAgents: true,      // Run agents in parallel
  enableReview: true,        // Include code review
  enableTesting: true        // Include test generation
});

// Create and execute task
const taskManager = new TaskManager();
const task = taskManager.create('fullstack', 'Create a blog application');

const result = await swarm.execute(task);

if (result.success) {
  for (const artifact of result.artifacts) {
    console.log(`[${artifact.type}]`, artifact.code);
  }
}
```

## 🏗️ Architecture

```
SwarmCoder/
├── src/
│   ├── agents/           # Agent implementations
│   │   ├── base.ts       # Base agent class
│   │   ├── frontend-agent.ts
│   │   ├── backend-agent.ts
│   │   ├── testing-agent.ts
│   │   └── review-agent.ts
│   ├── swarm/           # Swarm orchestration
│   │   └── swarm.ts     # Coordinator logic
│   ├── tasks/           # Task definitions
│   │   └── task.ts     # Task types & manager
│   ├── coordination/    # Inter-agent communication
│   │   └── index.ts     # Message bus
│   ├── providers/       # LLM provider integration
│   └── utils/          # Utilities
├── config/             # Configuration
├── tests/             # Test suites
└── docs/             # Documentation
```

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     USER REQUEST                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    TASK DECOMPOSITION                       │
│   • Analyze request                                       │
│   • Determine required agents                              │
│   • Create task context                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    AGENT SPAWNING                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │  Frontend    │  │   Backend    │  │   Testing    │   │
│   │    Dev      │  │    Dev       │  │    Dev       │   │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│          │                  │                  │             │
└──────────┼──────────────────┼──────────────────┼───────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    PARALLEL EXECUTION                       │
│              Each agent processes in parallel               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   RESULT AGGREGATION                        │
│   • Collect outputs from all agents                        │
│   • Merge artifacts                                       │
│   • Run code review (if enabled)                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        OUTPUT                               │
│   • Frontend code                                         │
│   • Backend code                                          │
│   • Tests                                                │
│   • Review report                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Extending SwarmCoder

### Creating Custom Agents

```typescript
import { BaseAgent, AgentTask, AgentResult, AgentConfig } from './agents/base';

export class MyCustomAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'My-Custom',
      role: 'Specialist',
      specialty: 'Custom domain',
      capabilities: ['custom', 'specific', 'task']
    };
    super(config);
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    this.log(`Processing: ${task.description}`);
    
    // Your custom logic here
    const output = await this.generateCustomOutput(task);
    
    return {
      agent: this.name,
      success: true,
      output,
      artifacts: [{ type: 'custom', code: output }]
    };
  }
}
```

### Registering Custom Agents

```typescript
const swarm = new SwarmCoordinator();

// Add your custom agent
swarm.registerAgent(new MyCustomAgent());

// Execute as usual
const result = await swarm.execute(task);
```

### Custom Task Types

```typescript
const task = taskManager.create('custom', 'My specific task', {
  // Custom context
  requirements: ['req1', 'req2'],
  constraints: ['constraint1']
});
```

## ⚙️ Configuration

### Swarm Configuration

```typescript
const swarm = new SwarmCoordinator({
  parallelAgents: true,      // true = parallel, false = sequential
  enableReview: true,        // Include code review agent
  enableTesting: true        // Include testing agent
});
```

### Environment Variables

```bash
# LLM Provider (for LLM-powered agents)
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
export MINIMAX_API_KEY=sk-...

# Swarm Configuration
export SWARM_PARALLEL=true
export SWARM_REVIEW=true
export SWARM_TESTING=true
```

## 🔧 Development

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

### CLI Development

```bash
# Watch mode for CLI
npm run dev -- generate "Your prompt here"
```

## 📋 Examples

### Example 1: Fullstack Feature

```bash
swarmcoder generate "User registration with email verification" --type fullstack
```

Output:
```
📦 Results:

✅ Task completed successfully!

--- FRONTEND ---
// RegistrationForm.tsx
import React, { useState } from 'react';

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verification logic
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button type="submit">Register</button>
    </form>
  );
}

--- BACKEND ---
// routes/registration.ts
export async function handleRegistration(req: Request): Promise<Response> {
  const { email } = await req.json();
  // Send verification email
  return new Response(JSON.stringify({ success: true }));
}

--- TESTS ---
// registration.test.ts
describe('Registration', () => {
  it('should validate email format', async () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
});

--- REVIEW ---
# Code Review
## Status: Approved ✓
```

### Example 2: Component Only

```bash
swarmcoder generate "Animated loading spinner" --type generation
```

### Example 3: API with Tests

```bash
swarmcoder generate "RESTful CRUD endpoints for todos" --type backend
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure code follows existing patterns
5. Submit a Pull Request

### Adding New Agents

1. Create agent file in `src/agents/`
2. Extend `BaseAgent` class
3. Implement `execute()` method
4. Export from `src/agents/index.ts`
5. Register in `SwarmCoordinator`

## 📋 Roadmap

- [ ] LLM-powered agent generation
- [ ] Custom agent configurations
- [ ] Agent communication/messaging
- [ ] Web dashboard
- [ ] VS Code extension
- [ ] Team collaboration
- [ ] Result caching
- [ ] Integration with ArtisanCode

## 🐛 Troubleshooting

### Agents Not Spawning

Check that all required dependencies are installed:
```bash
npm install
```

### Parallel Execution Issues

Try sequential mode:
```bash
swarmcoder generate "Your prompt" --sequential
```

### LLM Errors

Set your API key:
```bash
export ANTHROPIC_API_KEY=your-key
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by swarm intelligence patterns
- Built with TypeScript + Node.js
- Thanks to all contributors

## 🔗 Related Projects

- [ArtisanCode](https://github.com/moggan1337/ArtisanCode) - Open-source AI coding assistant

---

<p align="center">
  Built with ❤️ for the developer community<br>
  <a href="https://github.com/moggan1337">@moggan1337</a>
</p>
