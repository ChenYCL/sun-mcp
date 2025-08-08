// Type definitions for the Sun session summarizer MCP server

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface SessionData {
  messages: SessionMessage[];
  startTime?: string;
  endTime?: string;
  context?: string;
}

export interface SessionSummary {
  title: string;
  essence: string; // Core essence of the session
  completionStatus: 'completed' | 'partial' | 'failed' | 'ongoing';
  keyPoints: string[];
  outcomes: string[];
  nextSteps?: string[];
  timestamp: string;
  messageCount: number;
  functionality: string; // Main functionality discussed
  language: 'zh' | 'en'; // Language of the summary
}

export interface SunCommand {
  command: '-sun' | '-sun en';
  sessionContent?: string;
  functionality?: string;
  context?: string;
  language?: 'zh' | 'en';
}

export interface SavedSummaryFile {
  filename: string;
  path: string;
  summary: SessionSummary;
  createdAt: string;
}
