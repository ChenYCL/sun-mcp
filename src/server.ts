#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { FileManager } from './fileManager.js';
import { SessionSummarizer } from './summarizer.js';
import { SessionData, SessionMessage } from './types.js';

class SunSessionSummarizerServer {
  private server: Server;
  private fileManager: FileManager;
  private summarizer: SessionSummarizer;

  constructor() {
    this.server = new Server(
      {
        name: 'sun-session-summarizer',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.fileManager = new FileManager();
    this.summarizer = new SessionSummarizer();

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'sun_summarize',
            description: 'Summarize current session and save as .mdc file when -sun command is used. Use -sun for Chinese or -sun en for English',
            inputSchema: {
              type: 'object',
              properties: {
                sessionContent: {
                  type: 'string',
                  description: 'The session content to summarize (conversation messages)',
                },
                functionality: {
                  type: 'string',
                  description: 'Optional: Main functionality or topic of the session',
                },
                context: {
                  type: 'string',
                  description: 'Optional: Additional context about the session',
                },
                language: {
                  type: 'string',
                  enum: ['zh', 'en'],
                  description: 'Language for the summary: zh for Chinese (default), en for English',
                },
              },
              required: ['sessionContent'],
            },
          },
          {
            name: 'sun_list_summaries',
            description: 'List all saved session summaries',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'sun_get_summary',
            description: 'Get content of a specific summary file',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Name of the summary file to retrieve',
                },
              },
              required: ['filename'],
            },
          },
        ] as Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'sun_summarize':
            return await this.handleSummarize(args);

          case 'sun_list_summaries':
            return await this.handleListSummaries();

          case 'sun_get_summary':
            return await this.handleGetSummary(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  private async handleSummarize(args: any) {
    const { sessionContent, functionality, context, language = 'zh' } = args;

    if (!sessionContent) {
      throw new Error('Session content is required');
    }

    // Parse session content into messages
    const sessionData = this.parseSessionContent(sessionContent, context);

    // Generate summary
    const summary = await this.summarizer.summarizeSession(sessionData, functionality, language);

    // Save to file
    const savedFile = await this.fileManager.saveSummary(summary);

    const isEnglish = summary.language === 'en';

    return {
      content: [
        {
          type: 'text',
          text: `✅ ${isEnglish ? 'Session summary saved!' : '会话总结已保存！'}

📁 **${isEnglish ? 'File' : '文件'}**: ${savedFile.filename}
📍 **${isEnglish ? 'Path' : '路径'}**: ${savedFile.path}
🎯 **${isEnglish ? 'Functionality' : '功能'}**: ${summary.functionality}
📊 **${isEnglish ? 'Status' : '状态'}**: ${summary.completionStatus}
💬 **${isEnglish ? 'Messages' : '消息数'}**: ${summary.messageCount}

## ${isEnglish ? 'Core Essence' : '核心精髓'}
${summary.essence}

## ${isEnglish ? 'Key Points' : '关键要点'}
${summary.keyPoints.map(point => `• ${point}`).join('\n')}

## ${isEnglish ? 'Outcomes' : '完成成果'}
${summary.outcomes.map(outcome => `• ${outcome}`).join('\n')}

${summary.nextSteps && summary.nextSteps.length > 0 ? `## ${isEnglish ? 'Next Steps' : '后续步骤'}
${summary.nextSteps.map(step => `• ${step}`).join('\n')}` : ''}

---
${isEnglish ? 'Use `sun_list_summaries` to view all saved summaries' : '使用 `sun_list_summaries` 查看所有保存的总结'}
${isEnglish ? 'Use `sun_get_summary` to get specific summary content' : '使用 `sun_get_summary` 获取特定总结内容'}`,
        },
      ],
    };
  }

  private async handleListSummaries() {
    const summaries = await this.fileManager.listSummaries();

    if (summaries.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: '📂 暂无保存的会话总结\n\n使用 `-sun` 命令创建第一个会话总结！',
          },
        ],
      };
    }

    const summaryList = summaries
      .map((file, index) => {
        const date = new Date(file.createdAt).toLocaleString('zh-CN');
        return `${index + 1}. **${file.filename}**
   📅 创建时间: ${date}
   🎯 功能: ${file.summary.functionality}
   📊 状态: ${file.summary.completionStatus}`;
      })
      .join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `📂 **已保存的会话总结** (${summaries.length}个)

${summaryList}

---
使用 \`sun_get_summary\` 获取特定总结的详细内容`,
        },
      ],
    };
  }

  private async handleGetSummary(args: any) {
    const { filename } = args;

    if (!filename) {
      throw new Error('Filename is required');
    }

    const content = await this.fileManager.getSummary(filename);

    if (!content) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 未找到文件: ${filename}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `📄 **${filename}**

${content}`,
        },
      ],
    };
  }

  /**
   * Parse session content into structured data
   */
  private parseSessionContent(content: string, context?: string): SessionData {
    const messages: SessionMessage[] = [];

    // Try to parse different formats
    if (content.includes('Human:') || content.includes('Assistant:')) {
      // Parse conversation format
      const parts = content.split(/(?=Human:|Assistant:)/);

      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('Human:')) {
          messages.push({
            role: 'user',
            content: trimmed.replace('Human:', '').trim(),
            timestamp: new Date().toISOString(),
          });
        } else if (trimmed.startsWith('Assistant:')) {
          messages.push({
            role: 'assistant',
            content: trimmed.replace('Assistant:', '').trim(),
            timestamp: new Date().toISOString(),
          });
        }
      }
    } else {
      // Treat as single message
      messages.push({
        role: 'user',
        content: content,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      messages,
      startTime: new Date().toISOString(),
      context,
    };
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🌞 Sun Session Summarizer MCP Server started');
  }
}

// Start the server
const server = new SunSessionSummarizerServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
