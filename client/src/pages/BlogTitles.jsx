


import { CaptionsIcon, Edit, Newspaper, PenBox, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const BlogTitles = () => {
  const blogCategories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food',
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input.trim()) {
      toast.error('Please enter a keyword or topic')
      return
    }

    try {
      setLoading(true)
     

      const token = await getToken()
     
const { data } = await axios.post(
  '/api/ai/generate-blog-title',
  {
    keyword: input,
    category: selectedCategory
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)





   if (data.success) {
  setContent(data.content)
  toast.success('Blog titles generated successfully')
} else {
  toast.error(data.message || 'Something went wrong')
}
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate title. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen overflow-y-scroll p-4 md:p-6 lg:p-12 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8 md:mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-4'>
            <Sparkles className='w-5 h-5 text-purple-600' />
            <span className='text-sm font-semibold text-purple-700'>AI-Powered Content Generator</span>
          </div>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#6b19e6] via-[#a522ec] to-[#d946a6] bg-clip-text text-transparent mb-2'>
            Blog Title Generator
          </h1>
          <p className='text-gray-600 text-sm md:text-base'>Create captivating titles for your blog posts in seconds</p>
        </div>

        {/* Main Grid */}
        <div className='grid lg:grid-cols-2 gap-6 md:gap-8 items-start'>
          {/* LEFT: FORM */}
          <form
            onSubmit={onSubmitHandler}
            className='bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-pink-200 shadow-2xl hover:shadow-pink-200/50 transition-all duration-300 h-fit lg:sticky lg:top-12'
          >
            <div className='flex items-center gap-3 mb-8'>
              <div className='p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-inner'>
                <CaptionsIcon className='w-6 h-6 text-[#6b19e6]' />
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-[#6b19e6] to-[#d946a6] bg-clip-text text-transparent'>
                  AI Title Generation
                </h2>
                <p className='text-xs text-gray-500 mt-0.5'>Powered by advanced AI</p>
              </div>
            </div>

            <div className='space-y-6'>
              {/* Keyword Input */}
              <div>
                <label className='block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2'>
                  <span className='w-2 h-2 bg-purple-500 rounded-full'></span>
                  Keyword or Topic
                </label>
                <div className='relative'>
                  <input
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    type='text'
                    disabled={loading}
                    className='w-full p-4 text-sm rounded-xl border-2 border-pink-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 bg-white shadow-sm disabled:opacity-60'
                    placeholder='The future of Artificial Intelligence'
                  />
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className='block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2'>
                  <span className='w-2 h-2 bg-pink-500 rounded-full'></span>
                  Select Category
                </label>
                <div className='flex gap-2.5 flex-wrap'>
                  {blogCategories.map((item) => (
                    <button
                      key={item}
                      type='button'
                      onClick={() => setSelectedCategory(item)}
                      disabled={loading}
                      className={`text-sm px-4 md:px-5 py-2 md:py-2.5 border-2 rounded-xl cursor-pointer transition-all duration-200 font-semibold ${
                        selectedCategory === item
                          ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-300 shadow-lg shadow-pink-200/50 scale-105'
                          : 'text-gray-600 border-pink-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:scale-105 bg-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading || !input.trim()}
              className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-[#a522ec] via-[#b22bde] to-[#d946a6] hover:from-[#9418db] hover:via-[#a01ddd] hover:to-[#c93591] disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold px-6 py-3 md:py-4 mt-8 text-sm md:text-base rounded-xl cursor-pointer shadow-2xl hover:shadow-pink-300/50 disabled:shadow-none transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] disabled:hover:translate-y-0 disabled:hover:scale-100'
            >
              {loading ? (
                <>
                  <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin' />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <PenBox className="w-5 h-5" />
                  <span>Generate Amazing Titles</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Pro Tip */}
            <div className='mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-pink-200'>
              <p className='text-xs text-gray-600 text-center'>
                💡 <span className='font-semibold'>Pro Tip:</span> Be specific with your keywords for better results
              </p>
            </div>
          </form>

          {/* RIGHT: RESULT */}
          <div className='bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl flex flex-col border border-pink-200 shadow-2xl min-h-96 md:min-h-[600px]'>
            <div className='flex items-center gap-3 mb-6 pb-6 border-b-2 border-pink-200'>
              <div className='p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-inner'>
                <Edit className='w-6 h-6 text-[#a01ddd]' />
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold text-gray-800'>Generated Titles</h2>
                <p className='text-xs text-gray-500 mt-0.5'>Your AI-crafted blog titles</p>
              </div>
            </div>

            {!content ? (
              <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center gap-6 text-gray-400 px-4'>
                  <div className='relative'>
                    <div className='p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg'>
                      <Newspaper className='w-12 h-12 md:w-14 md:h-14 text-purple-400' />
                    </div>
                    <div className='absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full animate-pulse'></div>
                  </div>
                  <div className='text-center max-w-xs space-y-2'>
                    <p className='font-semibold text-gray-600 text-base'>Ready to Create?</p>
                    <p className='text-gray-500 text-sm'>Enter your topic and click <span className='font-semibold text-purple-600'>"Generate Amazing Titles"</span> to start creating</p>
                  </div>
                  <div className='flex gap-2 mt-4'>
                    <span className='w-2 h-2 bg-purple-400 rounded-full animate-bounce'></span>
                    <span className='w-2 h-2 bg-pink-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></span>
                    <span className='w-2 h-2 bg-rose-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='mt-3 h-full overflow-y-auto text-sm text-slate-600 leading-relaxed'>
                <div className='prose prose-sm max-w-none prose-headings:text-purple-900 prose-li:text-gray-700 prose-strong:text-purple-900'>
                  <Markdown
                    components={{
                      h1: ({node, ...props}) => <h1 className='text-xl md:text-2xl font-bold text-purple-900 mt-4 mb-3' {...props} />,
                      h2: ({node, ...props}) => <h2 className='text-lg md:text-xl font-bold text-purple-800 mt-3 mb-2' {...props} />,
                      ul: ({node, ...props}) => <ul className='list-disc list-inside space-y-2 mb-3' {...props} />,
                      li: ({node, ...props}) => <li className='text-gray-700 text-sm md:text-base' {...props} />,
                      p: ({node, ...props}) => <p className='text-gray-700 mb-3 text-sm md:text-base' {...props} />,
                    }}
                  >
                    {content}
                  </Markdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className='mt-8 text-center'>
          <div className='inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md'>
            <span className='text-sm text-gray-600'>✨ Generating creative titles with AI magic</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogTitles
