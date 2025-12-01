import { useAuth, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Heart, Grid2X2, Users } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [likedItems, setLikedItems] = useState(new Set())

  const fetchCreations = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setCreations(data.creations || [])
        // Initialize liked items based on current user
        const liked = new Set()
        data.creations?.forEach((creation) => {
          if (creation.likes && Array.isArray(creation.likes) && creation.likes.includes(user?.id)) {
            liked.add(creation.id)
          }
        })
        setLikedItems(liked)
      } else {
        toast.error(data.message || 'Something went wrong.')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }

    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken()

      // Optimistically update UI first
      const newLiked = new Set(likedItems)
      if (newLiked.has(id)) {
        newLiked.delete(id)
      } else {
        newLiked.add(id)
      }
      setLikedItems(newLiked)

      const { data } = await axios.post(
        '/api/user/toggle-like-creations',
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (data.success) {
        console.log('Like toggle response:', data)
        toast.success(data.message)
        // Refresh to get accurate data from backend
        setTimeout(() => fetchCreations(), 300)
      } else {
        toast.error(data.message)
        // Revert on error
        setLikedItems(likedItems)
      }
    } catch (error) {
      console.error('Like toggle error:', error)
      toast.error(error?.response?.data?.message || error.message)
      // Revert on error
      setLikedItems(likedItems)
    }
  }

  useEffect(() => {
    if (isLoaded && user) fetchCreations()
  }, [isLoaded, user])

  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50'>
      {/* Header */}
      <div className='mb-2 md:mb-4'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 md:p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg'>
            <Users className='w-5 h-5 md:w-6 md:h-6 text-blue-600' />
          </div>
          <h2 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
            Community Creations
          </h2>
        </div>
        <p className='text-sm md:text-base text-gray-600 ml-10 md:ml-11'>
          Explore and like amazing creations from the community
        </p>
      </div>

      {/* Content Container */}
      <div className='bg-white/80 backdrop-blur-sm h-full w-full rounded-2xl overflow-y-auto p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100'>
        {/* Loading State */}
        {loading && (
          <div className='flex justify-center items-center h-full'>
            <div className='flex flex-col items-center gap-4'>
              <span className='w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin'></span>
              <p className='text-gray-600 font-medium'>Loading creations...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && creations.length === 0 && (
          <div className='flex justify-center items-center h-full'>
            <div className='text-center'>
              <div className='p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-fit mx-auto mb-4'>
                <Grid2X2 className='w-12 h-12 text-blue-400' />
              </div>
              <p className='text-gray-600 font-semibold text-lg'>
                No community creations yet
              </p>
              <p className='text-gray-500 text-sm mt-2'>
                Be the first to share your creations!
              </p>
            </div>
          </div>
        )}

        {/* Grid Layout */}
        {!loading && creations.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
            {creations.map((creation) => (
              <div
                key={creation.id}
                className='group flex flex-col h-full rounded-xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-300'
              >
                {/* Image Container */}
                <div className='relative w-full aspect-square overflow-hidden bg-gray-100'>
                  <img
                    src={creation.content}
                    alt={creation.prompt || 'Creation'}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />

                  {/* Overlay on Hover */}
                  <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4'>
                    <div></div>
                    <p className='text-white text-sm line-clamp-3 font-medium'>
                      {creation.prompt}
                    </p>
                  </div>
                </div>

                {/* Likes Row */}
                <div className='p-3 md:p-4 flex items-center gap-2 border-t border-gray-100'>
                  <button
                    onClick={() => imageLikeToggle(creation.id)}
                    className='flex items-center gap-2 group/btn'
                  >
                    <Heart
                      className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-200 cursor-pointer hover:scale-110 ${
                        likedItems.has(creation.id)
                          ? 'fill-red-500 text-red-600 animate-pulse'
                          : 'text-gray-400 group-hover/btn:text-red-500'
                      }`}
                    />
                    <span
                      className={`text-sm md:text-base font-semibold transition-colors duration-200 ${
                        likedItems.has(creation.id)
                          ? 'text-red-600'
                          : 'text-gray-600 group-hover/btn:text-red-600'
                      }`}
                    >
                      {creation.likes?.length || 0}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full bg-gradient-to-br from-slate-50 via-white to-slate-50'>
      <div className='flex flex-col items-center gap-4'>
        <span className='w-14 h-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin'></span>
        <p className='text-gray-600 font-medium text-lg'>Loading...</p>
      </div>
    </div>
  )
}

export default Community