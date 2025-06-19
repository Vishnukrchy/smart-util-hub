import React, { useState, useEffect } from 'react';

const proxy = 'https://corsproxy.io/?';

const fetchLatestComicNum = async () => {
  const res = await fetch(`${proxy}https://xkcd.com/info.0.json`);
  if (!res.ok) throw new Error('Failed to fetch latest comic');
  const data = await res.json();
  return data.num;
};

const fetchComic = async (num: number) => {
  const res = await fetch(`${proxy}https://xkcd.com/${num}/info.0.json`);
  if (!res.ok) throw new Error('Failed to fetch comic');
  return res.json();
};

const XKCDComic: React.FC = () => {
  const [comic, setComic] = useState<any>(null);
  const [maxNum, setMaxNum] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRandomComic = async () => {
    if (!maxNum) return;
    setLoading(true);
    setError('');
    try {
      let num = Math.floor(Math.random() * maxNum) + 1;
      // XKCD comic #404 does not exist
      if (num === 404) num = 405;
      const data = await fetchComic(num);
      setComic(data);
    } catch (err) {
      setError('Could not load comic. Try again!');
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const latest = await fetchLatestComicNum();
        setMaxNum(latest);
        const data = await fetchComic(latest);
        setComic(data);
      } catch (err) {
        setError('Could not load comic. Try again!');
      }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-gray-700 to-gray-400 bg-clip-text text-transparent">Random XKCD Comic</h1>
      {loading && <div className="mb-4 text-blue-600 font-semibold">Loading...</div>}
      {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
      {comic && !loading && (
        <>
          <div className="font-semibold text-lg text-center mb-2">{comic.title}</div>
          <img src={comic.img} alt={comic.alt} className="rounded-lg max-h-96 object-contain mb-2 border" />
          <div className="text-sm text-gray-600 italic text-center mb-4">{comic.alt}</div>
        </>
      )}
      <button
        className="bg-gradient-to-r from-gray-700 to-gray-400 text-white px-6 py-2 rounded font-semibold text-lg mt-2 shadow hover:scale-105 transition-transform"
        onClick={getRandomComic}
        disabled={loading || !maxNum}
      >
        {loading ? 'Loading...' : 'Next Comic'}
      </button>
    </div>
  );
};

export default XKCDComic; 