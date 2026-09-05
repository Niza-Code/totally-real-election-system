import { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const [integrityScore, setIntegrityScore] = useState(37)

  const randomizeIntegrity = () => {
    setIntegrityScore(Math.floor(Math.random() * 31) + 10) // 10-40%
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">
          🗳️ WELCOME TO THE MOST TRUSTWORTHY ELECTION SYSTEM™
        </h1>
        <p className="hero-subtitle">
          Built with absolutely no confidence.
        </p>
        
        {/* Integrity Score */}
        <div className="integrity-score" onClick={randomizeIntegrity}>
          <p>Election Integrity Score:</p>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{width: `${integrityScore}%`}}
            />
          </div>
          <p className="score-number">{integrityScore}% (click to recalculate)</p>
        </div>

        {/* CTA Buttons */}
        <div className="cta-buttons">
          <Link to="/vote" className="btn btn-primary">
            🗳️ VOTE NOW
          </Link>
          <Link to="/create" className="btn btn-secondary">
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
          *probably not | **definitely not
        </div>
      </div>

      {/* Sample Candidates */}
      <div className="candidate-preview">
        <h2>Current Election: Supreme Leader of the Internet</h2>
        <div className="candidate-grid">
          <div className="candidate-card">
            <span className="candidate-emoji">👨</span>
            <h3>Uncle Bob</h3>
            <p>The Sensible Choice™</p>
          </div>
          <div className="candidate-card">
            <span className="candidate-emoji">🐦</span>
            <h3>The Pigeon</h3>
            <p>Has been eyeing that statue all week</p>
          </div>
          <div className="candidate-card">
            <span className="candidate-emoji">💻</span>
            <h3>The CSS Developer</h3>
            <p>Will center the div, probably</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage