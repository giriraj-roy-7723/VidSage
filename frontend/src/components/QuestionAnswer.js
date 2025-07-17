import React, { useState } from 'react';
import api from '../api';

function QuestionAnswer() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const res = await api.post('/ask', { question });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer('Failed to get answer.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Ask a Question</h3>
      <input
        type="text"
        placeholder="Ask something about the video..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Asking...' : 'Ask'}
      </button>
      {answer && (
        <div>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default QuestionAnswer;
