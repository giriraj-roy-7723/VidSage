import React, { useState } from 'react';
import './Summary.css';
import ReactMarkdown from 'react-markdown';


function Summary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/generate-summary", {
        method: "GET",
      });
      const result = await res.json();

      if (result.status === "success") {
        setData(result);
      } else {
        setError("Failed to generate summary.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Something went wrong while generating the summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="heroine">
      <p>
        Want detailed notes for your uploaded video?<br />
        I'm your AI notetaker — just hit the button below and get your detailed summary ready!<br />
        Perfect for revision, content repurposing, or study.
      </p>

      <div className="summary-container">
        <h2 className="summary-heading"> Smart Video Summary</h2>

        <button
          onClick={handleGenerate}
          className="summary-button"
          disabled={loading}
        >
          {loading ? "⏳ Generating..." : " Generate Summary"}
        </button>

        {error && <div className="summary-error">{error}</div>}

        {data && (
          <div className="summary-result">
            <h3 className="summary-title"> Detailed Summary</h3>

            <div className="summary-text">
              <ReactMarkdown>{data.summary_notes}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Summary;
