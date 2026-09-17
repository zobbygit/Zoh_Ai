
import { FunnelIcon, Scissors, Sparkles, SparkleIcon,X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveObject = () => {
  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      if (object.split(' ').length > 1) {
        toast.error('Please enter only one object name at a time')
        setLoading(false)
        return
      }
      const formData = new FormData()
      formData.append('image', input)
      formData.append('object', object)

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )

      if (data.success) {
        setContent(data.content)
        toast.success('Object removed successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
const removeGenerated = () => {
  setContent("");
  toast.success("Generated image removed.");
};
  return (
    <div className='min-h-screen overflow-y-scroll p-4 md:p-6 lg:p-12 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8 md:mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-4'>
            <Sparkles className='w-5 h-5 text-purple-600' />
            <span className='text-sm font-semibold text-purple-700'>AI-Powered Object Removal</span>
          </div>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent mb-2'>
            Object Removal
          </h1>
          <p className='text-gray-600 text-sm md:text-base'>Remove unwanted objects from images with AI precision</p>
        </div>

        {/* Main Grid */}
        <div className='grid lg:grid-cols-2 gap-6 md:gap-8 items-start'>
          {/* LEFT: FORM */}
          <form
            onSubmit={onSubmitHandler}
            className='bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl border-2 border-purple-200 shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 h-fit lg:sticky lg:top-12'
          >
            <div className='flex items-center gap-3 mb-8'>
              <div className='p-3 bg-purple-100 rounded-xl shadow-inner'>
                <SparkleIcon className='w-6 h-6 text-purple-600' />
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent'>
                  Object Removal
                </h2>
                <p className='text-xs text-gray-500 mt-0.5'>Powered by advanced AI</p>
              </div>
            </div>

            <div className='space-y-6'>
              {/* File Upload */}
              <div>
                <label className='block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2'>
                  <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
                  Upload Image
                </label>
                <div className='relative'>
                  <input
                    onChange={(e) => setInput(e.target.files[0])}
                    type='file'
                    accept='image/*'
                    disabled={loading}
                    className='w-full p-4 text-sm rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 bg-white shadow-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 file:cursor-pointer cursor-pointer disabled:opacity-60'
                    required
                  />
                </div>
              </div>

              {/* Object Description */}
              <div>
                <label className='block text-sm font-bold mb-3 text-gray-800 flex items-center gap-2'>
                  <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
                  Describe Object to Remove
                </label>
                <textarea
                  onChange={(e) => setObject(e.target.value)}
                  value={object}
                  rows={5}
                  disabled={loading}
                  className='w-full p-4 text-sm rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 bg-white shadow-sm resize-none disabled:opacity-60'
                  placeholder='e.g., watch or spoon - Only single object name!'
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading || !input || !object.trim()}
              className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold px-6 py-3 md:py-4 mt-8 text-sm md:text-base rounded-xl cursor-pointer shadow-2xl hover:shadow-purple-300/50 disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 disabled:hover:scale-100 disabled:hover:translate-y-0'
            >
              {loading ? (
                <>
                  <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin' />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Scissors className='w-5 h-5' />
                  <span>Remove Object</span>
                </>
              )}
            </button>

            {/* Pro Tip */}
            <div className='mt-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200'>
              <p className='text-xs text-gray-600 text-center'>
                💡 <span className='font-semibold'>Pro Tip:</span> Use single word object names for best results
              </p>
            </div>
          </form>

          {/* RIGHT: RESULT */}
          <div className='bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl border-2 border-purple-200 shadow-2xl min-h-96 md:min-h-[600px] flex flex-col'>
            <div className='flex items-center gap-3 mb-6 pb-6 border-b-2 border-purple-200'>
              <div className='p-3 bg-purple-100 rounded-xl shadow-inner'>
                <FunnelIcon className='w-6 h-6 text-purple-600' />
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold text-gray-800'>Processed Result</h2>
                <p className='text-xs text-gray-500 mt-0.5'>Your object-removed image</p>
              </div>
            </div>

            {!content ? (
              <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center gap-6 text-purple-400 px-4'>
                  <div className='relative'>
                    <div className='p-6 bg-gradient-to-br from-purple-100 to-violet-50 rounded-2xl shadow-lg'>
                      <FunnelIcon className='w-12 h-12 md:w-14 md:h-14 text-purple-400' />
                    </div>
                    <div className='absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-pulse'></div>
                  </div>
                  <div className='text-center max-w-xs space-y-2'>
                    <p className='font-semibold text-gray-600 text-base'>Ready to Remove?</p>
                    <p className='text-gray-500 text-sm'>Select an image, describe the object, and click <span className='font-semibold text-purple-600'>"Remove Object"</span> to start</p>
                  </div>
                  <div className='flex gap-2 mt-4'>
                    <span className='w-2 h-2 bg-purple-400 rounded-full animate-bounce'></span>
                    <span className='w-2 h-2 bg-violet-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></span>
                    <span className='w-2 h-2 bg-purple-500 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></span>
                  </div>
                </div>
              </div>

) : (
  <div className="relative mt-3 h-full overflow-hidden rounded-xl border-2 border-purple-200 shadow-inner group">

    {/* Generated Image */}
    <img
      src={content}
      alt="Processed Image"
      className="w-full h-full object-cover"
    />

    {/* Remove Generated Result */}
    <button
      type="button"
      onClick={removeGenerated}
      title="Remove generated image"
      className="absolute top-3 right-3 p-2 rounded-full bg-pink-100/95 text-pink-600 border border-pink-300 shadow-lg hover:bg-pink-200 hover:text-pink-700 hover:scale-110 transition-all duration-200"
    >
      <X className="w-5 h-5" />
    </button>

  </div>
)}


          </div>
        </div>

        {/* Footer Info */}
        <div className='mt-8 text-center'>
          <div className='inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md'>
            <span className='text-sm text-gray-600'>✨ Removing objects with AI precision</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveObject