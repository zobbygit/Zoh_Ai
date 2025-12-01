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

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen'>
      {/* Hide navbar on Watch Demo page */}
      {!isWatchDemo && (
        <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-300'>
          <img 
            src={assets.neww} 
            alt="" 
            className='w-12 h-12 sm:w-20 cursor-pointer' 
            onClick={() => navigate('/')} 
          />
          {sidebar ? (
            <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
          ) : (
            <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
          )}
        </nav>
      )}

      <div className={`flex-1 w-full flex ${isWatchDemo ? 'h-screen' : 'h-[calc(100vh-64px)]'}`}>
        {/* Hide sidebar on Watch Demo page */}
        {!isWatchDemo && <Sidebar sidebar={sidebar} setSidebar={setSidebar} />}
        
        <div className={`${isWatchDemo ? 'w-full' : 'flex-1'} ${isWatchDemo ? '' : 'bg-[#e0e1e36a]'}`}>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout