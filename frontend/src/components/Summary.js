import React, { useState } from 'react';

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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button
        onClick={handleGenerate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      {error && <div className="text-red-600 mt-4">{error}</div>}

      {data && (
        <div className="bg-gray-50 shadow-md rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-2">📋 Detailed Summary</h2>
          <pre className="whitespace-pre-wrap text-gray-800 text-sm">{data.summary_notes}</pre>
        </div>
      )}
    </div>
  );
}

export default Summary;
