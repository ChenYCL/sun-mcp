# Sun MCP Server

🌞 一个专门为 Agent 会话总结设计的 MCP 服务器，当输入 `-sun` 命令时自动总结当前会话并保存为 .mdc 文件。

[English](./README_EN.md) | 中文

<a href="https://glama.ai/mcp/servers/@ChenYCL/sun-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@ChenYCL/sun-mcp/badge" alt="Sun Server MCP server" />
</a>

## ✨ 功能特性

- 🌞 **简单命令**: 只需输入 `-sun` 即可触发会话总结
- 🌍 **多语言支持**: `-sun` 生成中文总结，`-sun en` 生成英文总结
- 📝 **智能总结**: 自动分析会话内容，提取核心精髓和关键要点
- 📁 **自动保存**: 按照 `日期时间_功能.mdc` 格式保存到 `.sun` 文件夹
- 🎯 **状态跟踪**: 自动判断任务完成状态（completed/partial/failed/ongoing）
- 📊 **结构化输出**: 包含核心精髓、关键要点、完成成果、后续步骤等
- 🔍 **历史查看**: 支持列出和查看历史总结

## 🚀 快速开始

### 方式 1: npm 安装（推荐）

在 Claude Desktop 中使用 Easy MCP Installation：

- **Name**: `Sun MCP`
- **Command**: `npx -y sun-mcp@latest`

### 方式 2: 手动配置

在 Claude Desktop 配置文件中添加：

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

配置完成后重启 Claude Desktop。

## 📖 使用方法

### 基本用法

在 Claude Desktop 中直接输入：

```
-sun                    # 生成中文总结
-sun en                 # 生成英文总结
-sun 这次讨论了API开发    # 带上下文的中文总结
```

### 生成的文件

总结文件会自动保存到项目根目录的 `.sun` 文件夹中：

```
.sun/
├── 20241208_143022_MCP服务器开发.mdc
├── 20241208_150315_API开发.mdc
└── 20241208_162045_Bug修复.mdc
```

## 📄 总结文件格式

每个 .mdc 文件包含结构化的会话总结：

```markdown
# 功能名称会话总结

## 会话概要

**时间戳**: 2024-12-08T14:30:22.000Z
**完成状态**: completed
**消息数量**: 15
**主要功能**: MCP 服务器开发

## 核心精髓

用户要求创建 MCP 服务器，助手实现了完整的会话总结功能...

## 关键要点

- 创建了 MCP 服务器架构
- 实现了智能会话分析
- 添加了文件保存功能

## 完成成果

- 成功创建了功能完整的 MCP 服务器
- 实现了自动化会话总结

## 后续步骤

- 进行功能测试
- 优化总结算法
```

## 🛠️ 本地开发

```bash
# 克隆项目
git clone https://github.com/ChenYCL/sun-mcp.git
cd sun-mcp

# 安装依赖
npm install

# 构建项目
npm run build

# 本地测试
node dist/server.js
```

## 🎯 解决的问题

- ✅ **会话过大导致精度损失**: 通过及时总结保存关键信息
- ✅ **上下文丢失**: 结构化保存会话精髓和成果
- ✅ **难以回顾**: 提供历史总结查看功能
- ✅ **手动整理繁琐**: 一键自动总结和保存

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！