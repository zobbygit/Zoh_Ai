import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()

  // Check if current page is Watch Demo
  const isWatchDemo = location.pathname === '/ai/watch'

  // Close sidebar when route changes
  useEffect(() => {
    setSidebar(false)
  }, [location.pathname])

  // Close sidebar on window resize to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setSidebar(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return user ? (
    <div className="flex flex-col h-screen w-full">
      {/* Navbar */}
      {!isWatchDemo && (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full h-[70px] px-4 sm:px-8 flex items-center justify-between border-b border-gray-300 bg-white">
          <img
            src={assets.neww}
            alt="logo"
            className="w-12 h-12 sm:w-14 sm:h-14 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          />
          {sidebar ? (
            <X
              onClick={() => setSidebar(false)}
              className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer hover:text-gray-800 transition-colors"
            />
          ) : (
            <Menu
              onClick={() => setSidebar(true)}
              className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer hover:text-gray-800 transition-colors"
            />
          )}
        </nav>
      )}

      {/* Main Content Area */}
      <div
        className={`flex w-full flex-1 ${
          isWatchDemo ? 'h-screen' : 'h-[calc(100vh-70px)]'
        }`}
      >
        {/* Sidebar */}
        {!isWatchDemo && <Sidebar sidebar={sidebar} setSidebar={setSidebar} />}

        {/* Content */}
        <div
          className={`${
            isWatchDemo ? 'w-full' : 'flex-1'
          } overflow-hidden ${isWatchDemo ? '' : 'bg-[#e0e1e36a]'}`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen w-full">
      <SignIn />
    </div>
  )
}

export default Layout
