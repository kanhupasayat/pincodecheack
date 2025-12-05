import { useState } from 'react'
import './App.css'

function App() {
  const [pincode, setPincode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const checkServiceability = async () => {
    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/check-pincode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.message || 'Service check failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkServiceability()
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Pincode Serviceability Check</h1>
        <p className="subtitle">Check if delivery is available at your location</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyPress={handleKeyPress}
            maxLength={6}
          />
          <button
            onClick={checkServiceability}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Checking...' : 'Check Service'}
          </button>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {result && (
          <div className="result-box">
            <h2>Service Details</h2>

            <div className="result-grid">
              <div className={`result-item ${result.deliveryAvailable ? 'success' : 'fail'}`}>
                <span className="label">Delivery</span>
                <span className="value">
                  {result.deliveryAvailable ? '✓ Available' : '✗ Not Available'}
                </span>
              </div>

              <div className={`result-item ${result.codAvailable ? 'success' : 'fail'}`}>
                <span className="label">COD</span>
                <span className="value">
                  {result.codAvailable ? '✓ Yes' : '✗ No'}
                </span>
              </div>

              {result.carrier && (
                <div className="result-item info">
                  <span className="label">Delivery Partner</span>
                  <span className="value">{result.carrier}</span>
                </div>
              )}

              {result.estimatedDays && (
                <div className="result-item info">
                  <span className="label">Estimated Delivery</span>
                  <span className="value">{result.estimatedDays} days</span>
                </div>
              )}
            </div>

            {result.allCarriers && result.allCarriers.length > 0 && (
              <div className="carriers-section">
                <h3>Available Carriers</h3>
                <div className="carriers-list">
                  {result.allCarriers.map((carrier, index) => (
                    <div key={index} className="carrier-item">
                      <span className="carrier-name">{carrier.name}</span>
                      <span className="carrier-days">{carrier.days} days</span>
                      <span className={`carrier-cod ${carrier.cod ? 'yes' : 'no'}`}>
                        COD: {carrier.cod ? 'Yes' : 'No'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="warehouse-info">
          Warehouse Pincode: <strong>203207</strong>
        </p>
      </div>
    </div>
  )
}

export default App
