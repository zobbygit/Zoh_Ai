


import React, { useState } from 'react'
import { Image, ImageDown, Images, Wallpaper, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const GenerateImages = () => {
  const imageStyle = [
    'Realistic',
    'Ghibli Style',
    'Anime Style',
    'Cartoon Style',
    'Fantasy Style',
    'Realistic Style',
    '3D Style',
    'Portrait Style',
  ]

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const prompt = `generate an image pf ${input} in the style ${selectedStyle}`

      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )

      if (data.success) {
        setContent(data.content)
        toast.success('Image generated successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen overflow-y-scroll p-4 md:p-6 lg:p-12 bg-gradient-to-br from-red-50 via-white to-red-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8 md:mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-4'>
            <Sparkles className='w-5 h-5 text-red-600' />
            <span className='text-sm font-semibold text-red-700'>AI-Powered Image Creator</span>
          </div>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#b81419] via-[#e61920] to-[#d41f1f] bg-clip-text text-transparent mb-2'>
            AI Image Generator
          </h1>
          <p className='text-gray-600 text-sm md:text-base'>Create stunning images with AI in your preferred style</p>
        </div>

        {/* Main Grid */}
        <div className='grid lg:grid-cols-2 gap-6 md:gap-8 items-start'>
          {/* LEFT: FORM */}
          <form
            onSubmit={onSubmitHandler}
            className='bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl border-2 border-red-100 shadow-2xl hover:shadow-red-200/50 transition-all duration-300 h-fit lg:sticky lg:top-12'
          >
            <div className='flex items-center gap-3 mb-8'>
              <div className='p-3 bg-red-50 rounded-xl shadow-inner'>
                <ImageDown className='w-6 h-6 text-[#b81419]' />
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-[#b81419] to-[#d41f1f] bg-clip-text text-transparent'>
                  AI Image Generation
                </h2>
                <p className='text-xs text-gray-500 mt-0.5'>Powered by advanced AI</p>
              </div>
            </div>

            <div className='space-y-6'>
              {/* Description */}
              <div>
                <label className='block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2'>
                  <span className='w-2 h-2 bg-red-600 rounded-full'></span>
                  Describe Your Image
                </label>
                <textarea
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  rows={5}
                  disabled={loading}
                  className='w-full p-4 text-sm rounded-xl border-2 border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 outline-none transition-all duration-200 bg-white shadow-sm resize-none disabled:opacity-60'
                  placeholder='Describe how you want your image to be...'
                  required
                />
              </div>

              {/* Style Selection */}
              <div>
                <label className='block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2'>
                  <span className='w-2 h-2 bg-red-600 rounded-full'></span>
                  Choose Style
                </label>
                <div className='flex gap-2.5 flex-wrap'>
                  {imageStyle.map((item) => (
                    <button
                      key={item}
                      type='button'
                      onClick={() => setSelectedStyle(item)}
                      disabled={loading}
                      className={`text-sm px-4 md:px-5 py-2 md:py-2.5 border-2 rounded-xl cursor-pointer transition-all duration-200 font-semibold ${
                        selectedStyle === item
                          ? 'bg-gradient-to-r from-[#b81419] to-[#d41f1f] text-white border-red-600 shadow-lg shadow-red-300/50 scale-105'
                          : 'text-gray-600 border-red-200 bg-white hover:border-red-300 hover:bg-red-50 hover:scale-105'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Publish Toggle */}
              <div className='pt-2'>
                <div
                  onClick={() => !loading && setPublish(!publish)}
                  className='flex items-center gap-3 cursor-pointer group'
                >
                  <div className='relative'>
                    <input
                      type='checkbox'
                      onChange={(e) => setPublish(e.target.checked)}
                      checked={publish}
                      disabled={loading}
                      className='sr-only peer'
                    />
                    <div className='w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[#b81419] peer-checked:to-[#d41f1f] transition-all duration-300 shadow-inner'></div>
                    <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-md'></span>
                  </div>
                  <p className='text-sm font-medium text-gray-700 group-hover:text-gray-900'>
                    Publish this image to community
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading || !input.trim()}
              className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-[#b81419] to-[#d41f1f] hover:from-[#9e1015] hover:to-[#b81419] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold px-6 py-3 md:py-4 mt-8 text-sm md:text-base rounded-xl cursor-pointer shadow-2xl hover:shadow-red-300/50 disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 disabled:hover:scale-100 disabled:hover:translate-y-0'
            >
              {loading ? (
                <>
                  <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin' />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Image className='w-5 h-5' />
                  <span>Generate Image</span>
                </>
              )}
            </button>

            {/* Pro Tip */}
            <div className='mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200'>
              <p className='text-xs text-gray-600 text-center'>
                💡 <span className='font-semibold'>Pro Tip:</span> Be descriptive for better quality images
              </p>
            </div>
          </form>

          {/* RIGHT: RESULT */}
          <div className='bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl border-2 border-red-100 shadow-2xl min-h-96 md:min-h-[600px] flex flex-col'>
            <div className='flex items-center gap-3 mb-6 pb-6 border-b-2 border-red-200'>
              <div className='p-3 bg-red-50 rounded-xl shadow-inner'>
                <Images className='w-6 h-6 text-[#b81419]' />
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold text-gray-800'>Generated Image</h2>
                <p className='text-xs text-gray-500 mt-0.5'>Your AI-created masterpiece</p>
              </div>
            </div>

            {!content ? (
              <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center gap-6 text-gray-400 px-4'>
                  <div className='relative'>
                    <div className='p-6 bg-gradient-to-br from-red-100 to-orange-50 rounded-2xl shadow-lg'>
                      <Wallpaper className='w-12 h-12 md:w-14 md:h-14 text-red-300' />
                    </div>
                    <div className='absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full animate-pulse'></div>
                  </div>
                  <div className='text-center max-w-xs space-y-2'>
                    <p className='font-semibold text-gray-600 text-base'>Ready to Create?</p>
                    <p className='text-gray-500 text-sm'>Describe your image and click <span className='font-semibold text-red-600'>"Generate Image"</span> to start creating</p>
                  </div>
                  <div className='flex gap-2 mt-4'>
                    <span className='w-2 h-2 bg-red-400 rounded-full animate-bounce'></span>
                    <span className='w-2 h-2 bg-orange-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></span>
                    <span className='w-2 h-2 bg-rose-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='mt-3 h-full overflow-hidden rounded-xl border-2 border-red-100 shadow-inner'>
                <img src={content} alt='Generated Image' className='w-full h-full object-cover' />
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className='mt-8 text-center'>
          <div className='inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md'>
            <span className='text-sm text-gray-600'>🎨 Creating stunning images with AI magic</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateImages









