# SwarmCoder

> 🐝 Multi-agent swarm for distributed code generation

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)

## 🎯 Overview

SwarmCoder is a multi-agent swarm system that coordinates multiple AI agents to work together on code generation tasks. Think of it as a "swarm" of specialized agents that collaborate, share context, and produce better code through collective intelligence.

## ✨ Features

- 🐝 **Agent Swarm** - Multiple specialized agents working in parallel
- 🔄 **Coordination** - Intelligent task distribution and result aggregation
- 🎯 **Specialized Roles** - Frontend, Backend, Testing, Review agents
- 🌊 **Swarm Intelligence** - Better results through collaboration
- 🔌 **Multi-Provider** - Works with Anthropic, OpenAI, MiniMax, Ollama
- 📦 **MCP Compatible** - Integrates with Model Context Protocol tools

## 🚀 Quick Start

```bash
git clone https://github.com/moggan1337/SwarmCoder.git
cd SwarmCoder
npm install
npm run build

# Run swarm
npm start
```

## 🏗️ Architecture

```
SwarmCoder/
├── src/
│   ├── swarm/          # Swarm orchestration
│   ├── agents/        # Individual agents
│   ├── tasks/         # Task definitions
│   ├── coordination/  # Swarm coordination logic
│   └── providers/     # LLM providers
├── config/            # Configuration
└── tests/             # Tests
```

## 🤝 How It Works

1. **User Request** → Task is analyzed and decomposed
2. **Agent Spawning** → Specialized agents are spawned
3. **Parallel Work** → Agents work on their assigned tasks
4. **Result Aggregation** → Results are combined and refined
5. **Output** → Final code is returned

## 📄 License

MIT License

## 👤 Author

Daniel Ideborn - [@danielaideborn](https://github.com/danielaideborn)

---

*Built with ❤️ for the developer community*
