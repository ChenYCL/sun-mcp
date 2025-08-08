# Sun MCP Server

🌞 An MCP server designed for Agent session summarization. Automatically summarizes current sessions and saves them as .mdc files when you input the `-sun` command.

English | [中文](./README.md)

## ✨ Features

- 🌞 **Simple Command**: Just type `-sun` to trigger session summarization
- 🌍 **Multilingual Support**: `-sun` generates Chinese summaries, `-sun en` generates English summaries
- 📝 **Smart Summarization**: Automatically analyzes session content and extracts core insights and key points
- 📁 **Auto Save**: Saves files in `datetime_functionality.mdc` format to `.sun` folder
- 🎯 **Status Tracking**: Automatically determines task completion status (completed/partial/failed/ongoing)
- 📊 **Structured Output**: Includes core essence, key points, outcomes, and next steps
- 🔍 **History Review**: Supports listing and viewing historical summaries

## 🚀 Quick Start

### Method 1: npm Installation (Recommended)

Use Easy MCP Installation in Claude Desktop:

- **Name**: `Sun MCP`
- **Command**: `npx -y sun-mcp@latest`

### Method 2: Manual Configuration

Add to Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "sun-mcp": {
      "command": "npx",
      "args": ["-y", "sun-mcp@latest"]
    }
  }
}
```

Restart Claude Desktop after configuration.

## 📖 Usage

### Basic Usage

Simply type in Claude Desktop:

```
-sun                           # Generate Chinese summary
-sun en                        # Generate English summary
-sun We discussed API development  # English summary with context
```

### Generated Files

Summary files are automatically saved to the `.sun` folder in your project root:

```
.sun/
├── 20241208_143022_MCP_Server_Development.mdc
├── 20241208_150315_API_Development.mdc
└── 20241208_162045_Bug_Fixing.mdc
```

## 📄 Summary File Format

Each .mdc file contains structured session summaries:

```markdown
# Functionality Session Summary

## Session Overview
**Timestamp**: 2024-12-08T14:30:22.000Z
**Completion Status**: completed
**Message Count**: 15
**Main Functionality**: MCP Server Development

## Core Essence
User requested to create an MCP server, assistant implemented complete session summarization functionality...

## Key Points
- Created MCP server architecture
- Implemented intelligent session analysis
- Added file saving functionality

## Outcomes
- Successfully created a fully functional MCP server
- Implemented automated session summarization

## Next Steps
- Conduct functionality testing
- Optimize summarization algorithm
```

## 🛠️ Local Development

```bash
# Clone the project
git clone https://github.com/ChenYCL/sun-mcp.git
cd sun-mcp

# Install dependencies
npm install

# Build project
npm run build

# Local testing
node dist/server.js
```

## 🎯 Problems Solved

- ✅ **Precision Loss from Large Sessions**: Saves key information through timely summarization
- ✅ **Context Loss**: Structured preservation of session essence and outcomes
- ✅ **Difficult Review**: Provides historical summary viewing functionality
- ✅ **Manual Organization Tedium**: One-click automatic summarization and saving

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!
