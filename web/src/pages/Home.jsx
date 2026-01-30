import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { dailyQuests } from '../services/gamificationService'
import { getLevelFromPoints, getMotivationalMessage, formatDuration } from '../utils/helpers'
import { activityIcons } from '../services/assetService.jsx'

export default function Home(){
  const [points] = useState(1200)
  const [workoutCount] = useState(28)
  const [totalMinutes] = useState(1140)
  const [leaderboardRank] = useState(12)
  const level = getLevelFromPoints(points)
  const message = getMotivationalMessage(points)

  return (
    <div>
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px'}}>
        <h1 style={{color: 'white', marginBottom: '8px'}}>Welcome back, Athlete! 💪</h1>
        <p style={{opacity: 0.95}}>{message}</p>
      </div>

      <h2>Quick Stats</h2>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{points}</div>
          <div className="stat-label">Points Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Lv {level.level}</div>
          <div className="stat-label">{level.name}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">#{leaderboardRank}</div>
          <div className="stat-label">Global Rank</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{workoutCount}</div>
          <div className="stat-label">Workouts</div>
        </div>
      </div>

      <h2>This Week's Progress</h2>
      <div className="card">
        <div style={{marginBottom: '16px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
            <span>Total Activity Time</span>
            <strong>{formatDuration(totalMinutes)}</strong>
          </div>
          <div style={{background: '#eee', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
            <div style={{background: '#667eea', height: '100%', width: '60%'}}></div>
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginTop: '16px'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '28px', marginBottom: '4px'}}>🏃</div>
            <div style={{fontSize: '12px', color: '#666'}}>Running</div>
            <div style={{fontWeight: 600, color: '#333'}}>8 min</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '28px', marginBottom: '4px'}}>💪</div>
            <div style={{fontSize: '12px', color: '#666'}}>Strength</div>
            <div style={{fontWeight: 600, color: '#333'}}>120 min</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '28px', marginBottom: '4px'}}>🧘</div>
            <div style={{fontSize: '12px', color: '#666'}}>Yoga</div>
            <div style={{fontWeight: 600, color: '#333'}}>40 min</div>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: '12px', marginBottom: '20px', marginTop: '20px'}}>
        <Link to="/log" style={{flex: 1, textDecoration: 'none'}}>
          <button className="btn-primary" style={{width: '100%'}}>📝 Log Activity</button>
        </Link>
        <Link to="/quests" style={{flex: 1, textDecoration: 'none'}}>
          <button className="btn-secondary" style={{width: '100%'}}>🎯 View Quests</button>
        </Link>
      </div>

      <h2>Available Quests</h2>
      <div className="card-grid">
        {dailyQuests.slice(0, 3).map(q=> (
          <div key={q.id} className="quest-card">
            <div style={{fontSize: '32px', marginBottom: '8px'}}>{activityIcons[q.activityType] || '💪'}</div>
            <div className="quest-header">
              <div className="quest-title">{q.title}</div>
              <div className="points-badge">+{q.points}pts</div>
            </div>
            <div className="quest-description">{q.description}</div>
            <div className="quest-footer">
              <span className="quest-duration">⏱️ {q.duration} min</span>
              <Link to="/quests" style={{textDecoration: 'none'}}>
                <button className="btn-primary" style={{padding: '6px 12px', fontSize: '12px'}}>Start</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
