export interface Project {
  id: string;
  name: string;
  path: string;
  description: string;
  notes: string;
  prompts: string[];
  documents: string[];
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type ModuleId = 'dashboard' | 'ai-assistant' | 'task-organizer' | 'code-cleaner' | 'research-viz' | 'project-hub' | 'ai-prompt-assist';
