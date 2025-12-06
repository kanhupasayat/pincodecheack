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
        <p className="subtitle">Check Delhivery services available at your location</p>

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

        {loading && (
          <div className="loading-container">
            <div className="truck-animation">
              <div className="road">
                <div className="truck">
                  <div className="truck-body">
                    <div className="truck-cargo"></div>
                    <div className="truck-cabin"></div>
                  </div>
                  <div className="truck-wheels">
                    <div className="wheel wheel-back"></div>
                    <div className="wheel wheel-front"></div>
                  </div>
                </div>
                <div className="road-line"></div>
              </div>
            </div>
            <p className="loading-text">Checking serviceability...</p>
          </div>
        )}

        {result && (
          <div className="result-container">
            {/* Status Banner */}
            {result.deliveryAvailable && (result.delhivery?.prepaid || result.delhivery?.cod) ? (
              <div className="status-banner success">
                <span className="status-icon">✓</span>
                <div>
                  <strong>Delivery Available!</strong>
                  <p>Pincode: {result.pincode}</p>
                </div>
              </div>
            ) : (
              <div className="status-banner fail">
                <span className="status-icon">✗</span>
                <div>
                  <strong>Delivery Not Available</strong>
                  <p>Pincode: {result.pincode}</p>
                </div>
              </div>
            )}

            {/* Location Details - Always Show */}
            <div className="location-details">
              <h3>Location Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Pincode</span>
                  <span className="detail-value">{result.pincode}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">City</span>
                  <span className="detail-value">{result.city || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">District</span>
                  <span className="detail-value">{result.district || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">State</span>
                  <span className="detail-value">{result.state || 'N/A'}</span>
                </div>
                {result.stateCode && (
                  <div className="detail-item">
                    <span className="detail-label">State Code</span>
                    <span className="detail-value">{result.stateCode}</span>
                  </div>
                )}
                {result.area && (
                  <div className="detail-item">
                    <span className="detail-label">Area</span>
                    <span className="detail-value">{result.area}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Remark */}
            {result.remark && (
              <div className="remark-box">
                {result.remark}
              </div>
            )}

            {/* Delhivery Services - Always Show */}
            <div className="service-card">
              <div className="service-header">
                <img src="https://www.delhivery.com/favicon.ico" alt="Delhivery" className="service-logo" />
                <h3>Delhivery Services</h3>
              </div>

              <div className="service-items">
                <div className={`service-item ${result.delhivery?.prepaid ? 'available' : 'not-available'}`}>
                  <span className="icon">{result.delhivery?.prepaid ? '✓' : '✗'}</span>
                  <span>Pre-paid Delivery</span>
                </div>

                <div className={`service-item ${result.delhivery?.cod ? 'available' : 'not-available'}`}>
                  <span className="icon">{result.delhivery?.cod ? '✓' : '✗'}</span>
                  <span>Cash on Delivery (COD)</span>
                </div>

                <div className={`service-item ${result.delhivery?.pickup ? 'available' : 'not-available'}`}>
                  <span className="icon">{result.delhivery?.pickup ? '✓' : '✗'}</span>
                  <span>Pickup Service</span>
                </div>
              </div>
            </div>
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
