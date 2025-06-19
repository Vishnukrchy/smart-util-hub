import React, { useState } from 'react';

const STATUS_CODES = [
  100, 101, 200, 201, 202, 204, 206, 301, 302, 304, 307, 400, 401, 403, 404, 405, 408, 409, 410, 418, 429, 500, 502, 503, 504
];

function getRandomStatus() {
  return STATUS_CODES[Math.floor(Math.random() * STATUS_CODES.length)];
}

const HTTPCats: React.FC = () => {
  const [status, setStatus] = useState(getRandomStatus());
  const [loading, setLoading] = useState(false);

  const nextCat = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus(getRandomStatus());
      setLoading(false);
    }, 300); // quick loading effect
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">HTTP Status Cats</h1>
      <div className="mb-4 text-lg font-semibold">Status Code: <span className="text-blue-600">{status}</span></div>
      <div className="mb-4 flex items-center justify-center min-h-[250px]">
        {loading ? (
          <div className="text-blue-400 font-semibold">Loading...</div>
        ) : (
          <img
            src={`https://http.cat/${status}`}
            alt={`HTTP Cat ${status}`}
            className="rounded-lg max-h-80 object-contain border"
            onError={e => (e.currentTarget.src = 'https://http.cat/404')}
          />
        )}
      </div>
      <button
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded font-semibold text-lg mt-2 shadow hover:scale-105 transition-transform"
        onClick={nextCat}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Next Cat'}
      </button>
    </div>
  );
};

export default HTTPCats; 