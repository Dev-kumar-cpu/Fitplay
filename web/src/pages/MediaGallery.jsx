import React, { useState } from 'react'
import { activityIcons } from '../services/assetService.jsx'

// Sample instructional videos (place real mp4 files in web/public/assets/videos/ or update URLs)
const sampleVideos = [
  { id: 'sample1', name: 'Full Body Warmup', src: '/assets/videos/sample1.mp4', duration: '5:30' },
  { id: 'sample2', name: 'HIIT 20min', src: '/assets/videos/sample2.mp4', duration: '20:00' },
]

export default function MediaGallery(){
  const [uploadedVideos, setUploadedVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedSample, setSelectedSample] = useState(null)

  const handleVideoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedVideos(prev => ([...prev, {
          id: Date.now(),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          src: e.target.result,
          uploadDate: new Date().toLocaleDateString()
        }]))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteVideo = (id) => {
    setUploadedVideos(prev => prev.filter(v => v.id !== id))
    if (selectedVideo?.id === id) setSelectedVideo(null)
  }

  const selectSample = (s) => {
    setSelectedSample(s)
    setSelectedVideo({ id: s.id, name: s.name, src: s.src, size: '—', uploadDate: 'Provided' })
  }

  return (
    <div>
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px'}}>
        <h1 style={{color: 'white', marginBottom: '8px'}}>📸 Media Gallery</h1>
        <p>Instructional videos are provided below — pick one and follow along.</p>
      </div>

      <h2>Instructional Videos</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px'}}>
        {sampleVideos.map(s => (
          <div key={s.id} style={{border: selectedSample?.id === s.id ? '2px solid #667eea' : '1px solid #ddd', borderRadius: 8, padding: 12, background: '#fff'}}>
            <div style={{height: 110, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 8}}>🎬</div>
            <div style={{fontWeight: 700}}>{s.name}</div>
            <div style={{fontSize: 12, color: '#666'}}>{s.duration}</div>
            <div style={{marginTop: 8, display: 'flex', gap: 8}}>
              <button className="btn-primary" onClick={() => selectSample(s)} style={{flex: 1}}>Play</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom: '24px'}}>
        <h2>Upload Video (optional)</h2>
        <div style={{border: '2px dashed #667eea', borderRadius: '8px', padding: '24px', textAlign: 'center', background: '#f8f9ff'}}>
          <input type="file" accept="video/*" onChange={handleVideoUpload} style={{display: 'none'}} id="video-upload" />
          <label htmlFor="video-upload" style={{cursor: 'pointer', display: 'block'}}>
            <div style={{fontSize: '36px', marginBottom: '8px'}}>📤</div>
            <div style={{fontSize: '14px', fontWeight: 600, color: '#333'}}>Upload Your Video (optional)</div>
            <div style={{fontSize: '12px', color: '#666'}}>Or use one of the instructional videos above</div>
            <button className="btn-primary" style={{marginTop: '12px'}} onClick={() => document.getElementById('video-upload').click()}>Choose Video</button>
          </label>
        </div>
      </div>

      {uploadedVideos.length > 0 && (
        <div>
          <h2>Your Uploaded Videos ({uploadedVideos.length})</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
            {uploadedVideos.map(video => (
              <div key={video.id} style={{border: selectedVideo?.id === video.id ? '2px solid #667eea' : '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#f8f9ff', cursor: 'pointer'}} onClick={() => setSelectedVideo(video)}>
                <div style={{background: '#000', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px'}}>🎬</div>
                <div style={{padding: '12px'}}>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '4px'}}>{video.name.substring(0, 20)}...</div>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Size: {video.size} MB</div>
                  <div style={{fontSize: '11px', color: '#999', marginBottom: '8px'}}>Uploaded: {video.uploadDate}</div>
                  <button onClick={(e) => {e.stopPropagation(); handleDeleteVideo(video.id)}} style={{background: '#ff4757', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedVideo && (
        <div className="card">
          <h2>Video Preview</h2>
          <div style={{background: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px'}}>
            <video src={selectedVideo.src} controls style={{width: '100%', maxHeight: '400px'}} />
          </div>
          <div>
            <div><strong>Name:</strong> {selectedVideo.name}</div>
            <div><strong>Size:</strong> {selectedVideo.size}</div>
            <div><strong>Source:</strong> {selectedVideo.uploadDate === 'Provided' ? 'Instructional' : 'Uploaded'}</div>
          </div>
        </div>
      )}

    </div>
  )
}
