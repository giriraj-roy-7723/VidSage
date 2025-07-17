import React, { useState } from 'react';
import api from '../api';
import './VideoUploader.css';

function VideoUploader() {
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [transcription, setTranscription] = useState(null);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const metaRes = await api.post('/process-video', { video_url: videoURL });
      setMetadata(metaRes.data.metadata);

      const transcribeRes = await api.post('/transcribe', { video_url: videoURL });
      setTranscription(transcribeRes.data.transcription);
    } catch (err) {
      alert('Failed to process or transcribe video');
    }
    setLoading(false);
  };

  return (
    <div className='heroine'>
      <p>
         Paste a YouTube video link below and click <strong>Upload</strong>.<br />
        We'll fetch the video metadata and generate a transcription.<br />
        <em>No login, no fuss — just insights!</em>
      </p>

      <div className="video-uploader">
        <h3>Upload YouTube Video</h3>

        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <br />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Have Patience...' : 'Upload'}
        </button>

        {metadata && (
          <div className="metadata">
            <p><strong>Title:</strong> {metadata.title}</p>
            <p><strong>Author:</strong> {metadata.author}</p>
            <p><strong>Views:</strong> {metadata.views}</p>
          </div>
        )}

        {transcription && (
          <div className="transcription">
            <h4>Transcription:</h4>
            <pre>{transcription}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoUploader;
