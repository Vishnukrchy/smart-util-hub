import React, { useState } from 'react';
import { geminiChatCompletion } from '../../lib/gemini';
import ReactMarkdown from 'react-markdown';

const PLATFORM_OPTIONS = [
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Twitter', value: 'twitter' },
];

const getSystemPrompt = (platform: string) => {
  switch (platform) {
    case 'linkedin':
      return 'You are a professional LinkedIn post generator. Write engaging, insightful, and professional posts.';
    case 'instagram':
      return 'You are an Instagram post generator. Write creative, catchy, and visually appealing captions.';
    case 'twitter':
      return 'You are a Twitter post generator. Write concise, witty, and impactful tweets.';
    default:
      return '';
  }
};

const AIPostGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    setCopied(false);
    try {
      const systemPrompt = getSystemPrompt(platform);
      const post = await geminiChatCompletion(prompt, systemPrompt);
      setResult(post);
    } catch (err: any) {
      setResult('Failed to generate post. Please try again.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Post Generator</h1>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Platform</label>
        <select
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={platform}
          onChange={e => setPlatform(e.target.value)}
        >
          {PLATFORM_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Enter your topic or prompt</label>
        <textarea
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="e.g. Tips for remote work, Product launch announcement, etc."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </div>
      <button
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded font-semibold text-lg disabled:opacity-50 transition-all"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Generating...' : 'Generate Post'}
      </button>
      {result && (
        <div className="mt-8 p-4 border rounded bg-gray-50 relative">
          <h2 className="font-semibold mb-2">Generated Post:</h2>
          <div className="prose prose-blue max-w-none mb-2">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          <button
            className={`absolute top-4 right-4 px-3 py-1 rounded text-sm font-medium transition-all ${copied ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AIPostGenerator; 