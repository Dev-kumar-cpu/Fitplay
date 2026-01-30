import React, { useState } from 'react'
import { activityIcons } from '../services/assetService'

const activityTypes = [
  { id: 'running', name: 'Running', icon: '🏃' },
  { id: 'walking', name: 'Walking', icon: '🚶' },
  { id: 'strength', name: 'Strength', icon: '💪' },
  { id: 'yoga', name: 'Yoga', icon: '🧘' },
  { id: 'cardio', name: 'Cardio', icon: '❤️' },
  { id: 'cycling', name: 'Cycling', icon: '🚴' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
]

export default function LogActivity(){
  const [activityType, setActivityType] = useState('running')
  const [duration, setDuration] = useState(30)
  const [distance, setDistance] = useState('')
  const [calories, setCalories] = useState('')
  const [notes, setNotes] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      const preview = URL.createObjectURL(file)
      setVideoPreview(preview)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      // Reset form
      setActivityType('running')
      setDuration(30)
      setDistance('')
      setCalories('')
      setNotes('')
      setVideoFile(null)
      setVideoPreview(null)
      alert('Activity logged successfully!')
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div style={{textAlign: 'center', padding: '24px'}}>
            <div style={{fontSize: '48px', marginBottom: '12px'}}>✅</div>
            <h2>Activity Logged!</h2>
            <p style={{color: '#666', marginTop: '12px'}}>Great workout! Keep up the momentum!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px'}}>
        <h1 style={{color: 'white', marginBottom: '8px'}}>Log Activity 📝</h1>
        <p>Record your workout and earn points!</p>
      </div>

      <div style={{maxWidth: '600px', margin: '0 auto'}}>
        <form onSubmit={handleSubmit}>
          {/* Activity Type Selection */}
          <div className="card">
            <h3 style={{marginTop: 0}}>Select Activity Type</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '12px', marginBottom: '20px'}}>
              {activityTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setActivityType(type.id)}
                  style={{
                    padding: '12px',
                    border: activityType === type.id ? '2px solid #667eea' : '2px solid #ddd',
                    borderRadius: '8px',
                    background: activityType === type.id ? '#f0f0ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{fontSize: '28px', marginBottom: '4px'}}>{type.icon}</div>
                  <div style={{fontSize: '12px', fontWeight: 600, color: '#333'}}>{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Details */}
          <div className="card">
            <h3 style={{marginTop: 0}}>Activity Details</h3>
            
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Distance (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                step="0.1"
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label>Calories Burned</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did the workout feel?"
                rows="3"
              ></textarea>
            </div>
          </div>

          {/* Video Upload */}
          <div className="card">
            <h3 style={{marginTop: 0}}>📹 Upload Video (Optional)</h3>
            
            <div className="form-group">
              <label>Select Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
              />
              <p style={{fontSize: '12px', color: '#999', marginTop: '8px'}}>
                Supported formats: MP4, WebM, OGG (Max 100MB)
              </p>
            </div>

            {videoPreview && (
              <div style={{marginTop: '12px'}}>
                <p style={{fontWeight: 600, marginBottom: '8px'}}>Video Preview:</p>
                <video
                  src={videoPreview}
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    background: '#000',
                    marginBottom: '8px',
                  }}
                  controls
                />
                <div style={{fontSize: '12px', color: '#666'}}>
                  File: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
            <button type="submit" className="btn-primary" style={{flex: 1}}>
              Log Activity
            </button>
            <button type="reset" className="btn-secondary" style={{flex: 1}}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
