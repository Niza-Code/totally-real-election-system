import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()
  
  return (
    <header className="gov-header">
      <div className="gov-header-top">
        <div className="container">
          <span>An Official Website of the Department of Democracy</span>
          <span>Secure Connection (Not Really)</span>
        </div>
      </div>
      
      <div className="gov-header-main">
        <div className="container">
          <div className="gov-logo">
            <div className="gov-logo-icon">
              <i className="fas fa-landmark"></i>
            </div>
            <div className="gov-title">
              <h1>Department of Democracy</h1>
              <p>Official Election Portal™</p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="gov-nav">
        <div className="container">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/vote" className={location.pathname === '/vote' ? 'active' : ''}>
            <i className="fas fa-vote-yea"></i> Vote Now
          </Link>
          <Link to="/create" className={location.pathname === '/create' ? 'active' : ''}>
            <i className="fas fa-plus-circle"></i> Create Election
          </Link>
          <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>
            <i className="fas fa-chart-bar"></i> Results
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            <i className="fas fa-info-circle"></i> About
          </Link>
          <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
            <i className="fas fa-user-plus"></i> Register
          </Link>
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
            <i className="fas fa-sign-in-alt"></i> Login
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header