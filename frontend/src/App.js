import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Summary from './components/Summary';
import QuestionAnswer from './components/QuestionAnswer';
import VideoUploader from './components/VideoUploader';
import './App.css';
import './stars.css'; // 👉 Import global star styles

function App() {
  useEffect(() => {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    starsContainer.innerHTML = ''; // Clear existing stars

    const sizes = ['small', 'medium', 'large'];
    const starCount = 2000;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      star.className = `star ${size}`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.left = `${Math.random() * 100}vw`;

      const twinkleTime = Math.random() * 2 + 1;
      const driftTime = Math.random() * 10 + 5;

      star.style.animation = `twinkle ${twinkleTime}s ease-in-out infinite alternate,
                              drift ${driftTime}s ease-in-out infinite`;

      starsContainer.appendChild(star);
    }
  }, []);

  return (
    <div id="app-container" className="app-container">
      <div id="stars" className="stars"></div> {/* ⭐ Global stars */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chatbot" element={<QuestionAnswer />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/video-uploader" element={<VideoUploader />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
