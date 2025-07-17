import React from 'react';
import VideoUploader from '../components/VideoUploader';
import TranscriptViewer from '../components/TranscriptViewer';
import QuestionAnswer from '../components/QuestionAnswer';
import Summary  from '../components/Summary';

function Home() {
  return (
    <div>
      <h1>VidSage: YouTube to AI Assistant</h1>
      <VideoUploader />
      <TranscriptViewer />
      <QuestionAnswer />
      <Summary/>
    </div>
  );
}

export default Home;
