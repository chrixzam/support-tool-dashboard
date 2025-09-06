export const PROVIDERS = [
  {
    id: 'openai',
    label: 'OpenAI',
    embeddingModels: ['text-embedding-3-small', 'text-embedding-3-large'],
    chatModels: ['gpt-4o', 'gpt-4o-mini'],
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    embeddingModels: ['claude-embedding-1'],
    chatModels: ['claude-3-5-sonnet', 'claude-3-opus'],
  },
  {
    id: 'local',
    label: 'Local (ollama)',
    embeddingModels: ['nomic-embed-text', 'bge-m3'],
    chatModels: ['llama3.1', 'qwen2.5'],
  },
];

export const DEFAULT_DIMENSIONS = 768;

export const METRICS = ['cosine', 'dot', 'euclidean'] as const;

export const MAX_FILE_SIZE_MB = 25;

export const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'video/mp4',
  'text/plain',
  'application/json',
  'application/pdf',
];

export const clientTicket = {
  id: 'TICKET-001',
  question:
    "A user is trying to upload a JSON file into a vector store and gets a generic 'Upload failed' error. Why does this happen and how do we fix it?",
  attachments: ['error_screenshot_1.png', 'screen_recording.mp4'],
  detectedIssue: 'Vector store upload/processing error',
} as const;
