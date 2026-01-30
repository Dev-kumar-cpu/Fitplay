import React, { useState, useEffect } from 'react'
import { getLevelFromPoints } from '../utils/helpers'
import { getLeaderboard } from '../services/gamificationService'
import { getAvatarUrl } from '../services/assetService.jsx'

const LeaderboardRow = ({ rank, user, isCurrentUser }) => {
  const level = getLevelFromPoints(user.totalPoints || 0)
  const medals = {1: '🥇', 2: '🥈', 3: '🥉'}

  return (
    <div className={`leaderboard-row ${isCurrentUser ? 'current-user-row' : ''}`}>
      <div className="rank">{medals[rank] || `#${rank}`}</div>
      <img src={getAvatarUrl(user.id, user.displayName)} alt={user.displayName} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
      <div className="user-info">
        <div className="user-name">{user.displayName || 'Anonymous'}</div>
        <div className="user-level">Level {level.level} • {level.name}</div>
      </div>
      <div className="points-display">
        <div className="points-value">{user.totalPoints || 0}</div>
        <div className="points-label">pts</div>
      </div>
    </div>
  )
}

export default function Leaderboard(){
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUserId = 'user123'

  useEffect(() => {
    const loadData = async () => {
      const data = await getLeaderboard()
      setLeaderboard(data)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <div style={{textAlign: 'center', padding: '40px'}}><div className="spinner"></div></div>
  }

  return (
    <div>
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px'}}>
        <h1 style={{color: 'white', marginBottom: '4px'}}>Leaderboard 🏆</h1>
        <p>Top performers globally</p>
      </div>

      <div>
        {leaderboard.map((user, idx) => (
          <LeaderboardRow
            key={user.id}
            rank={idx + 1}
            user={user}
            isCurrentUser={user.id === currentUserId}
          />
        ))}
      </div>
    </div>
  )
}
