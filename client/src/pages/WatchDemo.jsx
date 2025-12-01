import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Home, Users, Mail, Github } from 'lucide-react'
import { useNavigate } from 'react-router'
import demoVideo from '../assets/zohai.mp4'

const WatchDemo = () => {
  // State Management
  const [videoSrc, setVideoSrc] = useState(demoVideo)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // Refs
  const videoRef = useRef(null)
  const navigate = useNavigate()

  // Handle Video Upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
    }
  }

  // Toggle Play/Pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle Speed Change
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  // Handle Progress Bar Change
  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration
    setCurrentTime(newTime)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  // Handle Time Update
  const handleTimeUpdate = (e) => {
    setCurrentTime(e.currentTarget.currentTime)
  }

  // Handle Metadata Loaded
  const handleLoadedMetadata = (e) => {
    setDuration(e.currentTarget.duration)
  }

  // Calculate Progress Percentage
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0


useEffect(() => {
  // Hide navbar and sidebar
  const navbar = document.querySelector('nav')
  const sidebar = document.querySelector('.sidebar')
  
  if (navbar) navbar.style.display = 'none'
  if (sidebar) sidebar.style.display = 'none'
  
  return () => {
    if (navbar) navbar.style.display = 'block'
    if (sidebar) sidebar.style.display = 'block'
  }
}, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      
      {/* Header Section */}
      <div className="pt-8 px-6 max-w-6xl mx-auto mb-16">
        <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent mb-4">
          Watch Demo
        </h1>
        <p className="text-xl text-purple-200">
          Explore the power of our AI-powered tools
        </p>
      </div>

      {/* Video Player Section */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-black/50 rounded-3xl border-2 border-purple-500/50 backdrop-blur-lg p-8 shadow-2xl">
          
          <div className="space-y-4">
            {/* Video Element */}
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full rounded-xl bg-black"
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            
            {/* Player Controls */}
            <div className="bg-purple-900/50 rounded-xl p-4 space-y-4">
              
              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={handleProgressChange}
                  className="flex-1 h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:h-3 transition-all"
                  style={{
                    background: `linear-gradient(to right, rgb(236, 72, 153) 0%, rgb(236, 72, 153) ${progressPercentage}%, rgb(88, 28, 135) ${progressPercentage}%, rgb(88, 28, 135) 100%)`
                  }}
                />
              </div>

              {/* Play/Pause Button and Speed Control */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Play
                    </>
                  )}
                </button>

                {/* Speed Control */}
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <span className="text-sm font-semibold text-purple-200">Speed:</span>
                  <div className="flex gap-2">
                    {[0.5, 1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          playbackSpeed === speed
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-105'
                            : 'bg-purple-700/50 hover:bg-purple-600/50'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-12 text-center">
          Steps to Start
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-lg hover:border-purple-500/60 transition-all transform hover:scale-105">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-lg">1</div>
              <h3 className="text-2xl font-bold text-purple-300 mt-2">Click Getting Started</h3>
            </div>
            <p className="text-purple-100/70 leading-relaxed">
              Begin your journey by clicking the "Getting Started" button to initialize the application setup.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-lg hover:border-purple-500/60 transition-all transform hover:scale-105">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-lg">2</div>
              <h3 className="text-2xl font-bold text-purple-300 mt-2">Join with Google</h3>
            </div>
            <p className="text-purple-100/70 leading-relaxed">
              Sign up or log in using your Google account for quick and secure authentication.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-lg hover:border-purple-500/60 transition-all transform hover:scale-105">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-lg">3</div>
              <h3 className="text-2xl font-bold text-purple-300 mt-2">Build with AI</h3>
            </div>
            <p className="text-purple-100/70 leading-relaxed">
              Click "Build with AI" to start creating and exploring AI-powered features.
            </p>
          </div>

          {/* Step 4 - Premium */}
          <div className="bg-gradient-to-br from-amber-900/50 to-slate-900/50 border-2 border-amber-500/50 rounded-2xl p-8 backdrop-blur-lg hover:border-amber-500/80 transition-all transform hover:scale-105">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center font-bold text-lg">★</div>
              <h3 className="text-2xl font-bold text-amber-300 mt-2">Get Premium - $20</h3>
            </div>
            <p className="text-amber-100/70 leading-relaxed">
              Unlock unlimited features! Get 2+ free features, then upgrade for access to all premium tools.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50 border border-purple-500/30 rounded-2xl p-12 backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-200">
            Premium Features Included
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className="text-xl font-bold text-purple-300">Generate Image</h3>
              <p className="text-purple-100/60 text-sm mt-2">Create stunning AI-generated images</p>
            </div>
            <div>
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-purple-300">Remove Object</h3>
              <p className="text-purple-100/60 text-sm mt-2">Intelligently remove unwanted objects</p>
            </div>
            <div>
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-purple-300">Remove Background</h3>
              <p className="text-purple-100/60 text-sm mt-2">Clean background removal with precision</p>
            </div>
            <div>
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-purple-300">Review Resume</h3>
              <p className="text-purple-100/60 text-sm mt-2">AI-powered resume analysis & feedback</p>
            </div>
            <div>
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-purple-300">And Much More</h3>
              <p className="text-purple-100/60 text-sm mt-2">Continuous feature updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/50 border border-purple-500/30 rounded-2xl p-12 backdrop-blur-lg">
          <div className="flex items-center gap-4 mb-6">
            <Users className="w-10 h-10 text-purple-400" />
            <h2 className="text-3xl font-bold text-purple-300">Community Gallery</h2>
          </div>
          <p className="text-purple-100/70 text-lg mb-4">
            Join our vibrant community and showcase your AI-generated masterpieces! Browse and share stunning images created by members worldwide.
          </p>
          <p className="text-purple-100/60">
            Explore the community gallery to see what others have created, get inspired, and connect with fellow AI enthusiasts.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-purple-500/30 bg-slate-900/50 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Contact Information */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-purple-300 mb-6">Get In Touch</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <a href="mailto:iamzohaib777@gmail.com" className="flex items-center gap-3 text-purple-200 hover:text-purple-400 transition-all text-lg">
                <Mail className="w-6 h-6" />
                <span>Contact Developer</span>
              </a>
              <a href="https://github.com/zobbygit" className="flex items-center gap-3 text-purple-200 hover:text-purple-400 transition-all text-lg">
                <Github className="w-6 h-6" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

          {/* Home Button */}
          <div className="flex justify-center">
            <button onClick={() => navigate('/')} className="group relative px-10 py-4 text-2xl font-black text-white rounded-2xl overflow-hidden transition-all transform hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 group-hover:opacity-0 transition-opacity"></div>
              <div className="relative flex items-center gap-3 group-hover:animate-bounce">
                <Home className="w-7 h-7" />
                Go Back Home
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WatchDemo