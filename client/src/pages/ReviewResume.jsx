


import { FileChartPieIcon, FileUser, ListCheck } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'

const ReviewResume = () => {
  
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const onSubmitHandler = async(e) => {
    e.preventDefault()

    try {
      setLoading(true)
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setContent(`# Resume Analysis & Feedback

## 📊 Overall Assessment
Your resume demonstrates a solid foundation with clear structure and professional formatting. With some targeted improvements, you can significantly enhance its impact with recruiters and hiring managers.

## ✅ Strengths

- **Clear Structure**: Well-organized sections with logical flow make it easy to scan
- **Professional Formatting**: Consistent font usage and proper spacing throughout
- **Relevant Experience**: Your work history clearly demonstrates progressive responsibility
- **Quantifiable Achievements**: Good use of metrics in some sections

## 🎯 Areas for Improvement

### 1. Quantify All Achievements
Add specific metrics and numbers to every role:
- Instead of: "Improved sales performance"
- Use: "Increased quarterly sales by 35% through data-driven strategies"

### 2. Strengthen Your Summary
Your current summary is generic. Make it compelling by:
- Highlighting your unique value proposition
- Mentioning key achievements
- Including 2-3 relevant skills

### 3. Action Verbs
Replace weak verbs with powerful action words:
- ❌ Responsible for
- ✅ Spearheaded, Transformed, Optimized, Accelerated

### 4. Expand Technical Skills
Dedicate a section to:
- Programming languages and frameworks
- Tools and platforms
- Certifications and credentials

## 💡 Specific Recommendations

1. **Add Keywords**: Include industry-specific keywords to improve ATS compatibility
2. **Expand Experience Descriptions**: Each role should have 3-4 bullet points with concrete results
3. **Update Dates**: Ensure all dates are current and consistent
4. **Include Links**: Add portfolio URL, LinkedIn, or GitHub to demonstrate work

## 🚀 Next Steps

1. Revise your summary statement to be more impactful
2. Add quantifiable metrics to all positions
3. Review for ATS optimization
4. Get feedback from industry professionals

---
*This analysis is based on current best practices in recruitment and hiring. Customize recommendations based on your specific industry and target roles.*`)
      toast.success('Resume Reviewed Successfully!')
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen p-6 text-slate-700 bg-gradient-to-br from-yellow-50 via-white to-yellow-100'>
      
      {/* Big Title Section - Centered */}
      <div className='flex justify-center mb-16'>
        <div className='text-center'>
          {/* Badge */}
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-6'>
            <FileUser className='w-4 h-4 text-[#d4b400]' />
            <span className='text-sm font-semibold text-[#d4b400]'>AI-Powered Resume Review</span>
          </div>
          
          {/* Main Title */}
          <h1 className='text-6xl font-bold bg-gradient-to-r from-[#d4b400] to-[#b89400] bg-clip-text text-transparent mb-3'>
            Review Resume
          </h1>
          
          {/* Subtitle */}
          <p className='text-lg text-gray-600'>
            Get AI-powered feedback to enhance your resume
          </p>
        </div>
      </div>

      <div className='flex justify-center items-start gap-6 lg:gap-10 flex-col lg:flex-row w-full'>
      {/* Left Card - Form */}
      <form 
        onSubmit={onSubmitHandler} 
        className='w-full lg:w-1/2 lg:max-w-xl p-6 lg:p-8 bg-white rounded-2xl border border-yellow-200 shadow-xl shadow-yellow-200/50 hover:shadow-2xl hover:shadow-yellow-300/70 transition-all duration-300'
      >
        
        <div className='flex items-center gap-4 mb-6'>
          <div className='p-3 rounded-lg bg-yellow-50 border border-yellow-200'>
            <FileUser className='w-6 lg:w-7 h-6 lg:h-7 text-[#d4b400]' />
          </div>
          <h1 className='text-xl lg:text-2xl font-bold text-gray-800'>Review Your Resume</h1>
        </div>

        <label className='block mt-6 text-sm font-semibold text-gray-700'>
          Upload Resume
        </label>

        <input 
          onChange={(e) => setInput(e.target.files[0])} 
          type="file" 
          accept="application/pdf" 
          required
          className='cursor-pointer w-full p-3 mt-2 text-sm rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-2 
          focus:ring-yellow-100 outline-none transition-all text-gray-700 
          file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-yellow-50 file:text-yellow-700 file:font-semibold hover:file:bg-yellow-100'
        />

        <p className='text-xs text-gray-500 mt-2 font-light'>Supports PDF only</p>

        <button 
          type="submit"
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 mt-8 bg-gradient-to-r 
          from-[#d4b400] to-[#b89400] hover:from-[#b89400] hover:to-[#8a6f00] disabled:from-gray-400 disabled:to-gray-500
          text-white font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-yellow-300/50 
          hover:shadow-xl hover:shadow-yellow-400/80 transition-all duration-300 transform hover:scale-[1.03] disabled:scale-100'
        >
          {loading ? (
            <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin' />
          ) : (
            <ListCheck className="w-5 h-5" />
          )}
          <span>{loading ? 'Reviewing...' : 'Review Resume'}</span>
        </button>

      </form>

      {/* Right Card - Response */}
      <div className='w-full lg:w-1/2 lg:max-w-xl p-6 lg:p-8 bg-white rounded-2xl border border-yellow-200 shadow-xl shadow-yellow-200/50 min-h-[500px] lg:min-h-[600px] flex flex-col transition-all'>

        <div className='flex items-center gap-4 mb-6'>
          <div className='p-3 bg-yellow-50 rounded-lg border border-yellow-200'>
            <FileChartPieIcon className='w-6 h-6 text-[#d4b400]' />
          </div>
          <h1 className='text-xl font-bold text-gray-800'>Generated Response</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center bg-gradient-to-br from-yellow-50/40 to-transparent rounded-xl border-2 border-dashed border-yellow-300'>
            <div className='text-sm flex flex-col items-center gap-6 text-gray-500 p-6'>
              <div className='p-5 bg-yellow-50 rounded-full border border-yellow-200'>
                <FileChartPieIcon className='w-12 h-12 text-yellow-300' />
              </div>
              <p className='font-medium text-center text-gray-600'>
                Select a file and click <br />"Review Resume"
              </p>
            </div>
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto pr-3'>
            <div className='prose prose-sm max-w-none 
              prose-headings:font-bold prose-headings:text-gray-800
              prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-li:text-gray-700 prose-li:marker:text-[#d4b400]
              prose-strong:text-gray-800 prose-strong:font-semibold
              prose-em:text-gray-700
              prose-a:text-[#d4b400] hover:prose-a:text-[#b89400]
              prose-code:bg-yellow-50 prose-code:text-[#d4b400] prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-blockquote:border-l-4 prose-blockquote:border-[#d4b400] prose-blockquote:pl-4
              space-y-3'>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}

      </div>

      </div>
    </div>
  )
}

export default ReviewResume