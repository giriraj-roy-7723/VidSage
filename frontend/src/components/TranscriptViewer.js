import React, { useState } from 'react';
import api from '../api';

function TranscriptViewer() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranscribe = async () => {
    setLoading(true);
    try {
      const res = await api.post('/transcribe');
      setTranscript(res.data.transcript_excerpt);
    } catch (err) {
      alert('Failed to transcribe video');
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Transcription</h3>
      <button onClick={handleTranscribe} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe Video'}
      </button>
      {transcript && (
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{transcript}</pre>
      )}
    </div>
  );
}

export default TranscriptViewer;
