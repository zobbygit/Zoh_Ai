







import { BrushCleaning, Eraser, MountainSnow, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveBackground = () => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )

      if (data.success) {
        setContent(data.content)
        toast.success('Background removed successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen overflow-y-scroll p-4 md:p-6 lg:p-12 bg-gradient-to-br from-orange-50 via-white to-orange-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8 md:mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-4'>
            <Sparkles className='w-5 h-5 text-orange-600' />
            <span className='text-sm font-semibold text-orange-700'>AI-Powered Background Removal</span>
          </div>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#d97706] via-[#ea580c] to-[#f97316] bg-clip-text text-transparent mb-2'>
            Background Removal
          </h1>
          <p className='text-gray-600 text-sm md:text-base'>Remove image backgrounds with AI precision in seconds</p>
        </div>

        {/* Main Grid */}
        <div className='grid lg:grid-cols-2 gap-6 md:gap-8 items-start'>
          {/* LEFT: FORM */}
          <form
            onSubmit={onSubmitHandler}
            className='bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl border-2 border-orange-100 shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 h-fit lg:sticky lg:top-12'
          >
            <div className='flex items-center gap-3 mb-8'>
              <div className='p-3 bg-orange-50 rounded-xl shadow-inner'>
                <MountainSnow className='w-6 h-6 text-[#d97706]' />
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-[#d97706] to-[#ea580c] bg-clip-text text-transparent'>
                  Background Removal
                </h2>
                <p className='text-xs text-gray-500 mt-0.5'>Powered by advanced AI</p>
              </div>
            </div>

            <div className='space-y-6'>
              {/* File Upload */}
              <div>
                <label className='block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2'>
                  <span className='w-2 h-2 bg-orange-600 rounded-full'></span>
                  Upload Image
                </label>
                <div className='relative'>
                  <input
                    onChange={(e) => setInput(e.target.files[0])}
                    type='file'
                    accept='image/*'
                    disabled={loading}
                    className='w-full p-4 text-sm rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 bg-white shadow-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 file:cursor-pointer cursor-pointer disabled:opacity-60'
                    required
                  />
                </div>
                <p className='text-xs text-gray-500 font-light mt-3'>
                  Supports JPG, PNG, JPEG and other image formats
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading || !input}
              className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-[#d97706] to-[#ea580c] hover:from-[#b45309] hover:to-[#c2410c] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold px-6 py-3 md:py-4 mt-8 text-sm md:text-base rounded-xl cursor-pointer shadow-2xl hover:shadow-orange-300/50 disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 disabled:hover:scale-100 disabled:hover:translate-y-0'
            >
              {loading ? (
                <>
                  <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin' />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Eraser className='w-5 h-5' />
                  <span>Remove Background</span>
                </>
              )}
            </button>

            {/* Pro Tip */}
            <div className='mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200'>
              <p className='text-xs text-gray-600 text-center'>
                💡 <span className='font-semibold'>Pro Tip:</span> Clear PNG format works best for transparent backgrounds
              </p>
            </div>
          </form>

          {/* RIGHT: RESULT */}
          <div className='bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl border-2 border-orange-100 shadow-2xl min-h-96 md:min-h-[600px] flex flex-col'>
            <div className='flex items-center gap-3 mb-6 pb-6 border-b-2 border-orange-200'>
              <div className='p-3 bg-orange-50 rounded-xl shadow-inner'>
                <BrushCleaning className='w-6 h-6 text-[#d97706]' />
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold text-gray-800'>Processed Image</h2>
                <p className='text-xs text-gray-500 mt-0.5'>Your background-free image</p>
              </div>
            </div>

            {!content ? (
              <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center gap-6 text-gray-400 px-4'>
                  <div className='relative'>
                    <div className='p-6 bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl shadow-lg'>
                      <BrushCleaning className='w-12 h-12 md:w-14 md:h-14 text-orange-300' />
                    </div>
                    <div className='absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse'></div>
                  </div>
                  <div className='text-center max-w-xs space-y-2'>
                    <p className='font-semibold text-gray-600 text-base'>Ready to Process?</p>
                    <p className='text-gray-500 text-sm'>Select an image and click <span className='font-semibold text-orange-600'>"Remove Background"</span> to start</p>
                  </div>
                  <div className='flex gap-2 mt-4'>
                    <span className='w-2 h-2 bg-orange-400 rounded-full animate-bounce'></span>
                    <span className='w-2 h-2 bg-amber-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></span>
                    <span className='w-2 h-2 bg-yellow-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='mt-3 h-full overflow-hidden rounded-xl border-2 border-orange-100 shadow-inner'>
                <img src={content} alt='Processed Image' className='w-full h-full object-cover' />
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className='mt-8 text-center'>
          <div className='inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md'>
            <span className='text-sm text-gray-600'>✨ Removing backgrounds with AI precision</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveBackground
