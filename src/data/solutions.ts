export type Solution = {
  id: number;
  title: string;
  category: string;
  description: string;
  steps: string[];
  source: string;
  sourceUrl: string;
  confidence: 'High' | 'Medium' | 'Low';
  icon: string; // lucide-react key, e.g., "FileText"
};

export const solutionsSeed: Solution[] = [
  {
    id: 1,
    title: 'Upload Fails for JSON File',
    category: 'File Format',
    description:
      'Uploads of JSON sometimes fail due to invalid structure, encoding, or expectations of JSONL (newline-delimited). UI errors may appear late in processing.',
    steps: [
      'Validate the file locally and ensure UTF-8 encoding without BOM.',
      'If content is a collection of records, convert to JSONL (one object per line).',
      'Trim unusually large fields or binary blobs; remove trailing commas.',
      'Retry the upload; if the UI fails, try the API and capture the response body for logs.',
      'If still failing, split the file into smaller parts to isolate the problematic segment.',
    ],
    source: 'Error when uploading JSON to vector store',
    sourceUrl: 'https://community.openai.com/t/error-when-uploading-json-to-vector-store/754688/5',
    confidence: 'Medium',
    icon: 'FileText',
  },
  {
    id: 2,
    title: "Python API Upload: 'Unexpected token' / 500 Error",
    category: 'API Reliability',
    description:
      "A 500 with an 'Unexpected token' usually points to malformed JSON, wrong content type, or sending raw text instead of a proper file payload.",
    steps: [
      'Pre-validate with json.loads(...) to fail fast if invalid.',
      'Ensure the request sends a file (multipart) and not a Python dict/string as JSON.',
      'Double-check UTF-8 encoding and newline endings; escape special characters.',
      'Try a minimal sample file; if success, binary-search the failing region.',
      'Add a simple retry (exponential backoff) for transient server errors.',
    ],
    source: 'Error while uploading file via Python OpenAI API',
    sourceUrl: 'https://community.openai.com/t/error-while-uploading-file-via-python-open-ai-api/1288973',
    confidence: 'High',
    icon: 'Upload',
  },
  {
    id: 3,
    title: 'Uploads Suddenly Failing Today (Intermittent)',
    category: 'API Reliability',
    description:
      'Multiple users report uploads failing over a specific window. Often transient: backend hiccup, rate limits, or a regional incident.',
    steps: [
      'Test a tiny known-good file to separate systemic outage vs. content issue.',
      'Check request rate and concurrency; throttle to stay below limits.',
      'Add 3–5 retries with jittered backoff (0.5s, 1s, 2s, 4s...).',
      'Capture request IDs and timestamps from error responses for incident correlation.',
      'If failures persist beyond 30–60 min, escalate with logs (request IDs, region, timestamps).',
    ],
    source: 'Issue uploading files to vector store via OpenAI API',
    sourceUrl: 'https://community.openai.com/t/issue-uploading-files-to-vector-store-via-openai-api/1336045/144',
    confidence: 'Medium',
    icon: 'RefreshCw',
  },
  {
    id: 4,
    title: "Can't Attach File to Vector Store",
    category: 'Configuration',
    description:
      'Attaching files can fail if the file isn’t fully processed yet, or if wrong IDs/endpoints are used in the attach call.',
    steps: [
      "Poll file status until it reaches a 'processed/ready' state before attaching.",
      'Verify correct file_id and vector_store_id (no mixing envs/projects).',
      'Attach only after the vector store itself is created and ready.',
      'For bulk attaches, add a small delay (200–500ms) between requests.',
      'Log the API response body; attach failures often include actionable reasons.',
    ],
    source: 'Can not add files to vector store',
    sourceUrl: 'https://community.openai.com/t/can-not-add-files-to-vector-store/738145',
    confidence: 'Medium',
    icon: 'Settings',
  },
  {
    id: 5,
    title: 'Do Vector Stores Auto-Chunk My Documents?',
    category: 'Chunking',
    description:
      'Vector stores don’t infer ideal chunk boundaries for your use case. Pre-chunking usually yields better retrieval quality and context control.',
    steps: [
      'Preprocess documents into logical chunks (sections/paragraphs).',
      'Start with chunk size ~800–1200 tokens and overlap ~100–200 tokens.',
      'Normalize whitespace; strip boilerplate; keep headings in metadata.',
      'Embed & upload chunks with metadata (title, section, page, source URL).',
      'Evaluate retrieval; adjust chunk size/overlap for completeness vs. noise.',
    ],
    source: 'Does OpenAI not chunk my documents in vector store?',
    sourceUrl: 'https://community.openai.com/t/does-openai-not-chunk-my-documents-in-vector-store/1013640',
    confidence: 'Medium',
    icon: 'AlertCircle',
  },
  {
    id: 6,
    title: 'Chunking & Duplicate File Handling',
    category: 'Technical Setup',
    description:
      'Re-uploads and duplicates can bloat indexes and degrade retrieval if not tracked. Use metadata and content hashes to avoid redundant ingestion.',
    steps: [
      'Store a content hash (e.g., SHA-256) per doc/chunk; skip if it already exists.',
      'Track originals via a stable document_id; avoid re-uploading identical versions.',
      'De-duplicate at both file and chunk levels (identical text → skip).',
      'Maintain an ingestion log (file_id, hash, timestamp, vector_store_id).',
      'If you must re-ingest, mark old chunks as superseded in metadata for filtering.',
    ],
    source: 'Understanding chunking and duplicate file handling in OpenAI’s vector store',
    sourceUrl: 'https://community.openai.com/t/understanding-chunking-and-duplicate-file-handling-in-openais-vector-store/862544',
    confidence: 'Medium',
    icon: 'FileText',
  },
];
