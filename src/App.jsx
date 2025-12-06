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
            <div className="truck-scene">
              {/* Sky with clouds */}
              <div className="sky">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
                <div className="cloud cloud-4"></div>
              </div>

              {/* Sun */}
              <div className="sun"></div>

              {/* Birds */}
              <div className="birds">
                <div className="bird bird-1">🐦</div>
                <div className="bird bird-2">🐦</div>
                <div className="bird bird-3">🕊️</div>
                <div className="bird bird-4">🐦</div>
                <div className="bird bird-5">🕊️</div>
              </div>

              {/* Background Buildings */}
              <div className="buildings">
                <div className="building building-1"></div>
                <div className="building building-2"></div>
                <div className="building building-3"></div>
                <div className="building building-4"></div>
                <div className="building building-5"></div>
              </div>

              {/* Warehouse */}
              <div className="warehouse">
                <div className="warehouse-roof"></div>
                <div className="warehouse-body">
                  <div className="warehouse-door"></div>
                  <div className="warehouse-sign">DELHIVERY</div>
                </div>
              </div>

              {/* Box flying into truck */}
              <div className="flying-box">📦</div>

              {/* Trees */}
              <div className="tree tree-1">
                <div className="tree-top"></div>
                <div className="tree-trunk"></div>
              </div>
              <div className="tree tree-2">
                <div className="tree-top palm"></div>
                <div className="tree-trunk"></div>
              </div>
              <div className="tree tree-3">
                <div className="tree-top"></div>
                <div className="tree-trunk"></div>
              </div>
              <div className="tree tree-4">
                <div className="tree-top palm"></div>
                <div className="tree-trunk"></div>
              </div>
              <div className="tree tree-5">
                <div className="tree-top"></div>
                <div className="tree-trunk"></div>
              </div>

              {/* Traffic Signal */}
              <div className="traffic-signal">
                <div className="signal-pole"></div>
                <div className="signal-box">
                  <div className="signal-light red"></div>
                  <div className="signal-light yellow"></div>
                  <div className="signal-light green active"></div>
                </div>
              </div>

              {/* Milestone */}
              <div className="milestone">
                <div className="milestone-sign">
                  <span>📍 Delivering...</span>
                </div>
                <div className="milestone-pole"></div>
              </div>

              {/* Delivery Scooter */}
              <div className="scooter">
                <div className="scooter-body">🛵</div>
                <div className="delivery-boy">👨</div>
              </div>

              {/* Dog chasing */}
              <div className="dog">🐕</div>

              {/* Main Truck */}
              <div className="truck">
                {/* Headlights */}
                <div className="headlights">
                  <div className="headlight"></div>
                  <div className="light-beam"></div>
                </div>

                {/* Horn visual */}
                <div className="horn-effect">📢</div>

                {/* Smoke from exhaust */}
                <div className="smoke-container">
                  <div className="smoke smoke-1"></div>
                  <div className="smoke smoke-2"></div>
                  <div className="smoke smoke-3"></div>
                  <div className="smoke smoke-4"></div>
                </div>

                <div className="truck-body">
                  <div className="truck-cargo">
                    <div className="cargo-boxes">
                      <span>📦</span>
                      <span>📦</span>
                    </div>
                  </div>
                  <div className="truck-cabin">
                    <div className="cabin-window">
                      <div className="driver">🙋‍♂️</div>
                    </div>
                    <div className="cabin-door"></div>
                  </div>
                </div>

                <div className="exhaust-pipe"></div>
                <div className="truck-base"></div>

                {/* Wheels with details */}
                <div className="wheel-assembly wheel-back">
                  <div className="wheel">
                    <div className="wheel-hub"></div>
                  </div>
                </div>
                <div className="wheel-assembly wheel-front">
                  <div className="wheel">
                    <div className="wheel-hub"></div>
                  </div>
                </div>
              </div>

              {/* Second Truck passing */}
              <div className="truck-2">
                <div className="truck2-body">🚛</div>
              </div>

              {/* Dust Particles */}
              <div className="dust-particles">
                <div className="particle p1"></div>
                <div className="particle p2"></div>
                <div className="particle p3"></div>
                <div className="particle p4"></div>
                <div className="particle p5"></div>
              </div>

              {/* Road */}
              <div className="road">
                <div className="road-surface"></div>
                <div className="road-marking"></div>
              </div>

              {/* Ground/Grass */}
              <div className="ground">
                <div className="grass g1"></div>
                <div className="grass g2"></div>
                <div className="grass g3"></div>
                <div className="grass g4"></div>
                <div className="grass g5"></div>
              </div>

              {/* Rating Stars */}
              <div className="rating-stars">
                <span className="star s1">⭐</span>
                <span className="star s2">⭐</span>
                <span className="star s3">⭐</span>
                <span className="star s4">⭐</span>
                <span className="star s5">⭐</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="progress-text">Checking serviceability...</p>
            </div>
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

            {/* Delhivery Services - Top */}
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

            {/* Remark */}
            {result.remark && (
              <div className="remark-box">
                {result.remark}
              </div>
            )}

            {/* Location Details - Bottom */}
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
