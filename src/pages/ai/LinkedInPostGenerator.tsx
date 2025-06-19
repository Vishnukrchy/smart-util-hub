import React, { useState } from 'react';

const generateLinkedInPost = async (prompt: string): Promise<string> => {
  // TODO: Replace with actual Gemini API call
  // Example: await fetch('/api/gemini/linkedin', { ... })
  return `Generated LinkedIn Post for: ${prompt}`;
};

const LinkedInPostGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    const post = await generateLinkedInPost(prompt);
    setResult(post);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Post Generator</h1>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={4}
        placeholder="Enter your topic or prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Generating...' : 'Generate LinkedIn Post'}
      </button>
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Generated Post:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default LinkedInPostGenerator; 