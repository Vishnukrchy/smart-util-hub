import React, { useState, useEffect } from 'react';

const fetchMeme = async () => {
  const res = await fetch('https://meme-api.com/gimme');
  if (!res.ok) throw new Error('Failed to fetch meme');
  return res.json();
};

const MemeGenerator: React.FC = () => {
  const [meme, setMeme] = useState<{ title: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getMeme = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMeme();
      setMeme({ title: data.title, url: data.url });
    } catch (err) {
      setError('Could not load meme. Try again!');
    }
    setLoading(false);
  };

  useEffect(() => {
    getMeme();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">Random Meme Generator</h1>
      {loading && <div className="mb-4 text-blue-600 font-semibold">Loading...</div>}
      {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
      {meme && !loading && (
        <>
          <img src={meme.url} alt={meme.title} className="rounded-lg max-h-96 object-contain mb-4 border" />
          <div className="font-semibold text-lg text-center mb-4">{meme.title}</div>
        </>
      )}
      <button
        className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-2 rounded font-semibold text-lg mt-2 shadow hover:scale-105 transition-transform"
        onClick={getMeme}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Next Meme'}
      </button>
    </div>
  );
};

export default MemeGenerator; 