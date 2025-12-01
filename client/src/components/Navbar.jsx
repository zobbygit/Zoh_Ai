import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo + Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src={assets.neww}
            alt="logo"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shadow-sm ring-1 ring-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Zoh.AI
            </span>
            <span className="text-xs text-slate-500">
              Smart content, faster.
            </span>
          </div>
        </div>

        {/* Right: Auth */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              Signed in
            </span>
            <div className="rounded-full border border-slate-200/80 bg-white px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200">
              <UserButton />
            </div>
          </div>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md hover:bg-slate-950 active:scale-95 transition-all duration-200"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
