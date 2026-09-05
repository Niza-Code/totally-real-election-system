import { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const [integrityScore, setIntegrityScore] = useState(87)

  const randomizeIntegrity = () => {
    // Random between 60-95 for that "mostly trustworthy" look
    setIntegrityScore(Math.floor(Math.random() * 35) + 60)
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="official-card">
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <i className="fas fa-vote-yea" style={{fontSize: '4rem', color: '#1a3c6e'}}></i>
          <h1 style={{fontSize: '2.5rem', color: '#0a1e3d', margin: '20px 0 10px'}}>
            Your Vote Matters
          </h1>
          <p style={{fontSize: '1.2rem', color: '#4a4a4a'}}>
            Participate in the democratic process. Every voice counts.
          </p>
        </div>
        
        {/* Integrity Score */}
        <div className="integrity-meter">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{margin: 0}}>
              <i className="fas fa-shield-alt"></i> System Integrity
            </h3>
            <span style={{fontWeight: 'bold', color: '#1a3c6e'}}>{integrityScore}%</span>
          </div>
          <div className="integrity-bar">
            <div 
              className="integrity-fill" 
              style={{width: `${integrityScore}%`}}
            />
          </div>
          <p className="hint" style={{textAlign: 'center', cursor: 'pointer'}} onClick={randomizeIntegrity}>
            Click to verify integrity
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{textAlign: 'center', margin: '30px 0'}}>
            <Link to="/register" className="btn btn-primary" style={{marginRight: '10px'}}>
                <i className="fas fa-user-plus"></i> Register to Vote
            </Link>
            <Link to="/vote" className="btn btn-gold" style={{marginRight: '10px'}}>
                <i className="fas fa-vote-yea"></i> Vote Now
            </Link>
            <Link to="/create" className="btn btn-secondary" style={{marginRight: '10px'}}>
                <i className="fas fa-plus-circle"></i> Create Election
            </Link>
            <Link to="/results" className="btn btn-secondary">
                <i className="fas fa-chart-bar"></i> View Results
            </Link>
        </div>
      </div>

      {/* Official Notice */}
      <div className="official-notice warning">
        <p>
          <i className="fas fa-exclamation-triangle"></i>
          <strong> OFFICIAL NOTICE:</strong> The Department of Democracy is committed to 
          maintaining the highest standards of electoral integrity. Our systems are regularly 
          audited by independent contractors. <em>(Results may vary. Contractors may be Brian.)</em>
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">98.2%</div>
          <div className="stat-label">Voter Satisfaction*</div>
          <div className="hint">*Of voters who survived the process</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">Security Layers</div>
          <div className="hint">All decorative</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">100%</div>
          <div className="stat-label">Democracy</div>
          <div className="hint">Terms and conditions apply</div>
        </div>
      </div>

      {/* Current Election */}
      <div className="official-card">
        <h2 style={{textAlign: 'center', marginBottom: '20px'}}>
          Current Election: Supreme Leader of the Internet
        </h2>
        <p style={{textAlign: 'center', color: '#6b7280'}}>
          Cast your vote for the future of digital democracy
        </p>
        
        <div className="candidate-grid">
          <div className="candidate-card">
            <div className="candidate-avatar">
              <i className="fas fa-user-tie"></i>
            </div>
            <h3>Uncle Bob</h3>
            <p>Experienced Leadership for a Digital Age</p>
          </div>
          
          <div className="candidate-card">
            <div className="candidate-avatar">
              <i className="fas fa-dove"></i>
            </div>
            <h3>The Pigeon</h3>
            <p>A Fresh Perspective on Urban Affairs</p>
          </div>
          
          <div className="candidate-card">
            <div className="candidate-avatar">
              <i className="fas fa-code"></i>
            </div>
            <h3>The CSS Developer</h3>
            <p>Will Center the Div, Probably</p>
          </div>
        </div>
      </div>

      {/* Subtle Warning */}
      <div className="official-notice">
        <p>
          <i className="fas fa-info-circle"></i>
          <strong> Note:</strong> This is a parody website for educational and entertainment 
          purposes only. Please do not use this platform for actual elections. 
          <em> Unless you really want to see what happens when Brian is in charge.</em>
        </p>
      </div>
    </div>
  )
}

export default LandingPage