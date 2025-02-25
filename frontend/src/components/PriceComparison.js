import React, { useState } from 'react';
import './App.css';

function PriceComparison() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPrice = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/price?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setResult(data.title ? { title: data.title } : null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to fetch price: ${err.message}`);
      setResult(null);
    }
    
    setLoading(false);
  };

  // Determine which store the URL is from
  const getStore = () => {
    if (!url) return '';
    if (url.includes('amazon')) return 'amazon';
    if (url.includes('flipkart')) return 'flipkart';
    return '';
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
            <h3>Product Details:</h3>
            {result.title && (
              <>
                <div className={`store-badge ${getStore()}`}>
                  {getStore() === 'amazon' ? 'Amazon' : 'Flipkart'}
                </div>
                <div className="product-title">{result.title}</div>
              </>
            )}
            {result.price && (
              <>
                <p>Price: <span className="price-value">₹{result.price.toLocaleString('en-IN')}</span></p>
                <p>Currency: {result.currency}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PriceComparison;
