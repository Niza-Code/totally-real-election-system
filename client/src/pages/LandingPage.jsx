import { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const [integrityScore, setIntegrityScore] = useState(37)

  const randomizeIntegrity = () => {
    setIntegrityScore(Math.floor(Math.random() * 31) + 10) // 10-40%
  }

  return (
    <div className="landing-page">
      {/* Government Header */}
      <header className="gov-header">
        <h1>🗳️ Department of Democracy</h1>
        <p style={{textAlign: 'center', color: '#ffd700', marginTop: '10px'}}>
          Official Election Portal™ (Not Actually Official)
        </p>
      </header>

      {/* Hero Section */}
      <div className="glass-panel hero">
        <h2 className="hero-title" style={{color: 'white', textAlign: 'center', marginBottom: '20px'}}>
          WELCOME TO THE MOST TRUSTWORTHY ELECTION SYSTEM™
        </h2>
        <p className="hero-subtitle" style={{color: 'white', textAlign: 'center'}}>
          Built with absolutely no confidence.
        </p>
        
        {/* Integrity Score */}
        <div className="integrity-score">
          <p style={{color: 'white'}}>Election Integrity Score:</p>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{width: `${integrityScore}%`}}
            />
          </div>
          <p className="score-number">{integrityScore}% (click to recalculate)</p>
        </div>

        {/* CTA Buttons */}
        <div style={{textAlign: 'center', margin: '30px 0'}}>
          <Link to="/vote" className="btn btn-primary">
            🗳️ VOTE NOW
          </Link>
          <Link to="/create" className="btn btn-secondary" style={{marginLeft: '10px'}}>
            📝 CREATE YOUR OWN ELECTION
          </Link>
        </div>

        {/* Parody Warning */}
        <div className="warning-box">
          <p className="blink">
            ⚠️ THIS IS A PARODY. THIS IS NOT AN OFFICIAL VOTING SYSTEM.
          </p>
          <p>
            DO NOT USE THESE RESULTS TO MAKE REAL-WORLD DECISIONS.
          </p>
          <p>
            This system is about as secure as a screen door on a submarine.
          </p>
        </div>
      </div>

      {/* Ticker */}
      <div className="ticker">
        <div className="marquee">
          🔒 SECURE 🔒 BLOCKCHAIN™ 🔒 ENCRYPTED* 🔒 TRUST US** 🔒 
          *probably not | **definitely not | ***The Pigeon is watching
        </div>
      </div>

      {/* Sample Candidates */}
      <div className="glass-panel" style={{marginTop: '30px'}}>
        <h2 style={{color: 'white', textAlign: 'center', marginBottom: '20px'}}>
          Current Election: Supreme Leader of the Internet
        </h2>
        <div className="candidate-grid">
          <div className="candidate-card">
            <span className="candidate-emoji">👨</span>
            <h3 style={{color: 'white'}}>Uncle Bob</h3>
            <p style={{color: '#ffd700'}}>The Sensible Choice™</p>
          </div>
          <div className="candidate-card">
            <span className="candidate-emoji">🐦</span>
            <h3 style={{color: 'white'}}>The Pigeon</h3>
            <p style={{color: '#ffd700'}}>Has been eyeing that statue all week</p>
          </div>
          <div className="candidate-card">
            <span className="candidate-emoji">💻</span>
            <h3 style={{color: 'white'}}>The CSS Developer</h3>
            <p style={{color: '#ffd700'}}>Will center the div, probably</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{textAlign: 'center', marginTop: '30px', color: 'white'}}>
        <p>© 2026 Department of Democracy. All rights reserved. Or not.</p>
        <p style={{fontSize: '0.8em', marginTop: '10px'}}>
          BLOCKCHAIN™ | ENCRYPTED* | SECURE** | TRUST US***
        </p>
        <p style={{fontSize: '0.7em'}}>
          *probably not | **definitely not | ***please don't
        </p>
      </footer>
    </div>
  )
}

export default LandingPage