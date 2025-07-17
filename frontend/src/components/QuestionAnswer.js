import React, { useState } from 'react';
import api from '../api';
import './QuestionAnswer.css';

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
      setAnswer('⚠️ Sorry, I couldn’t fetch an answer. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="heroine">
      <p>
         Hi, I'm your AI video assistant!<br />
        Ask me anything about the uploaded YouTube video — from key takeaways to deeper insights and lots of questions that's brooding over oyur mind!<br />
      </p>

      <div className="question-answer-container">
        <h3>Chat With Your Video</h3>

        <input
          type="text"
          placeholder="E.g. What is the main topic of the video?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={handleAsk} disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>

        {answer && (
          <div className="answer-container">
            <strong>Answer:</strong>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionAnswer;
