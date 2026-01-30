import React, { useState } from 'react'

export default function Login(){
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      setMessage(`${isLogin ? 'Login' : 'Registration'} successful!`)
      setLoading(false)
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    }, 1500)
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)'}}>
      <div style={{width: '100%', maxWidth: '400px', padding: '20px'}}>
        <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px', borderRadius: '8px 8px 0 0', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '12px'}}>💪</div>
          <h1 style={{color: 'white', marginBottom: '4px', fontSize: '24px'}}>FitPlay</h1>
          <p>Gamified Fitness Tracking</p>
        </div>

        <div className="card" style={{borderRadius: '0 0 8px 8px'}}>
          {message && <div className="alert alert-success">{message}</div>}
          
          <h2 style={{marginTop: 0, textAlign: 'center'}}>{isLogin ? 'Login' : 'Sign Up'}</h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{width: '100%', marginBottom: '12px'}} disabled={loading}>
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div style={{textAlign: 'center', marginTop: '16px'}}>
            <span style={{color: '#666', fontSize: '14px'}}>
              {isLogin ? 'No account? ' : 'Have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: 600}}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
