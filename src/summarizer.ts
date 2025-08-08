import { SessionData, SessionSummary, SessionMessage } from './types.js';

export class SessionSummarizer {

  /**
   * Analyze and summarize session content
   */
  async summarizeSession(sessionData: SessionData, functionality?: string, language: 'zh' | 'en' = 'zh'): Promise<SessionSummary> {
    const messages = sessionData.messages || [];
    const messageCount = messages.length;

    // Extract key information from messages
    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');

    // Analyze the conversation to extract essence and key points
    const analysis = this.analyzeConversation(messages, language);

    // Determine functionality if not provided
    const detectedFunctionality = functionality || this.detectFunctionality(messages, language);

    // Generate title
    const title = this.generateTitle(detectedFunctionality, language);

    // Determine completion status
    const completionStatus = this.determineCompletionStatus(messages);

    const summary: SessionSummary = {
      title,
      essence: analysis.essence,
      completionStatus,
      keyPoints: analysis.keyPoints,
      outcomes: analysis.outcomes,
      nextSteps: analysis.nextSteps,
      timestamp: new Date().toISOString(),
      messageCount,
      functionality: detectedFunctionality,
      language
    };

    return summary;
  }

  /**
   * Analyze conversation content to extract key information
   */
  private analyzeConversation(messages: SessionMessage[], language: 'zh' | 'en' = 'zh') {
    const userRequests: string[] = [];
    const assistantActions: string[] = [];
    const codeSnippets: string[] = [];
    const errors: string[] = [];
    const solutions: string[] = [];

    messages.forEach(message => {
      const content = message.content.toLowerCase();

      if (message.role === 'user') {
        // Extract user requests and goals
        if (content.includes('创建') || content.includes('做') || content.includes('实现')) {
          userRequests.push(this.extractMainRequest(message.content));
        }
      } else if (message.role === 'assistant') {
        // Extract assistant actions and solutions
        if (content.includes('创建') || content.includes('实现') || content.includes('完成')) {
          assistantActions.push(this.extractAction(message.content));
        }

        // Extract code snippets
        const codeMatches = message.content.match(/```[\s\S]*?```/g);
        if (codeMatches) {
          codeSnippets.push(...codeMatches.map(code => this.summarizeCode(code)));
        }

        // Extract errors and solutions
        if (content.includes('错误') || content.includes('error') || content.includes('失败')) {
          errors.push(this.extractError(message.content));
        }

        if (content.includes('解决') || content.includes('修复') || content.includes('成功')) {
          solutions.push(this.extractSolution(message.content));
        }
      }
    });

    // Generate essence
    const essence = this.generateEssence(userRequests, assistantActions);

    // Generate key points
    const keyPoints = [
      ...userRequests.slice(0, 3),
      ...assistantActions.slice(0, 3),
      ...codeSnippets.slice(0, 2)
    ].filter(Boolean);

    // Generate outcomes
    const outcomes = [
      ...solutions,
      ...assistantActions.filter(action =>
        action.includes('创建') || action.includes('实现') || action.includes('完成')
      )
    ].slice(0, 5);

    // Generate next steps
    const nextSteps = this.generateNextSteps(messages, errors);

    return {
      essence,
      keyPoints,
      outcomes,
      nextSteps: nextSteps.length > 0 ? nextSteps : undefined
    };
  }

  /**
   * Extract main request from user message
   */
  private extractMainRequest(content: string): string {
    // Simple extraction - take first sentence or up to 100 chars
    const firstSentence = content.split(/[。！？\n]/)[0];
    return firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence;
  }

  /**
   * Extract action from assistant message
   */
  private extractAction(content: string): string {
    // Look for action verbs and extract relevant context
    const actionPatterns = [
      /创建了?(.{1,50})/,
      /实现了?(.{1,50})/,
      /完成了?(.{1,50})/,
      /添加了?(.{1,50})/,
      /修改了?(.{1,50})/
    ];

    for (const pattern of actionPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    // Fallback: take first meaningful sentence
    const sentences = content.split(/[。！？\n]/);
    for (const sentence of sentences) {
      if (sentence.length > 10 && sentence.length < 100) {
        return sentence.trim();
      }
    }

    return content.substring(0, 80) + '...';
  }

  /**
   * Summarize code snippet
   */
  private summarizeCode(codeBlock: string): string {
    const lines = codeBlock.split('\n');
    const language = lines[0].replace('```', '').trim();
    const codeLines = lines.slice(1, -1);

    // Extract key elements like function names, class names, etc.
    const keyElements: string[] = [];

    codeLines.forEach(line => {
      // Function definitions
      if (line.includes('function ') || line.includes('def ') || line.includes('async ')) {
        keyElements.push(line.trim());
      }
      // Class definitions
      if (line.includes('class ') || line.includes('interface ')) {
        keyElements.push(line.trim());
      }
      // Import statements
      if (line.includes('import ') || line.includes('from ')) {
        keyElements.push(line.trim());
      }
    });

    if (keyElements.length > 0) {
      return `${language}代码: ${keyElements[0]}${keyElements.length > 1 ? ' 等' : ''}`;
    }

    return `${language}代码片段 (${codeLines.length}行)`;
  }

  /**
   * Extract error information
   */
  private extractError(content: string): string {
    const errorPatterns = [
      /错误[:：](.{1,100})/,
      /Error[:：](.{1,100})/,
      /失败[:：](.{1,100})/,
      /问题[:：](.{1,100})/
    ];

    for (const pattern of errorPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    return '遇到技术问题';
  }

  /**
   * Extract solution information
   */
  private extractSolution(content: string): string {
    const solutionPatterns = [
      /解决了?(.{1,100})/,
      /修复了?(.{1,100})/,
      /成功(.{1,100})/,
      /完成了?(.{1,100})/
    ];

    for (const pattern of solutionPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    return '问题已解决';
  }

  /**
   * Generate essence of the session
   */
  private generateEssence(userRequests: string[], assistantActions: string[]): string {
    if (userRequests.length === 0 && assistantActions.length === 0) {
      return '进行了技术讨论和问题解决';
    }

    const mainRequest = userRequests[0] || '技术需求';
    const mainAction = assistantActions[0] || '提供了技术支持';

    return `用户${mainRequest}，助手${mainAction}，通过协作完成了相关技术任务。`;
  }

  /**
   * Detect main functionality from conversation
   */
  private detectFunctionality(messages: SessionMessage[], language: 'zh' | 'en' = 'zh'): string {
    const allContent = messages.map(m => m.content).join(' ').toLowerCase();

    // Common functionality patterns
    const patterns = language === 'en' ? [
      { pattern: /mcp.*server|server.*mcp/, name: 'MCP Server Development' },
      { pattern: /web.*app|应用.*开发|网站/, name: 'Web Application Development' },
      { pattern: /api.*开发|接口.*开发/, name: 'API Development' },
      { pattern: /数据库|database/, name: 'Database Operations' },
      { pattern: /测试|test/, name: 'Testing Development' },
      { pattern: /部署|deploy/, name: 'Deployment Configuration' },
      { pattern: /bug.*修复|错误.*修复/, name: 'Bug Fixing' },
      { pattern: /代码.*优化|性能.*优化/, name: 'Code Optimization' },
      { pattern: /文档|documentation/, name: 'Documentation Writing' },
      { pattern: /配置|config/, name: 'Configuration Management' }
    ] : [
      { pattern: /mcp.*server|server.*mcp/, name: 'MCP服务器开发' },
      { pattern: /web.*app|应用.*开发|网站/, name: 'Web应用开发' },
      { pattern: /api.*开发|接口.*开发/, name: 'API开发' },
      { pattern: /数据库|database/, name: '数据库操作' },
      { pattern: /测试|test/, name: '测试开发' },
      { pattern: /部署|deploy/, name: '部署配置' },
      { pattern: /bug.*修复|错误.*修复/, name: 'Bug修复' },
      { pattern: /代码.*优化|性能.*优化/, name: '代码优化' },
      { pattern: /文档|documentation/, name: '文档编写' },
      { pattern: /配置|config/, name: '配置管理' }
    ];

    for (const { pattern, name } of patterns) {
      if (pattern.test(allContent)) {
        return name;
      }
    }

    return language === 'en' ? 'Technical Development' : '技术开发';
  }

  /**
   * Generate title based on functionality and language
   */
  private generateTitle(functionality: string, language: 'zh' | 'en' = 'zh'): string {
    if (language === 'en') {
      return `${functionality} Session Summary`;
    }
    return `${functionality}会话总结`;
  }

  /**
   * Determine completion status based on conversation flow
   */
  private determineCompletionStatus(messages: SessionMessage[]): 'completed' | 'partial' | 'failed' | 'ongoing' {
    const lastMessages = messages.slice(-3);
    const lastContent = lastMessages.map(m => m.content).join(' ').toLowerCase();

    if (lastContent.includes('完成') || lastContent.includes('成功') || lastContent.includes('解决')) {
      return 'completed';
    }

    if (lastContent.includes('错误') || lastContent.includes('失败') || lastContent.includes('问题')) {
      return 'failed';
    }

    if (lastContent.includes('继续') || lastContent.includes('下一步')) {
      return 'ongoing';
    }

    return 'partial';
  }

  /**
   * Generate next steps based on conversation context
   */
  private generateNextSteps(messages: SessionMessage[], errors: string[]): string[] {
    const nextSteps: string[] = [];

    // If there are unresolved errors
    if (errors.length > 0) {
      nextSteps.push('解决剩余的技术问题');
    }

    // Look for mentions of future work
    const lastMessages = messages.slice(-5);
    lastMessages.forEach(message => {
      const content = message.content.toLowerCase();
      if (content.includes('下一步') || content.includes('接下来') || content.includes('后续')) {
        const sentence = message.content.split(/[。！？\n]/).find(s =>
          s.includes('下一步') || s.includes('接下来') || s.includes('后续')
        );
        if (sentence && sentence.length < 100) {
          nextSteps.push(sentence.trim());
        }
      }
    });

    // Common next steps based on functionality
    const lastContent = messages.map(m => m.content).join(' ').toLowerCase();
    if (lastContent.includes('测试') && !lastContent.includes('测试完成')) {
      nextSteps.push('进行功能测试');
    }

    if (lastContent.includes('部署') && !lastContent.includes('部署完成')) {
      nextSteps.push('部署到生产环境');
    }

    return nextSteps.slice(0, 3); // Limit to 3 next steps
  }
}
