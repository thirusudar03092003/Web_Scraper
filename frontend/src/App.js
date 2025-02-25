import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPrice = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!url.includes('amazon.in') && !url.includes('flipkart.com')) {
      setError('Please enter a valid Amazon.in or Flipkart.com URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/price?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch price. Please try again.');
      setResult(null);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Price Comparison Tool</h1>
      <div className="price-checker">
        <h2>Product Price Checker</h2>
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Amazon/Flipkart Product URL"
            className="url-input"
          />
          <button 
            onClick={checkPrice} 
            disabled={loading}
            className="check-button"
          >
            {loading ? 'Checking...' : 'Check Price'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        
        {result && (
          <div className="result">
            <h3>Price Details:</h3>
            <p>Price: ₹{result.price}</p>
            <p>Currency: {result.currency}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
