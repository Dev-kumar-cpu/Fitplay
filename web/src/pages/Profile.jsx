import React, { useState, useEffect } from 'react'
import { getLevelFromPoints } from '../utils/helpers'
import { getUserStats, badgesConfig } from '../services/gamificationService'
import { getAvatarUrl, badgeIcons } from '../services/assetService.jsx'

export default function Profile(){
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await getUserStats('user123')
      setStats(data)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <div style={{textAlign: 'center', padding: '40px'}}><div className="spinner"></div></div>
  }

  const level = getLevelFromPoints(stats.totalPoints || 0)
  const progressToNextLevel = Math.min(((stats.totalPoints % 500) / 500) * 100, 100)
  const displayName = 'Athlete'
  const userId = 'user123'

  return (
    <div>
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center'}}>
        <img src={getAvatarUrl(userId, displayName)} alt={displayName} style={{width: '80px', height: '80px', borderRadius: '50%', marginBottom: '12px', border: '3px solid white'}} />
        <h1 style={{color: 'white', marginBottom: '4px'}}>{displayName}</h1>
        <p style={{opacity: 0.9}}>Level {level.level} • {level.name}</p>
      </div>

      <h2>Level Progress</h2>
      <div className="card">
        <div style={{marginBottom: '16px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
            <span style={{fontWeight: 600}}>Level {level.level} • {level.name}</span>
            <span>{stats.totalPoints} pts</span>
          </div>
          <div style={{background: '#eee', height: '12px', borderRadius: '6px', overflow: 'hidden'}}>
            <div style={{background: `linear-gradient(135deg, #667eea, #764ba2)`, height: '100%', width: `${progressToNextLevel}%`, transition: 'width 0.3s ease'}}></div>
          </div>
        </div>
      </div>

      <h2>Statistics</h2>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.workoutCount}</div>
          <div className="stat-label">Workouts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.floor(stats.totalMinutes / 60)}</div>
          <div className="stat-label">Hours Trained</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <h2>Badges Earned ({stats.badges.length})</h2>
      {stats.badges.length > 0 ? (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px'}}>
          {stats.badges.map(badgeId => {
            const badge = badgesConfig.find(b => b.id === badgeId)
            if (!badge) return null
            return (
              <div key={badge.id} style={{textAlign: 'center', padding: '12px', background: badge.color + '15', borderRadius: '8px', borderLeft: `4px solid ${badge.color}`}}>
                <div style={{fontSize: '32px', marginBottom: '6px'}}>{badgeIcons[badge.id] || '⭐'}</div>
                <div style={{fontSize: '12px', fontWeight: 600}}>{badge.name}</div>
                <div style={{fontSize: '10px', color: '#666', marginTop: '4px'}}>{badge.description}</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card" style={{textAlign: 'center', color: '#999'}}>
          <p>Complete quests to unlock badges!</p>
        </div>
      )}
    </div>
  )
}
