import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function BrowseElectionsPage() {
  const [polls, setPolls] = useState([])
  const [filteredPolls, setFilteredPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchPolls()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [polls, searchTerm, sortBy, filterStatus])

  const fetchPolls = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/polls')
      setPolls(response.data.polls)
      setFilteredPolls(response.data.polls)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch elections. Democracy is taking a coffee break.')
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...polls]

    // Search filter (searches titles and descriptions)
    if (searchTerm) {
      filtered = filtered.filter(poll => 
        poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (poll.description && poll.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(poll => 
        !poll.voting_ends_at || new Date(poll.voting_ends_at) > new Date()
      )
    } else if (filterStatus === 'ended') {
      filtered = filtered.filter(poll => 
        poll.voting_ends_at && new Date(poll.voting_ends_at) < new Date()
      )
    } else if (filterStatus === 'chaos') {
      // Show polls with suspicious characteristics
      filtered = filtered.filter(poll => 
        poll.vote_count > 100 || poll.candidate_count > 5
      )
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'popular':
        filtered.sort((a, b) => b.vote_count - a.vote_count)
        break
      case 'controversial':
        filtered.sort((a, b) => b.candidate_count - a.candidate_count)
        break
      case 'chaos':
        filtered.sort(() => Math.random() - 0.5)
        break
      default:
        break
    }

    setFilteredPolls(filtered)
  }

  const getTimeRemaining = (endTime) => {
    if (!endTime) return 'Never ends'
    
    const now = new Date()
    const end = new Date(endTime)
    const diff = end - now

    if (diff < 0) {
      return 'Ended ' + formatTimeAgo(end)
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} days remaining`
    }
    
    return `${hours}h ${minutes}m remaining`
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }

  const getStatusBadge = (poll) => {
    if (!poll.voting_ends_at) {
      return { text: 'Never Ends', color: '#1a3c6e', icon: 'fa-infinity' }
    }
    
    const now = new Date()
    const end = new Date(poll.voting_ends_at)
    
    if (end < now) {
      return { text: 'Ended', color: '#8b1a1a', icon: 'fa-clock' }
    }
    
    const diff = end - now
    if (diff < 1000 * 60 * 60) {
      return { text: 'Ending Soon', color: '#c9a84c', icon: 'fa-hourglass-half' }
    }
    
    return { text: 'Active', color: '#4caf50', icon: 'fa-check-circle' }
  }

  if (loading) {
    return (
      <div className="official-card">
        <div style={{textAlign: 'center', padding: '50px'}}>
          <i className="fas fa-spinner fa-spin" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <p style={{marginTop: '20px', color: '#6b7280'}}>
            Loading elections...
          </p>
          <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
            (Democracy is buffering)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="browse-elections-page">
      {/* Header */}
      <div className="official-card">
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <i className="fas fa-list-alt" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <h2>Browse Elections</h2>
          <p style={{color: '#6b7280'}}>
            Explore all active democratic processes. Vote responsibly. Or don't.
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{marginBottom: '30px'}}>
          <div className="form-group">
            <label htmlFor="search">
              <i className="fas fa-search"></i> Search Elections
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
            />
          </div>

          <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
            <div className="form-group" style={{flex: 1, minWidth: '200px'}}>
              <label htmlFor="sortBy">
                <i className="fas fa-sort"></i> Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Votes</option>
                <option value="controversial">Most Candidates</option>
                <option value="chaos">Random (Chaos Mode)</option>
              </select>
            </div>

            <div className="form-group" style={{flex: 1, minWidth: '200px'}}>
              <label htmlFor="filterStatus">
                <i className="fas fa-filter"></i> Filter Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Elections</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
                <option value="chaos">Suspicious Activity</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="official-notice warning">
            <p><i className="fas fa-exclamation-circle"></i> {error}</p>
          </div>
        )}
      </div>

      {/* Election Grid */}
      {filteredPolls.length === 0 ? (
        <div className="official-card">
          <div style={{textAlign: 'center', padding: '40px'}}>
            <i className="fas fa-box-open" style={{fontSize: '3rem', color: '#6b7280'}}></i>
            <h3 style={{marginTop: '15px'}}>No Elections Found</h3>
            <p style={{color: '#6b7280'}}>
              {searchTerm 
                ? 'No elections match your search. Try searching for "pigeon" or "chaos".'
                : 'There are no elections yet. Be the change you want to see.'}
            </p>
            <Link to="/create" className="btn btn-primary" style={{marginTop: '20px'}}>
              <i className="fas fa-plus-circle"></i> Create Election
            </Link>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredPolls.map(poll => {
            const status = getStatusBadge(poll)
            return (
              <div key={poll.id} className="official-card" style={{
                marginBottom: '0',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
              }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div style={{flex: 1}}>
                    <h3 style={{marginBottom: '5px'}}>
                      <i className="fas fa-vote-yea"></i> {poll.title}
                    </h3>
                    {poll.description && (
                      <p style={{fontSize: '0.85rem', color: '#6b7280'}}>
                        {poll.description}
                      </p>
                    )}
                  </div>
                  <span style={{
                    background: status.color,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    marginLeft: '10px'
                  }}>
                    <i className={`fas ${status.icon}`}></i> {status.text}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '15px',
                  marginBottom: '15px',
                  fontSize: '0.85rem',
                  color: '#6b7280'
                }}>
                  <span>
                    <i className="fas fa-users"></i> {poll.candidate_count} Candidates
                  </span>
                  <span>
                    <i className="fas fa-vote-yea"></i> {poll.vote_count} Votes
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> {getTimeRemaining(poll.voting_ends_at)}
                  </span>
                </div>

                <div style={{textAlign: 'center', marginTop: '15px'}}>
                  <Link 
                    to={`/poll/${poll.id}`}
                    className="btn btn-primary"
                    style={{width: '100%', justifyContent: 'center'}}
                  >
                    <i className="fas fa-check-circle"></i> Vote in This Election
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Suspicious Footer */}
      <div className="official-notice" style={{marginTop: '30px'}}>
        <p>
          <i className="fas fa-info-circle"></i>
          <strong> Note:</strong> Some elections may display inconsistent vote counts due to 
          "democratic enthusiasm." This is a feature, not a bug.
        </p>
      </div>
    </div>
  )
}

export default BrowseElectionsPage