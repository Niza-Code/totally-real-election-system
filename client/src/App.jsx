import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VotePage from './pages/VotePage'
import CreateElectionPage from './pages/CreateElectionPage'
import PollDetailPage from './pages/PollDetailPage'
import ResultsPage from './pages/ResultsPage'
import BrowseElectionsPage from './pages/BrowseElectionsPage'
import AdminPanelPage from './pages/AdminPanelPage'
import HallOfShamePage from './pages/HallOfShamePage'
import './styles/global.css'
import LeaderboardsPage from './pages/LeaderboardsPage'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/vote" element={<VotePage />} />
              <Route path="/create" element={<CreateElectionPage />} />
              <Route path="/poll/:id" element={<PollDetailPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/browse" element={<BrowseElectionsPage />} />
              <Route path="/admin/:pollId" element={<AdminPanelPage />} />
              <Route path="/hall-of-shame" element={<HallOfShamePage />} />
              <Route path="/leaderboards" element={<LeaderboardsPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App