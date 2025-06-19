import React, { useState, useEffect } from 'react';

const fetchTrivia = async () => {
  const res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
  if (!res.ok) throw new Error('Failed to fetch trivia');
  const data = await res.json();
  return data.results[0];
};

function decodeHtml(html: string) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

const shuffle = (arr: string[]) => arr.sort(() => Math.random() - 0.5);

const TriviaQuiz: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [correct, setCorrect] = useState('');
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTrivia = async () => {
    setLoading(true);
    setError('');
    setFeedback('');
    setSelected('');
    try {
      const data = await fetchTrivia();
      setQuestion(decodeHtml(data.question));
      const allAnswers = shuffle([
        ...data.incorrect_answers.map(decodeHtml),
        decodeHtml(data.correct_answer)
      ]);
      setAnswers(allAnswers);
      setCorrect(decodeHtml(data.correct_answer));
    } catch (err) {
      setError('Could not load trivia. Try again!');
    }
    setLoading(false);
  };

  useEffect(() => {
    getTrivia();
  }, []);

  const handleSelect = (ans: string) => {
    setSelected(ans);
    setFeedback(ans === correct ? 'Correct! 🎉' : `Wrong! The answer was: ${correct}`);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Trivia Quiz</h1>
      {loading && <div className="mb-4 text-blue-600 font-semibold">Loading...</div>}
      {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
      {question && !loading && (
        <>
          <div className="font-semibold text-lg text-center mb-6">{question}</div>
          <div className="flex flex-col gap-3 w-full mb-4">
            {answers.map((ans, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded border text-left font-medium transition-all ${selected ? (ans === correct ? 'bg-green-100 border-green-400' : ans === selected ? 'bg-red-100 border-red-400' : 'bg-gray-100 border-gray-300') : 'bg-gray-100 border-gray-300 hover:bg-blue-100 hover:border-blue-400'}`}
                onClick={() => !selected && handleSelect(ans)}
                disabled={!!selected}
              >
                {ans}
              </button>
            ))}
          </div>
          {feedback && <div className={`mb-4 font-semibold ${feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>}
        </>
      )}
      <button
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded font-semibold text-lg mt-2 shadow hover:scale-105 transition-transform"
        onClick={getTrivia}
        disabled={loading}
      >
        {loading ? 'Loading...' : (selected ? 'Next Question' : 'Skip')}
      </button>
    </div>
  );
};

export default TriviaQuiz; 