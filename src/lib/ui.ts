export const classNames = (
  ...arr: Array<string | false | null | undefined>
) => arr.filter((v) => v !== false && v != null).join(' ');

export const categoryBadgeColor = (category: string) => {
  const colors: Record<string, string> = {
    'File Format': 'bg-blue-100 text-blue-800',
    'File Size': 'bg-red-100 text-red-800',
    'API Reliability': 'bg-yellow-100 text-yellow-800',
    'File Naming': 'bg-green-100 text-green-800',
    'Technical Setup': 'bg-purple-100 text-purple-800',
    'Configuration': 'bg-indigo-100 text-indigo-800',
    'Chunking': 'bg-cyan-100 text-cyan-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

export const confidencePillColor = (confidence: string) => {
  const colors: Record<string, string> = {
    'High': 'text-green-700 bg-green-50 ring-1 ring-green-200',
    'Medium': 'text-yellow-700 bg-yellow-50 ring-1 ring-yellow-200',
    'Low': 'text-red-700 bg-red-50 ring-red-200',
  };
  return colors[confidence] || 'text-gray-700 bg-gray-50 ring-1 ring-gray-200';
};
