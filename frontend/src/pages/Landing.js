import React, { useEffect } from 'react';
import './Landing.css';
import heroImage from '../assets/images.jpeg';
import { Link } from 'react-router-dom';
function Landing() {
  useEffect(() => {
    const starsContainer = document.getElementById('stars');
    starsContainer.innerHTML = ''; // Clear previous stars

    const sizes = ['small', 'medium', 'large'];

    for (let i = 0; i < 2000; i++) {
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
    <>
      <div id="stars" className="stars"></div>

      <div className="hero">
        <div className="dot dot-pink" />
        <div className="dot dot-blue" />
        <div className="dot dot-orange" />

        <div className="hero-content">
          <div className="text-section">
            <h1>
              Welcome to <span className="highlight">VidSage</span><br />
              Your AI-Powered YouTube Companion
            </h1>
            <p>
              <span className="q">🙶</span>
              VidSage transforms any YouTube video into an intelligent experience. Upload a link and unlock detailed summaries, insightful notes, and a chatbot trained on the video’s content — ready to answer your every question. Whether you're studying, researching, or just curious, VidSage helps you digest video knowledge faster, smarter, and more beautifully than ever.
              <span className="q">🙷</span>
            </p>

            <Link to="/video-uploader" className="cta-button">
              Get Started
            </Link>

          </div>

          <div className="image-section">
            <img src={heroImage} alt="VidSage Hero" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
