import { Link, useLocation, useNavigate } from 'react-router-dom'

function Footer() {
  return (
    <footer className="gov-footer">
      <div className="container">
        <div className="stat-grid">
          <div>
            <h4>Department of Democracy</h4>
            <p>Serving the people since 2026</p>
            <p>Headquarters: The Cloud (probably)</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/nigel" style={{color: '#b8c4d8', textDecoration: 'none', display: 'block', marginBottom: '5px'}}>
              Nigel's Page
            </Link>
            <Link to="/pigeon" style={{color: '#b8c4d8', textDecoration: 'none', display: 'block', marginBottom: '5px'}}>
              The Pigeon's Campaign
            </Link>
            <p>Vote Now</p>
            <p>Election Results</p>
            <p>Report an Issue (Nigel will ignore it)</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>Email: democracy@totally-real.gov</p>
            <p>Phone: 1-800-VOTE-NOW</p>
            <p>Hours: Whenever Nigel feels like it</p>
          </div>
        </div>
        
        <hr style={{borderColor: '#2c3e50', margin: '20px 0'}} />
        
        <p className="fine-print">
          ⚠️ DISCLAIMER: This is a parody website. This is not an official voting system. 
          Do not use these results to make real-world decisions. 
          This system is about as secure as a screen door on a submarine.
        </p>
        <p className="fine-print">
          BLOCKCHAIN™ | ENCRYPTED* | SECURE** | TRUST US***
        </p>
        <p className="fine-print">
          *Probably not | **Definitely not | ***Please don't
        </p>
        <p className="fine-print" style={{marginTop: '20px'}}>
          © 2026 Department of Democracy. All rights reserved. Or not.
        </p>
      </div>
    </footer>
  )
}

export default Footer