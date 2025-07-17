import React, { useState } from 'react';
import api from '../api';

function VideoUploader() {
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const res = await api.post('/process-video', { video_url: videoURL });
      setMetadata(res.data.metadata);
    } catch (err) {
      alert('Failed to process video');
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Upload YouTube Video</h3>
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {metadata && (
        <div>
          <p><strong>Title:</strong> {metadata.title}</p>
          <p><strong>Author:</strong> {metadata.author}</p>
          <p><strong>Views:</strong> {metadata.views}</p>
        </div>
      )}
    </div>
  );
}

export default VideoUploader;
