import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Quests from './pages/Quests'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import LogActivity from './pages/LogActivity'
import MediaGallery from './pages/MediaGallery'
import Login from './pages/Login'

export default function App(){
  return (
    <div>
      <nav style={{padding:12, borderBottom:'1px solid #eee', display:'flex', gap:12}}>
        <Link to="/">🏠 Home</Link>
        <Link to="/quests">🎯 Quests</Link>
        <Link to="/log">📝 Log</Link>
        <Link to="/media">📸 Media</Link>
        <Link to="/leaderboard">🏆 Rank</Link>
        <Link to="/profile">👤 Profile</Link>
        <div style={{flex:1}} />
        <Link to="/login">🔐 Login</Link>
      </nav>

      <main style={{padding:20}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/quests" element={<Quests/>} />
          <Route path="/log" element={<LogActivity/>} />
          <Route path="/media" element={<MediaGallery/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </main>
    </div>
  )
}
