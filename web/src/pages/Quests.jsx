import React, { useState } from 'react'
import { dailyQuests } from '../services/gamificationService'
import { activityIcons } from '../services/assetService.jsx'

const CompletionModal = ({ quest, onClose, onSubmit }) => {
  const [duration, setDuration] = useState(quest.duration)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      onSubmit({ questId: quest.id, duration })
      setSubmitted(false)
      onClose()
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div style={{textAlign: 'center', padding: '24px'}}>
            <div style={{fontSize: '48px', marginBottom: '12px'}}>🎉</div>
            <h2>Quest Completed!</h2>
            <p style={{color: '#666', marginTop: '12px'}}>You earned {quest.points} points!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">{quest.title}</div>
        <div className="modal-body">
          <div className="form-group">
            <label>Actual Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
            />
          </div>
          <div style={{color: '#666', fontSize: '14px'}}>
            <p>You will earn <strong>{quest.points} points</strong> for completing this quest.</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Complete Quest</button>
        </div>
      </div>
    </div>
  )
}

export default function Quests(){
  const [selectedQuest, setSelectedQuest] = useState(null)
  const [completedQuests, setCompletedQuests] = useState([])

  const handleQuestComplete = ({ questId }) => {
    setCompletedQuests([...completedQuests, questId])
  }

  return (
    <div>
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px'}}>
        <h1 style={{color: 'white', marginBottom: '8px'}}>Daily Quests 🎯</h1>
        <p>Complete quests to earn points and level up!</p>
      </div>

      <div className="card-grid">
        {dailyQuests.map(q=> (
          <div key={q.id} className="quest-card">
            <div style={{fontSize: '40px', marginBottom: '12px', textAlign: 'center'}}>{activityIcons[q.activityType] || '💪'}</div>
            <div className="quest-header">
              <div className="quest-title">{q.title}</div>
              <div className="points-badge">+{q.points}pts</div>
            </div>
            <div className="quest-description">{q.description}</div>
            <div style={{color: '#666', fontSize: '12px', marginBottom: '12px'}}>⏱️ Goal: {q.duration} min</div>
            <div className="quest-footer">
              <button
                className="btn-primary"
                style={{padding: '8px 14px', fontSize: '13px'}}
                onClick={() => setSelectedQuest(q)}
                disabled={completedQuests.includes(q.id)}
              >
                {completedQuests.includes(q.id) ? '✓ Done' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedQuest && (
        <CompletionModal
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onSubmit={handleQuestComplete}
        />
      )}
    </div>
  )
}
